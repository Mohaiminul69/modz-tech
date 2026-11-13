const priceFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/** ৳ touching the number, thousands commas, no decimals: 1458 → "৳1,458". */
export const formatPrice = (amount: number) => `৳${priceFormatter.format(Math.round(amount))}`;
