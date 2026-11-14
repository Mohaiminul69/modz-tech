import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { MIN_PASSWORD_LENGTH } from "./auth-rules";
import { emailToPhone, isPhoneEmail } from "./phone-account";

/*
 * Better Auth.
 * - Google sign-in (customers and admin).
 * - Phone + password for customers (unverified for now; see src/lib/phone-account.ts).
 * Users get a `role` ("customer" by default); admin is granted with scripts/make-admin.ts.
 */

const globalForAuth = globalThis as typeof globalThis & { authMongoClient?: MongoClient };

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");

// One client per server instance (same pattern as the Mongoose connection).
const client = globalForAuth.authMongoClient ?? new MongoClient(uri);
globalForAuth.authMongoClient = client;

export const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const PASSWORD_PATHS = new Set(["/sign-up/email", "/sign-in/email"]);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db(), { client }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: MIN_PASSWORD_LENGTH,
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          prompt: "select_account",
        },
      }
    : {},
  user: {
    additionalFields: {
      // input: false = can't be set through sign-up/update requests, only by our server code.
      role: { type: "string", defaultValue: "customer", input: false },
      phone: { type: "string", required: false, input: false },
      // Saved delivery details (filled at checkout, reused next time).
      deliveryArea: { type: "string", required: false, input: false },
      deliveryDistrict: { type: "string", required: false, input: false },
      deliveryAddress: { type: "string", required: false, input: false },
    },
  },
  hooks: {
    // Password sign-up/sign-in is only for phone accounts. This blocks creating a
    // password account with someone else's real email (e.g. their Gmail) to hijack
    // it when they later sign in with Google.
    before: createAuthMiddleware(async (ctx) => {
      if (!PASSWORD_PATHS.has(ctx.path)) return;
      const email = String((ctx.body as { email?: unknown } | undefined)?.email ?? "");
      if (!isPhoneEmail(email)) {
        throw new APIError("BAD_REQUEST", { message: "Use your Bangladeshi mobile number, or continue with Google." });
      }
    }),
  },
  databaseHooks: {
    user: {
      create: {
        // Phone accounts: store the phone number on the user.
        before: async (user) => {
          const phone = emailToPhone(user.email);
          return { data: phone ? { ...user, phone } : user };
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
