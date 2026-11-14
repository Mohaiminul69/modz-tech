import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

/*
 * Better Auth: Google sign-in (customers and admin). Users get a `role`
 * ("customer" by default); the admin role is granted with scripts/make-admin.ts.
 * TODO(accounts stage): phone + password sign-up for customers.
 */

const globalForAuth = globalThis as typeof globalThis & { authMongoClient?: MongoClient };

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");

// One client per server instance (same pattern as the Mongoose connection).
const client = globalForAuth.authMongoClient ?? new MongoClient(uri);
globalForAuth.authMongoClient = client;

export const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db(), { client }),
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
      role: { type: "string", defaultValue: "customer", input: false },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // refresh daily
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
