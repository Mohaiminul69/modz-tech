import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ZodError } from "zod";
import { auth } from "./auth";

/*
 * Every admin page AND every admin server action must go through these.
 * (Hiding a page isn't protection: server actions can be called directly.)
 */

/*
 * connection(): the session check reads the clock (expiry) and must only run for a
 * real request, never while Next.js prerenders (Cache Components rejects `new Date()` there).
 */
export const getSession = async () => {
  await connection();
  return auth.api.getSession({ headers: await headers() });
};

/** Pages: sends non-admins to the admin sign-in page. */
export const requireAdminPage = async () => {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/admin/login?denied=1");
  return session;
};

export class NotAdminError extends Error {
  constructor() {
    super("You need to be signed in as an admin.");
  }
}

/** Server actions: throws unless the caller is a signed-in admin. */
export const requireAdmin = async () => {
  const session = await getSession();
  if (!session || session.user.role !== "admin") throw new NotAdminError();
  return session;
};

/** Wraps an admin action so failures come back as a message instead of a crash. */
export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; message: string };

export const adminAction = async <T>(run: () => Promise<T>, success?: string): Promise<ActionResult<T>> => {
  try {
    await requireAdmin();
    const data = await run();
    return { ok: true, data, message: success };
  } catch (error) {
    if (error instanceof NotAdminError) return { ok: false, message: error.message };
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      const field = issue?.path.filter((part) => typeof part === "string").join(" › ");
      return { ok: false, message: field ? `${field}: ${issue.message}` : (issue?.message ?? "Invalid input.") };
    }
    if (error instanceof Error && error.name === "ValidationError") return { ok: false, message: error.message };
    if (error instanceof AdminInputError) return { ok: false, message: error.message };
    if (error instanceof Error && "code" in error && (error as { code?: number }).code === 11000) {
      return { ok: false, message: "That slug or SKU is already used by something else." };
    }
    console.error("admin action failed", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
};

/** Throw inside an admin action to show a specific message to the admin. */
export class AdminInputError extends Error {}
