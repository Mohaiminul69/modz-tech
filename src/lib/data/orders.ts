import "server-only";
import { timingSafeEqual } from "node:crypto";
import { connection } from "next/server";
import { connectDB } from "@/lib/db";
import { Order, type OrderStatus } from "@/models/order";

/*
 * Order data is personal (name, phone, address): never cached, always read per
 * request, and only returned when the caller proves access.
 */

export type CustomerOrder = {
  orderNumber: string;
  status: OrderStatus;
  customer: { name: string; phone: string; email?: string };
  delivery: { area: "inside" | "outside"; district: string; address: string; note?: string };
  items: { name: string; variantName?: string; image?: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number | null;
  total: number;
};

const sameSecret = (a: string, b: string) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

/** For the order-confirmed page: the secret key from the link must match. */
export const getOrderWithKey = async (orderNumber: string, key: string): Promise<CustomerOrder | null> => {
  await connection();
  if (!/^MZ-\d{1,9}$/.test(orderNumber) || !/^[a-f\d]{32}$/.test(key)) return null;

  await connectDB();
  const doc = await Order.findOne({ orderNumber }).select("+accessKey").lean();
  if (!doc || !sameSecret(doc.accessKey, key)) return null;

  return {
    orderNumber: doc.orderNumber,
    status: doc.status,
    customer: { name: doc.customer.name, phone: doc.customer.phone, email: doc.customer.email || undefined },
    delivery: {
      area: doc.delivery.area,
      district: doc.delivery.district,
      address: doc.delivery.address,
      note: doc.delivery.note || undefined,
    },
    items: doc.items.map((item) => ({
      name: item.name,
      variantName: item.variantName || undefined,
      image: item.image || undefined,
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: doc.subtotal,
    deliveryFee: doc.deliveryFee ?? null,
    total: doc.total,
  };
};
