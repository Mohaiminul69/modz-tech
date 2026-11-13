import { z } from "zod";
import { DISTRICTS } from "./districts";
import { PHONE_ERROR, normalizeBdPhone } from "./phone";

/*
 * Checkout form rules. The same schema runs in the browser (instant messages)
 * and in the placeOrder server action (the one that counts).
 */

export const DELIVERY_AREAS = ["inside", "outside"] as const;
export type DeliveryArea = (typeof DELIVERY_AREAS)[number];

export const AREA_LABELS: Record<DeliveryArea, string> = {
  inside: "Inside Dhaka",
  outside: "Outside Dhaka",
};

export const MAX_ORDER_LINES = 20;
export const MAX_LINE_QUANTITY = 10;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name.").max(80, "That name is too long."),
    phone: z
      .string()
      .transform((value, ctx) => {
        const phone = normalizeBdPhone(value);
        if (!phone) {
          ctx.addIssue({ code: "custom", message: PHONE_ERROR });
          return z.NEVER;
        }
        return phone;
      }),
    email: z
      .string()
      .trim()
      .max(120)
      .refine((value) => value === "" || EMAIL.test(value), "Enter a valid email, or leave it empty.")
      .optional()
      .transform((value) => value || undefined),
    area: z.enum(DELIVERY_AREAS, { message: "Choose a delivery area." }),
    district: z.string(),
    address: z
      .string()
      .trim()
      .min(10, "Add your house, road and area so the courier can find you.")
      .max(300, "Keep the address under 300 characters."),
    note: z
      .string()
      .trim()
      .max(500, "Keep the note under 500 characters.")
      .optional()
      .transform((value) => value || undefined),
    terms: z.literal(true, { message: "Please agree to the terms to place your order." }),
    items: z
      .array(
        z.object({
          productId: z.string().regex(/^[a-f\d]{24}$/i),
          variantId: z.string().regex(/^[a-f\d]{24}$/i),
          quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
        }),
      )
      .min(1, "Your cart is empty.")
      .max(MAX_ORDER_LINES),
  })
  .transform((data, ctx) => {
    // Inside Dhaka is always the Dhaka district; outside, the shopper picks one.
    const district = data.area === "inside" ? "Dhaka" : data.district;
    if (!(DISTRICTS as readonly string[]).includes(district)) {
      ctx.addIssue({ code: "custom", path: ["district"], message: "Choose your district." });
      return z.NEVER;
    }
    return { ...data, district };
  });

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutData = z.output<typeof checkoutSchema>;

export type CheckoutField = "name" | "phone" | "email" | "area" | "district" | "address" | "note" | "terms" | "items";
export type FieldErrors = Partial<Record<CheckoutField, string>>;

/** First message per field, for showing under each input. */
export const toFieldErrors = (error: z.ZodError): FieldErrors => {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as CheckoutField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
};
