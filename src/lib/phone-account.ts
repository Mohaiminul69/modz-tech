/*
 * Phone + password accounts.
 *
 * Better Auth's password sign-in is keyed by email, so a phone account gets an
 * internal address built from the number: 01712345678@phone.modztech.invalid.
 * Customers never see or type it. ".invalid" is a reserved domain that can never
 * receive mail. A server hook (src/lib/auth.ts) only allows password sign-up /
 * sign-in for these addresses.
 *
 * Phone numbers are NOT verified yet (no SMS at launch). To add verification
 * later, check an OTP before calling sign-up; existing accounts keep working.
 */
import { normalizeBdPhone } from "./phone";

export const PHONE_EMAIL_DOMAIN = "phone.modztech.invalid";

/** Normalised phone → internal sign-in email, or null if the phone isn't valid. */
export const phoneToEmail = (phone: string) => {
  const normalized = normalizeBdPhone(phone);
  return normalized ? `${normalized}@${PHONE_EMAIL_DOMAIN}` : null;
};

export const isPhoneEmail = (email: string) =>
  new RegExp(`^01[3-9]\\d{8}@${PHONE_EMAIL_DOMAIN.replace(/\./g, "\\.")}$`).test(email.trim().toLowerCase());

/** Internal phone email → "01712345678"; anything else → null. */
export const emailToPhone = (email: string) => (isPhoneEmail(email) ? email.split("@")[0] : null);
