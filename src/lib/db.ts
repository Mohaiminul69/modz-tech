import "server-only";
import mongoose from "mongoose";

/*
 * One cached Mongoose connection, reused across requests and hot reloads.
 * On Vercel each warm serverless instance keeps its connection instead of
 * opening a new one per request.
 */

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongoose.mongooseCache = cache;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  }

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    maxPoolSize: 10,
  });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null;
    throw error;
  }

  return cache.conn;
};
