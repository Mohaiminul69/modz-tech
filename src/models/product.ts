import { type Model, Schema, type Types, model, models } from "mongoose";
// Relative path so the seed script (run with tsx) resolves it too.
import { PRODUCT_TAGS, type ProductTag } from "../lib/product-tags";

export { PRODUCT_TAGS, type ProductTag };

export type ProductImage = {
  /** Cloudinary URL, or a /public path for seed data. */
  src: string;
  /** Cloudinary public ID, used to delete or transform the image. */
  publicId?: string;
  alt?: string;
  /** CSS object-position for crops, e.g. "center 60%". */
  position?: string;
};

export type ProductVariant = {
  _id: Types.ObjectId;
  /** Shown in the variant picker, e.g. "Black". */
  name: string;
  /** Swatch colour for the picker, e.g. "#111111". */
  colorHex?: string;
  sku: string;
  /** Regular price in taka (whole numbers). */
  price: number;
  /** Offer price in taka; shown with the regular price struck through. */
  salePrice?: number;
  stock: number;
  /** Variant photos; falls back to the product images when empty. */
  images: ProductImage[];
};

export type SpecGroup = {
  title: string;
  items: { label: string; value: string }[];
};

export type ProductDoc = {
  name: string;
  slug: string;
  brand?: Types.ObjectId;
  category: Types.ObjectId;
  /** One-line spec under the price on cards: "32h playtime · IPX5". */
  shortSpec: string;
  description: string;
  keyFeatures: string[];
  specGroups: SpecGroup[];
  images: ProductImage[];
  variants: ProductVariant[];
  tags: ProductTag[];
  /** When the current offer ends (shown on the product page). */
  offerEndsAt?: Date;
  /** Units sold, kept up to date by orders; used for "best selling". */
  soldCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const imageSchema = new Schema<ProductImage>(
  {
    src: { type: String, required: true },
    publicId: String,
    alt: String,
    position: String,
  },
  { _id: false },
);

const variantSchema = new Schema<ProductVariant>({
  name: { type: String, required: true, trim: true },
  colorHex: String,
  sku: { type: String, required: true, trim: true, uppercase: true },
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: { type: [imageSchema], default: [] },
});

variantSchema.pre("validate", function () {
  if (this.salePrice !== undefined && this.salePrice !== null && this.salePrice >= this.price) {
    this.invalidate("salePrice", "Sale price must be lower than the regular price.");
  }
});

const productSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    shortSpec: { type: String, default: "", trim: true },
    description: { type: String, default: "" },
    keyFeatures: { type: [String], default: [] },
    specGroups: {
      type: [
        new Schema<SpecGroup>(
          {
            title: { type: String, required: true },
            items: [new Schema({ label: String, value: String }, { _id: false })],
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    images: { type: [imageSchema], default: [] },
    variants: {
      type: [variantSchema],
      validate: {
        validator: (value: ProductVariant[]) => value.length > 0,
        message: "A product needs at least one variant.",
      },
    },
    tags: { type: [{ type: String, enum: PRODUCT_TAGS }], default: [], index: true },
    offerEndsAt: Date,
    soldCount: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

productSchema.index({ "variants.sku": 1 }, { unique: true });
productSchema.index({ active: 1, soldCount: -1 });
productSchema.index({ active: 1, createdAt: -1 });
// Search (search page stage).
productSchema.index({ name: "text", shortSpec: "text", keyFeatures: "text" });

export const Product: Model<ProductDoc> =
  (models.Product as Model<ProductDoc> | undefined) ?? model<ProductDoc>("Product", productSchema);
