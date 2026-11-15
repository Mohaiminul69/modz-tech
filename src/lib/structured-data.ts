import { effectivePrice } from "./pricing";
import { SITE_URL } from "./site-url";
import type { ProductDetail } from "./types";

/*
 * Structured data (JSON-LD) for Google: a hidden description of the page that lets search
 * results show the price, stock and photo. Visitors never see it.
 * https://developers.google.com/search/docs/appearance/structured-data/product-snippet
 */

const absolute = (src: string) => (src.startsWith("/") ? `${SITE_URL}${src}` : src);

// "2026-11-30" (Bangladesh date) from an ISO timestamp.
const dhakaDate = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date(iso));

export const productJsonLd = (product: ProductDetail) => {
  const url = `${SITE_URL}/product/${product.slug}`;
  const images = [...product.images, ...product.variants.flatMap((variant) => variant.images)]
    .map((image) => absolute(image.src))
    .filter((src, index, all) => all.indexOf(src) === index)
    .slice(0, 6);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: (product.shortSpec || product.description).slice(0, 500),
    sku: product.variants[0]?.sku,
    image: images,
    url,
    category: product.category.name,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    // One offer per option (colour, size...), each with its own price and stock.
    offers: product.variants.map((variant) => {
      const onSale = variant.salePrice !== undefined && variant.salePrice < variant.price;
      return {
        "@type": "Offer",
        url,
        sku: variant.sku,
        ...(product.variants.length > 1 ? { name: `${product.name} (${variant.name})` } : {}),
        price: effectivePrice(variant),
        priceCurrency: "BDT",
        // Sale prices with an end date say when they stop applying.
        ...(onSale && product.offerEndsAt ? { priceValidUntil: dhakaDate(product.offerEndsAt) } : {}),
        availability: variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "Modz Tech" },
      };
    }),
  };
};

/** "Home › Earbuds › Hoco EQ34 Plus" in search results instead of the raw URL. */
export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

/** Safe to put inside <script>: "<" can't close the tag early. */
export const jsonLdScript = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
