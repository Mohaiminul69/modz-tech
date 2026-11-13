"use server";

import { z } from "zod";
import { getProduct } from "@/lib/data/products";
import { effectivePrice } from "@/lib/pricing";

/*
 * The cart in the browser only holds IDs and quantities. This looks up the
 * current name, photo, price and stock for each line, so prices can't be
 * tampered with and changes in the admin show up straight away.
 */

const cartSchema = z
  .array(
    z.object({
      productId: z.string().max(64),
      variantId: z.string().max(64),
      slug: z.string().max(200),
      quantity: z.number().int().min(1).max(99),
    }),
  )
  .max(50);

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  /** Colour name; null when the product has only one variant. */
  variantName: string | null;
  image: { src: string; alt: string; position?: string } | null;
  price: number;
  oldPrice?: number;
  stock: number;
};

export const getCartLines = async (input: unknown): Promise<CartLine[]> => {
  const parsed = cartSchema.safeParse(input);
  if (!parsed.success) return [];

  const slugs = [...new Set(parsed.data.map((item) => item.slug))];
  const products = new Map(
    (await Promise.all(slugs.map((slug) => getProduct(slug)))).flatMap((product) =>
      product ? [[product.slug, product] as const] : [],
    ),
  );

  return parsed.data.flatMap((item) => {
    const product = products.get(item.slug);
    // Product removed, hidden, or the slug no longer matches the ID: drop the line.
    if (!product || product.id !== item.productId) return [];
    const variant = product.variants.find((option) => option.id === item.variantId);
    if (!variant) return [];

    const price = effectivePrice(variant);
    const image = variant.images[0] ?? product.images[0] ?? null;
    return [
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        variantName: product.variants.length > 1 ? variant.name : null,
        image,
        price,
        oldPrice: price < variant.price ? variant.price : undefined,
        stock: variant.stock,
      },
    ];
  });
};
