"use server";

import { createHash } from "node:crypto";
import { z } from "zod";
import { AdminInputError, adminAction } from "@/lib/admin-auth";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/contact-message";

export const setMessageStatus = async (id: unknown, status: unknown) =>
  adminAction(async () => {
    const messageId = z.string().regex(/^[a-f\d]{24}$/i).parse(id);
    await connectDB();
    await ContactMessage.updateOne({ _id: messageId }, { $set: { status: z.enum(["new", "read"]).parse(status) } });
  });

/*
 * Signed Cloudinary upload: the browser uploads the file straight to Cloudinary
 * with this one-time signature, so the API secret never leaves the server.
 */
export const getUploadSignature = async (folder: unknown) =>
  adminAction(async () => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new AdminInputError(
        "Image uploads aren't set up yet. Add the Cloudinary keys (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
      );
    }
    const target = `modz-tech/${z.enum(["products", "banners"]).parse(folder)}`;
    const timestamp = Math.floor(Date.now() / 1000);
    // Cloudinary signature: SHA-1 of the sorted params + API secret.
    const signature = createHash("sha1").update(`folder=${target}&timestamp=${timestamp}${apiSecret}`).digest("hex");
    return { cloudName, apiKey, timestamp, signature, folder: target };
  });
