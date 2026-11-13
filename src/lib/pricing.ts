type PricedVariant = { price: number; salePrice?: number | null; stock: number };

/** What the customer pays for a variant right now. */
export const effectivePrice = (variant: PricedVariant) =>
  variant.salePrice !== undefined && variant.salePrice !== null && variant.salePrice < variant.price
    ? variant.salePrice
    : variant.price;

/**
 * Price shown on a product card: the cheapest in-stock variant (or the cheapest
 * overall when everything is sold out), with its regular price as the old price
 * when it is on sale.
 */
export const cardPricing = (variants: PricedVariant[]) => {
  const inStock = variants.filter((variant) => variant.stock > 0);
  const pool = inStock.length > 0 ? inStock : variants;
  const cheapest = pool.reduce((best, variant) => (effectivePrice(variant) < effectivePrice(best) ? variant : best));
  const price = effectivePrice(cheapest);

  return {
    price,
    oldPrice: price < cheapest.price ? cheapest.price : undefined,
    inStock: inStock.length > 0,
  };
};
