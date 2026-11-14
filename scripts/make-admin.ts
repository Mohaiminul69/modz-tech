/*
 * Gives a user the admin role.
 *
 *   1. Sign in once on the site with Google (/admin/login) so the user exists.
 *   2. npm run make-admin -- you@gmail.com
 *   3. Sign in again at /admin.
 *
 * Remove admin:  npm run make-admin -- you@gmail.com --remove
 */
import { MongoClient } from "mongodb";

const main = async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  const remove = process.argv.includes("--remove");
  if (!email || !email.includes("@")) throw new Error("Usage: npm run make-admin -- you@example.com [--remove]");

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const users = client.db().collection("user");
    const result = await users.updateOne({ email }, { $set: { role: remove ? "customer" : "admin", updatedAt: new Date() } });
    if (result.matchedCount === 0) {
      throw new Error(`No user with email ${email}. Sign in once with Google at /admin/login first, then run this again.`);
    }
    console.log(`${email} is now ${remove ? "a customer" : "an admin"} (database "${client.db().databaseName}").`);
  } finally {
    await client.close();
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
