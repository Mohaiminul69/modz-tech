"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { PHONE_ERROR, normalizeBdPhone } from "@/lib/phone";
import { Order, type OrderStatus } from "@/models/order";
import { allowAttempt } from "@/models/rate-limit-hit";

// Lookups per device per hour: plenty for customers, too few to guess phone numbers.
const MAX_LOOKUPS_PER_HOUR = 20;

export type TrackedOrder = {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  /** Latest time each status was reached (ISO). */
  reachedAt: Partial<Record<OrderStatus, string>>;
  courier: { name?: string; trackingId?: string; trackingUrl?: string };
  items: { name: string; variantName?: string; image?: string; quantity: number }[];
  total: number;
  deliveryFeeKnown: boolean;
};

export type TrackResult =
  | { ok: true; order: TrackedOrder }
  | { ok: false; message: string; field?: "orderNumber" | "phone" };

const inputSchema = z.object({
  orderNumber: z.string().trim().toUpperCase().max(20),
  phone: z.string().max(30),
});

// `input` comes straight from the browser, so it's `unknown` until checked.
export const trackOrder = async (input: unknown): Promise<TrackResult> => {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Enter your order number and phone number." };

  // Accept "1001", "MZ1001", "#MZ-1001" and "MZ-1001".
  const digits = parsed.data.orderNumber.replace(/[^\d]/g, "");
  if (!digits || digits.length > 9) {
    return { ok: false, field: "orderNumber", message: "Enter the order number, e.g. MZ-1001." };
  }
  const orderNumber = `MZ-${digits}`;
  const phone = normalizeBdPhone(parsed.data.phone);
  if (!phone) return { ok: false, field: "phone", message: PHONE_ERROR };

  await connectDB();
  const list = await headers();
  const ip = list.get("x-forwarded-for")?.split(",")[0]?.trim() || list.get("x-real-ip") || "unknown";
  if (!(await allowAttempt(`track:${ip}`, MAX_LOOKUPS_PER_HOUR))) {
    return { ok: false, message: "Too many lookups. Please wait a while, or message us on Facebook." };
  }

  const doc = await Order.findOne({ orderNumber }).lean();
  // Same message whether the order or the phone is wrong, so nothing leaks.
  if (!doc || doc.customer.phone !== phone) {
    return {
      ok: false,
      message: "We couldn't find an order with that number and phone. Check both and try again.",
    };
  }

  const reachedAt: Partial<Record<OrderStatus, string>> = {};
  for (const entry of doc.statusHistory) reachedAt[entry.status] = new Date(entry.at).toISOString();

  return {
    ok: true,
    order: {
      orderNumber: doc.orderNumber,
      status: doc.status,
      placedAt: new Date(doc.createdAt).toISOString(),
      reachedAt,
      courier: {
        name: doc.courier?.name || undefined,
        trackingId: doc.courier?.trackingId || undefined,
        trackingUrl: doc.courier?.trackingUrl || undefined,
      },
      items: doc.items.map((item) => ({
        name: item.name,
        variantName: item.variantName || undefined,
        image: item.image || undefined,
        quantity: item.quantity,
      })),
      total: doc.total,
      deliveryFeeKnown: doc.deliveryFee != null,
    },
  };
};
