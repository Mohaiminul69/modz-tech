import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { type Db, MongoClient } from "mongodb";
import { MIN_PASSWORD_LENGTH } from "./auth-rules";
import { emailToPhone, isPhoneEmail } from "./phone-account";

/*
 * Better Auth.
 * - Google sign-in (customers and admin).
 * - Phone + password for customers (unverified for now; see src/lib/phone-account.ts).
 * Users get a `role` ("customer" by default); admin is granted with scripts/make-admin.ts.
 */

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");

/*
 * Self-healing MongoDB client for Better Auth.
 *
 * A MongoClient whose connection fails once (e.g. an Atlas blip or a slow cold
 * start on Vercel) stays closed for good ("MongoTopologyClosedError: Topology is
 * closed"), which broke every sign-in until the next deploy. So: if connecting
 * fails or the client closes, it's dropped and the next request makes a new one.
 * Better Auth gets a Db proxy that always points at the current healthy client.
 */
type Holder = { client: MongoClient; db: Db };
const globalForAuth = globalThis as typeof globalThis & { authMongo?: Holder | null };

const createClient = (): Holder => {
  const client = new MongoClient(uri);
  const holder: Holder = { client, db: client.db() };
  const drop = () => {
    if (globalForAuth.authMongo === holder) globalForAuth.authMongo = null;
  };
  client.on("topologyClosed", drop);
  client.connect().catch((error: unknown) => {
    console.error("[auth] MongoDB connection failed; a new client is used on the next request", error);
    drop();
    void client.close().catch(() => undefined);
  });
  globalForAuth.authMongo = holder;
  return holder;
};

const currentDb = () => (globalForAuth.authMongo ?? createClient()).db;

// Forwards every call (db.collection(...), etc.) to the current client's database.
const db = new Proxy({} as Db, {
  get: (_target, property) => {
    const target = currentDb();
    const value = Reflect.get(target, property, target);
    return typeof value === "function" ? value.bind(target) : value;
  },
});

export const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const PASSWORD_PATHS = new Set(["/sign-up/email", "/sign-in/email"]);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  // No `client` (and so no multi-document transactions): the client can be replaced at runtime.
  database: mongodbAdapter(db, { transaction: false }),
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
