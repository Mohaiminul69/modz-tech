"use server";

import { randomBytes } from "node:crypto";
import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { type FieldErrors, checkoutSchema, toFieldErrors } from "@/lib/checkout-schema";
import { connectDB } from "@/lib/db";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";
import { effectivePrice } from "@/lib/pricing";
import { nextSequence } from "@/models/counter";
import { Order, type OrderItem } from "@/models/order";
import { Product } from "@/models/product";

/*
 * Places a cash-on-delivery order. Nothing from the browser is trusted:
 * fields are re-validated, prices come from the database, and stock is
 * reserved with conditional updates so two shoppers can't buy the last unit.
 */

// Fake-order protection (requirements): daily caps per phone number and per device/IP.
const MAX_ORDERS_PER_PHONE_PER_DAY = 3;
const MAX_ORDERS_PER_IP_PER_DAY = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

export type PlaceOrderResult =
  | { ok: true; orderNumber: string; accessKey: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors; unavailable?: string[] };

const clientIp = async () => {
  const list = await headers();
  return list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || undefined;
};

// `input` comes straight from the browser, so it's `unknown` until the schema has checked it.
export const placeOrder = async (input: unknown): Promise<PlaceOrderResult> => {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors: toFieldErrors(parsed.error) };
  }
  const data = parsed.data;

  await connectDB();
  const headerList = await headers();
  const ip = await clientIp();
  const since = new Date(Date.now() - DAY_MS);

  const [phoneCount, ipCount] = await Promise.all([
    Order.countDocuments({ "customer.phone": data.phone, createdAt: { $gte: since } }),
    ip ? Order.countDocuments({ "meta.ip": ip, createdAt: { $gte: since } }) : Promise.resolve(0),
  ]);
  if (phoneCount >= MAX_ORDERS_PER_PHONE_PER_DAY || ipCount >= MAX_ORDERS_PER_IP_PER_DAY) {
    return {
      ok: false,
      message: "We've already received several orders from you today. Please message us on Messenger and we'll help.",
    };
  }

  // Merge duplicate lines for the same variant.
  const quantities = new Map<string, { productId: string; quantity: number }>();
  for (const item of data.items) {
    const existing = quantities.get(item.variantId);
    quantities.set(item.variantId, {
      productId: item.productId,
      quantity: Math.min(10, (existing?.quantity ?? 0) + item.quantity),
    });
  }

  // Fresh read (not cached): prices and names for the order snapshot.
  const productIds = [...new Set([...quantities.values()].map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: productIds }, active: true }).lean();
  const byId = new Map(products.map((product) => [product._id.toString(), product]));

  const items: OrderItem[] = [];
  const unavailable: string[] = [];
  for (const [variantId, { productId, quantity }] of quantities) {
    const product = byId.get(productId);
    const variant = product?.variants.find((option) => option._id.toString() === variantId);
    if (!product || !variant) {
      unavailable.push(variantId);
      continue;
    }
    items.push({
      product: product._id,
      variant: variant._id,
      sku: variant.sku,
      name: product.name,
      variantName: product.variants.length > 1 ? variant.name : undefined,
      image: (variant.images[0] ?? product.images[0])?.src,
      price: effectivePrice(variant),
      quantity,
    });
  }
  if (unavailable.length > 0) {
    return { ok: false, message: "Some items are no longer available. Please review your cart.", unavailable };
  }

  // Reserve stock line by line; undo everything if any line is short.
  const reserved: OrderItem[] = [];
  for (const item of items) {
    const result = await Product.updateOne(
      { _id: item.product, active: true, variants: { $elemMatch: { _id: item.variant, stock: { $gte: item.quantity } } } },
      { $inc: { "variants.$.stock": -item.quantity, soldCount: item.quantity } },
    );
    if (result.modifiedCount !== 1) {
      await Promise.all(
        reserved.map((done) =>
          Product.updateOne(
            { _id: done.product, "variants._id": done.variant },
            { $inc: { "variants.$.stock": done.quantity, soldCount: -done.quantity } },
          ),
        ),
      );
      return {
        ok: false,
        message: `Sorry, ${item.name}${item.variantName ? ` (${item.variantName})` : ""} just sold out or has fewer left. Please update your cart.`,
        unavailable: [item.variant.toString()],
      };
    }
    reserved.push(item);
  }

  const settings = await getSettings();
  const fee = settings.delivery[data.area === "inside" ? "insideDhaka" : "outsideDhaka"].fee;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = fee ?? null;

  try {
    const orderNumber = `MZ-${await nextSequence("order", 1000)}`;
    const accessKey = randomBytes(16).toString("hex");
    const now = new Date();

    await Order.create({
      orderNumber,
      accessKey,
      customer: { name: data.name, phone: data.phone, email: data.email },
      delivery: { area: data.area, district: data.district, address: data.address, note: data.note },
      items,
      subtotal,
      deliveryFee,
      total: subtotal + (deliveryFee ?? 0),
      paymentMethod: "cod",
      status: "pending",
      statusHistory: [{ status: "pending", at: now }],
      meta: { ip, userAgent: headerList.get("user-agent")?.slice(0, 300) ?? undefined },
    });

    // Stock and "best selling" changed: refresh cached product data.
    updateTag(PRODUCTS_TAG);

    // TODO(integrations stage): Telegram alert to the admin, confirmation email when `email` is set.

    return { ok: true, orderNumber, accessKey };
  } catch (error) {
    // Give the stock back if the order couldn't be saved.
    await Promise.all(
      reserved.map((done) =>
        Product.updateOne(
          { _id: done.product, "variants._id": done.variant },
          { $inc: { "variants.$.stock": done.quantity, soldCount: -done.quantity } },
        ),
      ),
    );
    console.error("placeOrder failed", error);
    return { ok: false, message: "Something went wrong placing your order. Please try again." };
  }
};
