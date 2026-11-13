import { type Model, Schema, model, models } from "mongoose";

export type CategoryDoc = {
  name: string;
  /** Short label for tight spots (category nav, tiles): "Covers" for "Earbud covers". */
  shortName: string;
  slug: string;
  /** Key of the line icon shown on category tiles (see components/home/category-grid). */
  icon: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const categorySchema = new Schema<CategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
    shortName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: "box" },
    sortOrder: { type: Number, default: 0, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Category: Model<CategoryDoc> =
  (models.Category as Model<CategoryDoc> | undefined) ?? model<CategoryDoc>("Category", categorySchema);
