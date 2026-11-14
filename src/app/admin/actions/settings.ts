"use server";

import { updateTag } from "next/cache";
import { adminAction } from "@/lib/admin-auth";
import { settingsSchema } from "@/lib/admin/settings-schema";
import { SETTINGS_TAG } from "@/lib/data/settings";
import { connectDB } from "@/lib/db";
import { Settings } from "@/models/settings";



export const saveSettings = async (input: unknown) =>
  adminAction(async () => {
    const data = settingsSchema.parse(input);
    await connectDB();
    const optionalNumber = (value: number | null | undefined) => (value == null ? undefined : value);

    await Settings.updateOne(
      { key: "site" },
      {
        $set: {
          phone: data.phone,
          email: data.email,
          hours: data.hours,
          facebookUrl: data.facebookUrl,
          messengerUrl: data.messengerUrl,
          whatsappUrl: data.whatsappUrl,
          delivery: {
            insideDhaka: { fee: optionalNumber(data.delivery.insideDhaka.fee), time: data.delivery.insideDhaka.time },
            outsideDhaka: { fee: optionalNumber(data.delivery.outsideDhaka.fee), time: data.delivery.outsideDhaka.time },
          },
          heroSlides: data.heroSlides.map((slide) => ({
            ...slide,
            badge: slide.badge || undefined,
            descriptionLong: slide.descriptionLong || undefined,
            price: optionalNumber(slide.price),
            oldPrice: optionalNumber(slide.oldPrice),
          })),
          promoTiles: data.promoTiles,
          saleBanner: {
            ...data.saleBanner,
            // A banner without a photo can't be shown, so it's switched off.
            enabled: data.saleBanner.enabled && Boolean(data.saleBanner.image.src),
            endsAt: data.saleBanner.endsAt ? new Date(`${data.saleBanner.endsAt}T23:59:59+06:00`) : undefined,
          },
        },
      },
      { upsert: true },
    );
    updateTag(SETTINGS_TAG);
  }, "Settings saved.");
