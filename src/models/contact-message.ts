import { type Model, Schema, model, models } from "mongoose";

// Contact form submissions (shown in the admin "Messages" page later).
export type ContactMessageDoc = {
  name: string;
  phone: string;
  message: string;
  status: "new" | "read";
  meta: { ip?: string; userAgent?: string };
  createdAt: Date;
  updatedAt: Date;
};

const contactMessageSchema = new Schema<ContactMessageDoc>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, index: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["new", "read"], default: "new", index: true },
    meta: { ip: { type: String, index: true }, userAgent: String },
  },
  { timestamps: true },
);

contactMessageSchema.index({ createdAt: -1 });

export const ContactMessage: Model<ContactMessageDoc> =
  (models.ContactMessage as Model<ContactMessageDoc> | undefined) ??
  model<ContactMessageDoc>("ContactMessage", contactMessageSchema);
