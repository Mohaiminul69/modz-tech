"use server";

import { headers } from "next/headers";
import { type ContactErrors, contactSchema, toContactErrors } from "@/lib/contact-schema";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/contact-message";

// Spam protection: daily caps per phone number and per device/IP.
const MAX_PER_PHONE_PER_DAY = 3;
const MAX_PER_IP_PER_DAY = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ContactResult = { ok: true } | { ok: false; message: string; fieldErrors?: ContactErrors };

// `input` comes straight from the browser, so it's `unknown` until the schema has checked it.
export const sendContactMessage = async (input: unknown): Promise<ContactResult> => {
  // Honeypot: real people never fill the hidden "website" field. Pretend success for bots.
  if (typeof input === "object" && input !== null && "website" in input && (input as { website?: unknown }).website) {
    return { ok: true };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please check the highlighted fields.", fieldErrors: toContactErrors(parsed.error) };
  }

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || headerList.get("x-real-ip") || undefined;
  const since = new Date(Date.now() - DAY_MS);

  await connectDB();
  const [phoneCount, ipCount] = await Promise.all([
    ContactMessage.countDocuments({ phone: parsed.data.phone, createdAt: { $gte: since } }),
    ip ? ContactMessage.countDocuments({ "meta.ip": ip, createdAt: { $gte: since } }) : Promise.resolve(0),
  ]);
  if (phoneCount >= MAX_PER_PHONE_PER_DAY || ipCount >= MAX_PER_IP_PER_DAY) {
    return { ok: false, message: "We've already received your messages today. We'll call you back soon." };
  }

  try {
    await ContactMessage.create({
      ...parsed.data,
      meta: { ip, userAgent: headerList.get("user-agent")?.slice(0, 300) ?? undefined },
    });
  } catch (error) {
    console.error("sendContactMessage failed", error);
    return { ok: false, message: "Something went wrong sending your message. Please try again or call us." };
  }

  // TODO(integrations stage): forward the message to Telegram.
  return { ok: true };
};
