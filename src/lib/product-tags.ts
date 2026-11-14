// Kept free of Mongoose so browser code (admin forms) can import it.
export const PRODUCT_TAGS = ["exclusive", "top-selling", "new"] as const;
export type ProductTag = (typeof PRODUCT_TAGS)[number];

export const PRODUCT_TAG_LABELS: Record<ProductTag, string> = {
  exclusive: "Exclusive",
  "top-selling": "Top selling",
  new: "New arrival",
};
