import { z } from "zod";
import { PRODUCT_TAGS } from "@/lib/product-tags";

// Admin product form ↔ saveProduct server action.

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID.");

// Images: Cloudinary uploads, or the bundled /sample photos used by the seed.
const imageSchema = z.object({
  src: z
    .string()
    .trim()
    .refine((value) => value.startsWith("https://res.cloudinary.com/") || value.startsWith("/sample/"), "Unsupported image URL."),
  publicId: z.string().max(300).optional(),
  alt: z.string().trim().max(200).optional(),
  position: z.string().trim().max(40).optional(),
});

const whole = (label: string) =>
  z.number({ message: `${label} must be a number.` }).int(`${label} must be a whole number.`).min(0, `${label} can't be negative.`);

export const variantSchema = z
  .object({
    id: objectId.optional(),
    name: z.string().trim().min(1, "Every variant needs a name (e.g. Black).").max(60),
    colorHex: z
      .string()
      .trim()
      .regex(/^(#[0-9a-f]{6})?$/i, "Colour must look like #111111.")
      .optional(),
    sku: z.string().trim().min(2, "Every variant needs a SKU.").max(60),
    price: whole("Price"),
    salePrice: whole("Sale price").nullable().optional(),
    stock: whole("Stock"),
    images: z.array(imageSchema).max(12),
  })
  .refine((variant) => variant.salePrice == null || variant.salePrice < variant.price, {
    message: "Sale price must be lower than the regular price.",
    path: ["salePrice"],
  });

export const productInputSchema = z.object({
  id: objectId.optional(),
  name: z.string().trim().min(2, "Enter a product name.").max(160),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only use lowercase letters, numbers and dashes."),
  brand: z.union([objectId, z.literal("")]),
  category: objectId,
  shortSpec: z.string().trim().max(120),
  description: z.string().trim().max(10000),
  keyFeatures: z.array(z.string().trim().min(1).max(200)).max(20),
  specGroups: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(60),
        items: z.array(z.object({ label: z.string().trim().min(1).max(80), value: z.string().trim().min(1).max(200) })).max(40),
      }),
    )
    .max(20),
  images: z.array(imageSchema).max(12),
  tags: z.array(z.enum(PRODUCT_TAGS)),
  active: z.boolean(),
  /** "YYYY-MM-DD" or "" */
  offerEndsAt: z.union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)]),
  variants: z.array(variantSchema).min(1, "Add at least one variant.").max(30),
});

export type ProductInput = z.input<typeof productInputSchema>;
export type VariantInput = z.input<typeof variantSchema>;
export type ImageInput = z.input<typeof imageSchema>;

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
