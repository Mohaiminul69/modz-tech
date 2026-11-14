import { z } from "zod";

// Admin settings form <-> saveSettings server action.
const optionalUrl = z.union([z.literal(""), z.url({ message: "Use a full link starting with https://" })]);
const fee = z.number().int().min(0).max(5000).nullable();
// Site paths ("/category/speakers") or full links.
const href = z.string().trim().min(1, "Add a link.").max(300);
const image = z.object({
  src: z
    .string()
    .trim()
    .refine((value) => value.startsWith("https://res.cloudinary.com/") || value.startsWith("/sample/"), "Upload an image."),
  alt: z.string().trim().max(200),
  position: z.string().trim().max(40).optional(),
});

export const settingsSchema = z.object({
  phone: z.string().trim().max(40),
  email: z.union([z.literal(""), z.email({ message: "Enter a valid email." })]),
  hours: z.string().trim().max(60),
  facebookUrl: optionalUrl,
  messengerUrl: optionalUrl,
  whatsappUrl: optionalUrl,
  delivery: z.object({
    insideDhaka: z.object({ fee, time: z.string().trim().max(60) }),
    outsideDhaka: z.object({ fee, time: z.string().trim().max(60) }),
  }),
  heroSlides: z
    .array(
      z.object({
        eyebrow: z.string().trim().min(1, "Hero slide: add a small label.").max(60),
        badge: z.string().trim().max(30),
        headline: z.array(z.string().trim().min(1)).min(1, "Hero slide: add a headline.").max(3),
        description: z.string().trim().min(1, "Hero slide: add a short line.").max(160),
        descriptionLong: z.string().trim().max(240),
        price: fee.optional(),
        oldPrice: fee.optional(),
        ctaLabel: z.string().trim().min(1, "Hero slide: add button text.").max(30),
        ctaHref: href,
        image,
      }),
    )
    .max(6),
  promoTiles: z.array(z.object({ href, image: image.omit({ position: true }) })).max(8),
  saleBanner: z.object({
    enabled: z.boolean(),
    badge: z.string().trim().max(20),
    title: z.string().trim().max(80),
    description: z.string().trim().max(160),
    ctaLabel: z.string().trim().max(30),
    ctaHref: z.string().trim().max(300),
    /** "YYYY-MM-DD" or "" */
    endsAt: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
    image: image.or(z.object({ src: z.literal(""), alt: z.string(), position: z.string().optional() })),
  }),
});

export type SettingsInput = z.input<typeof settingsSchema>;
