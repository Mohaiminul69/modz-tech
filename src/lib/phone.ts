/*
 * Bangladeshi mobile numbers: 11 digits starting with 01, operator digit 3–9
 * (e.g. 01712345678). Used in the browser and again on the server.
 */
const BD_MOBILE = /^01[3-9]\d{8}$/;

/**
 * Normalises what people type next to the "+880" prefix into 01XXXXXXXXX.
 * Accepts "1712345678", "01712345678", "+8801712345678", "880 1712-345678".
 * Returns null when it isn't a valid Bangladeshi mobile number.
 */
export const normalizeBdPhone = (input: string): string | null => {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("880")) digits = digits.slice(3);
  if (digits.length === 10 && digits.startsWith("1")) digits = `0${digits}`;
  return BD_MOBILE.test(digits) ? digits : null;
};

export const PHONE_ERROR = "Enter a valid Bangladeshi mobile number, e.g. 1712345678.";

/** "01712345678" → "+880 1712-345678" for display. */
export const formatBdPhone = (phone: string) =>
  /^01\d{9}$/.test(phone) ? `+880 ${phone.slice(1, 5)}-${phone.slice(5)}` : phone;
