import { type Model, Schema, model, models } from "mongoose";

export type BrandDoc = {
  name: string;
  slug: string;
  /** Shown as a chip in "Shop by brand" on the home page. */
  featured: boolean;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const brandSchema = new Schema<BrandDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Brand: Model<BrandDoc> =
  (models.Brand as Model<BrandDoc> | undefined) ?? model<BrandDoc>("Brand", brandSchema);
