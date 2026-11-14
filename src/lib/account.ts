import "server-only";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { connectDB } from "./db";

type DeliveryDetails = {
  /** undefined = leave the saved phone as it is. */
  phone?: string;
  deliveryArea: "inside" | "outside";
  deliveryDistrict: string;
  deliveryAddress: string;
};

/*
 * Saves a signed-in customer's delivery details on their Better Auth user record
 * (those fields are server-only: `input: false` in src/lib/auth.ts).
 */
export const saveDeliveryDetails = async (userId: string, details: DeliveryDetails) => {
  if (!ObjectId.isValid(userId)) return;
  await connectDB();
  const users = mongoose.connection.db?.collection("user");
  if (!users) return;
  const fields = Object.fromEntries(Object.entries(details).filter(([, value]) => value !== undefined));
  await users.updateOne({ _id: new ObjectId(userId) }, { $set: { ...fields, updatedAt: new Date() } });
};
