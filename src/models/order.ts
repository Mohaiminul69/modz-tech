import { type Model, Schema, type Types, model, models } from "mongoose";

import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "../lib/order-status";

export { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus };

export type OrderItem = {
  product: Types.ObjectId;
  variant: Types.ObjectId;
  sku: string;
  /** Snapshot at order time, so later product edits don't change past orders. */
  name: string;
  variantName?: string;
  image?: string;
  /** Unit price paid (taka). */
  price: number;
  quantity: number;
};

export type OrderDoc = {
  /** Friendly number shown to customers, e.g. "MZ-1001". */
  orderNumber: string;
  /** Secret for the order-confirmed link (order numbers are guessable). */
  accessKey: string;
  /** Better Auth user id when the customer was signed in (guest orders: unset). */
  userId?: string;
  customer: { name: string; phone: string; email?: string };
  delivery: { area: "inside" | "outside"; district: string; address: string; note?: string };
  items: OrderItem[];
  subtotal: number;
  /** null = fee not set in Settings yet; confirmed on the phone call. */
  deliveryFee: number | null;
  total: number;
  paymentMethod: "cod";
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: Date; note?: string }[];
  courier?: { name?: string; trackingId?: string; trackingUrl?: string };
  adminNotes?: string;
  /** Set when an admin puts a cancelled/returned order's items back into stock (only once). */
  stockRestored?: boolean;
  /** For rate limits and fraud checks. */
  meta: { ip?: string; userAgent?: string };
  createdAt: Date;
  updatedAt: Date;
};

const orderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant: { type: Schema.Types.ObjectId, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    variantName: String,
    image: String,
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true },
    accessKey: { type: String, required: true, select: false },
    userId: { type: String, index: true },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, index: true },
      email: { type: String, trim: true, lowercase: true },
    },
    delivery: {
      area: { type: String, enum: ["inside", "outside"], required: true },
      district: { type: String, required: true },
      address: { type: String, required: true, trim: true },
      note: { type: String, trim: true },
    },
    items: {
      type: [orderItemSchema],
      validate: { validator: (items: OrderItem[]) => items.length > 0, message: "An order needs at least one item." },
    },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: null, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    statusHistory: {
      type: [
        new Schema(
          { status: { type: String, enum: ORDER_STATUSES, required: true }, at: { type: Date, required: true }, note: String },
          { _id: false },
        ),
      ],
      default: [],
    },
    courier: { name: String, trackingId: String, trackingUrl: String },
    adminNotes: String,
    stockRestored: { type: Boolean, default: false },
    meta: { ip: { type: String, index: true }, userAgent: String },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ "customer.phone": 1, createdAt: -1 });

export const Order: Model<OrderDoc> = (models.Order as Model<OrderDoc> | undefined) ?? model<OrderDoc>("Order", orderSchema);
