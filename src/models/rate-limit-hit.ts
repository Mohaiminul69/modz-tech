import { type Model, Schema, model, models } from "mongoose";

/*
 * One document per attempt (e.g. an order-tracking lookup), keyed by
 * "<action>:<ip>". MongoDB deletes them automatically after an hour (TTL index).
 */
type RateLimitHitDoc = { key: string; createdAt: Date };

const rateLimitHitSchema = new Schema<RateLimitHitDoc>({
  key: { type: String, required: true, index: true },
  createdAt: { type: Date, default: () => new Date(), expires: 60 * 60 },
});

export const RateLimitHit: Model<RateLimitHitDoc> =
  (models.RateLimitHit as Model<RateLimitHitDoc> | undefined) ?? model<RateLimitHitDoc>("RateLimitHit", rateLimitHitSchema);

/** Records an attempt and returns false when `key` already has `max` attempts in the last hour. */
export const allowAttempt = async (key: string, max: number) => {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const count = await RateLimitHit.countDocuments({ key, createdAt: { $gte: since } });
  if (count >= max) return false;
  await RateLimitHit.create({ key });
  return true;
};
