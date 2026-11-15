import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data/catalog";
import { getProductSlugs } from "@/lib/data/products";
import { SITE_URL } from "@/lib/site-url";

// Every page a customer might search for: the main pages, each category and each active product.
// Built from the cached catalog, so new products appear once that cache refreshes.
const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [categories, productSlugs] = await Promise.all([getCategories(), getProductSlugs()]);

  return [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...productSlugs.map((slug) => ({
      url: `${SITE_URL}/product/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/track`, changeFrequency: "monthly", priority: 0.3 },
  ];
};

export default sitemap;
