"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { AdminInputError, adminAction } from "@/lib/admin-auth";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { connectDB } from "@/lib/db";
import { ORDER_STATUSES, Order } from "@/models/order";
import { Product } from "@/models/product";

const orderNumberSchema = z.string().regex(/^MZ-\d{1,9}$/);

const findOrder = async (orderNumber: unknown) => {
  const number = orderNumberSchema.parse(orderNumber);
  await connectDB();
  const order = await Order.findOne({ orderNumber: number });
  if (!order) throw new AdminInputError(`Order ${number} not found.`);
  return order;
};

export const updateOrderStatus = async (orderNumber: unknown, input: unknown) =>
  adminAction(async () => {
    const { status, note } = z
      .object({ status: z.enum(ORDER_STATUSES), note: z.string().trim().max(300).optional() })
      .parse(input);
    const order = await findOrder(orderNumber);
    if (order.status === status && !note) throw new AdminInputError("The order already has that status.");
    order.status = status;
    order.statusHistory.push({ status, at: new Date(), note: note || undefined });
    await order.save();
    // TODO(integrations stage): send the "shipped" email when status becomes "shipped" and an email is set.
  }, "Status updated.");

export const updateOrderCourier = async (orderNumber: unknown, input: unknown) =>
  adminAction(async () => {
    const courier = z
      .object({
        name: z.string().trim().max(60),
        trackingId: z.string().trim().max(80),
        trackingUrl: z.union([z.literal(""), z.url({ message: "Tracking link must be a full URL (https://…)." })]),
      })
      .parse(input);
    const order = await findOrder(orderNumber);
    order.courier = {
      name: courier.name || undefined,
      trackingId: courier.trackingId || undefined,
      trackingUrl: courier.trackingUrl || undefined,
    };
    await order.save();
  }, "Courier details saved.");

export const updateOrderNotes = async (orderNumber: unknown, notes: unknown) =>
  adminAction(async () => {
    const text = z.string().trim().max(2000).parse(notes);
    const order = await findOrder(orderNumber);
    order.adminNotes = text || undefined;
    await order.save();
  }, "Notes saved.");

/** Puts a cancelled/returned order's items back into stock (once). */
export const restoreOrderStock = async (orderNumber: unknown) =>
  adminAction(async () => {
    const order = await findOrder(orderNumber);
    if (!["cancelled", "returned", "not_reachable"].includes(order.status)) {
      throw new AdminInputError("Only cancelled, returned or not reachable orders can go back into stock.");
    }
    // Claim the restore atomically so a double click can't restock twice.
    const claimed = await Order.updateOne({ _id: order._id, stockRestored: { $ne: true } }, { $set: { stockRestored: true } });
    if (claimed.modifiedCount !== 1) throw new AdminInputError("This order's stock was already restored.");
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, "variants._id": item.variant },
        { $inc: { "variants.$.stock": item.quantity, soldCount: -item.quantity } },
      );
    }
    updateTag(PRODUCTS_TAG);
  }, "Items are back in stock.");
