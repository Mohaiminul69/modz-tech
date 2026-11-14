"use client";

import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Browser side of Better Auth (same origin, so no baseURL needed).
export const authClient = createAuthClient({
  plugins: [
    // Lets the browser see the extra user fields (all read-only from the browser).
    inferAdditionalFields({
      user: {
        role: { type: "string", input: false },
        phone: { type: "string", required: false, input: false },
        deliveryArea: { type: "string", required: false, input: false },
        deliveryDistrict: { type: "string", required: false, input: false },
        deliveryAddress: { type: "string", required: false, input: false },
      },
    }),
  ],
});

/** Where to go after signing in: ?next=/path (same-site paths only), else the fallback. */
export const nextPath = (fallback: string) => {
  if (typeof window === "undefined") return fallback;
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
};

const AUTH_ERRORS: Record<string, string> = {
  USER_ALREADY_EXISTS: "An account with this phone number already exists. Log in instead.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "An account with this phone number already exists. Log in instead.",
  INVALID_EMAIL_OR_PASSWORD: "Wrong phone number or password.",
  PASSWORD_TOO_SHORT: "Use at least 8 characters for your password.",
};

/** Friendly message for a Better Auth error. */
export const authErrorMessage = (error: { code?: string; message?: string; status?: number }) => {
  if (error.code && AUTH_ERRORS[error.code]) return AUTH_ERRORS[error.code];
  if (error.status === 429) return "Too many attempts. Please wait a minute and try again.";
  return error.message || "Something went wrong. Please try again.";
};
