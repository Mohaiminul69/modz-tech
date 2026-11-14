import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB } from "@/lib/db";
import type { SiteSettings } from "@/lib/types";
import { Settings } from "@/models/settings";

/** Cache tag for shop settings. Call updateTag("settings") after admin edits. */
export const SETTINGS_TAG = "settings";

// "facebook.com/ModzTech" for vanity URLs; numeric profile links get a readable label instead.
const toLabel = (url: string) =>
  /profile\.php/i.test(url) ? "Modz Tech on Facebook" : url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export const getSettings = async (): Promise<SiteSettings> => {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("hours");

  await connectDB();
  const doc = await Settings.findOne({ key: "site" }).lean();

  if (!doc) {
    return {
      phone: "",
      email: "",
      hours: "",
      facebookUrl: "",
      facebookLabel: "",
      messengerUrl: "",
      whatsappUrl: "",
      delivery: { insideDhaka: {}, outsideDhaka: {} },
      heroSlides: [],
      promoTiles: [],
      saleBanner: null,
    };
  }

  const banner = doc.saleBanner;

  return {
    phone: doc.phone,
    email: doc.email,
    hours: doc.hours,
    facebookUrl: doc.facebookUrl,
    facebookLabel: toLabel(doc.facebookUrl),
    messengerUrl: doc.messengerUrl,
    whatsappUrl: doc.whatsappUrl ?? "",
    delivery: {
      insideDhaka: { fee: doc.delivery?.insideDhaka?.fee, time: doc.delivery?.insideDhaka?.time },
      outsideDhaka: { fee: doc.delivery?.outsideDhaka?.fee, time: doc.delivery?.outsideDhaka?.time },
    },
    heroSlides: doc.heroSlides.map((slide, index) => ({
      id: `slide-${index}`,
      eyebrow: slide.eyebrow,
      badge: slide.badge || undefined,
      headline: slide.headline,
      description: slide.description,
      descriptionLong: slide.descriptionLong || undefined,
      price: slide.price ?? undefined,
      oldPrice: slide.oldPrice ?? undefined,
      cta: { label: slide.ctaLabel, href: slide.ctaHref },
      image: { src: slide.image.src, alt: slide.image.alt, position: slide.image.position || undefined },
    })),
    promoTiles: doc.promoTiles.map((tile) => ({ href: tile.href, src: tile.image.src, alt: tile.image.alt })),
    saleBanner:
      banner?.enabled && banner.image?.src
        ? {
            badge: banner.badge,
            title: banner.title,
            description: banner.description,
            cta: { label: banner.ctaLabel, href: banner.ctaHref },
            endsAt: banner.endsAt?.toISOString(),
            image: { src: banner.image.src, alt: banner.image.alt, position: banner.image.position || undefined },
          }
        : null,
  };
};
