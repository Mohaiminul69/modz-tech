import { type Model, Schema, model, models } from "mongoose";

// Atomic sequences (e.g. order numbers). One document per sequence name.
type CounterDoc = { _id: string; seq: number };

const counterSchema = new Schema<CounterDoc>({ _id: { type: String, required: true }, seq: { type: Number, default: 0 } });

export const Counter: Model<CounterDoc> =
  (models.Counter as Model<CounterDoc> | undefined) ?? model<CounterDoc>("Counter", counterSchema);

/** Next number in a sequence, starting after `start` (e.g. start 1000 → 1001). Safe under concurrency. */
export const nextSequence = async (name: string, start = 0) => {
  // Create the counter at `start` the first time, without touching it later.
  await Counter.updateOne({ _id: name }, { $setOnInsert: { seq: start } }, { upsert: true });
  const doc = await Counter.findOneAndUpdate({ _id: name }, { $inc: { seq: 1 } }, { returnDocument: "after" }).lean();
  if (!doc) throw new Error(`Counter "${name}" missing`);
  return doc.seq;
};
