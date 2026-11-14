import { z } from "zod";
import { PHONE_ERROR, normalizeBdPhone } from "./phone";

// Contact form rules, shared by the browser and the sendContactMessage server action.
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80, "That name is too long."),
  phone: z.string().transform((value, ctx) => {
    const phone = normalizeBdPhone(value);
    if (!phone) {
      ctx.addIssue({ code: "custom", message: PHONE_ERROR });
      return z.NEVER;
    }
    return phone;
  }),
  message: z
    .string()
    .trim()
    .min(5, "Tell us a little more so we can help.")
    .max(1000, "Keep the message under 1,000 characters."),
});

export type ContactField = "name" | "phone" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const toContactErrors = (error: z.ZodError): ContactErrors => {
  const errors: ContactErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
};
