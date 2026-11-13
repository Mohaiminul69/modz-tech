import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { QueryFilter, SortOrder } from "mongoose";
import { connectDB } from "@/lib/db";
import { cardPricing } from "@/lib/pricing";
import type { CardProduct, ListingItem, ProductDetail, ProductDetailImage } from "@/lib/types";
import { Brand } from "@/models/brand";
import { Category } from "@/models/category";
import { Product, type ProductDoc } from "@/models/product";
import { CATALOG_TAG } from "./catalog";

/** Cache tag for products. Call updateTag("products") after admin edits or new orders. */
export const PRODUCTS_TAG = "products";

const CARD_FIELDS = "slug name shortSpec images variants.price variants.salePrice variants.stock variants.images tags";

type CardSource = Pick<ProductDoc, "slug" | "name" | "shortSpec" | "images" | "variants" | "tags"> & {
  _id: { toString(): string };
};

export const toCardProduct = (doc: CardSource): CardProduct => {
  const image = doc.images[0] ?? doc.variants.find((variant) => variant.images?.length)?.images[0];
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    spec: doc.shortSpec,
    isNew: doc.tags.includes("new"),
    ...cardPricing(doc.variants),
    image: image ? { src: image.src, position: image.position || undefined } : null,
  };
};

const findCards = async (filter: QueryFilter<ProductDoc>, sort: Record<string, SortOrder>, limit: number) => {
  const docs = await Product.find({ active: true, ...filter })
    .select(CARD_FIELDS)
    .sort(sort)
    .limit(limit)
    .lean<CardSource[]>();
  return docs.map(toCardProduct);
};

// Mobile-only category rows on the home page, as in the mockup.
const HOME_CATEGORY_ROWS = [
  { id: "speakers-audio", title: "Speakers & audio", href: "/category/speakers", slugs: ["speakers", "karaoke", "microphones"] },
  { id: "watches-trackers", title: "Watches & trackers", href: "/category/smart-watches", slugs: ["smart-watches", "trackers"] },
];

export type HomeProducts = {
  exclusive: CardProduct[];
  topSelling: CardProduct[];
  newArrivals: CardProduct[];
  brands: { name: string; slug: string; products: CardProduct[] }[];
  categoryRows: { id: string; title: string; href: string; products: CardProduct[] }[];
};

export const getHomeProducts = async (): Promise<HomeProducts> => {
  "use cache";
  cacheTag(PRODUCTS_TAG, CATALOG_TAG);
  cacheLife("hours");

  await connectDB();

  const [exclusive, topSelling, newArrivals, featuredBrands, rowCategories] = await Promise.all([
    findCards({ tags: "exclusive" }, { updatedAt: -1 }, 5),
    findCards({ tags: "top-selling" }, { soldCount: -1, updatedAt: -1 }, 5),
    findCards({ tags: "new" }, { createdAt: -1 }, 5),
    Brand.find({ active: true, featured: true }).sort({ sortOrder: 1, name: 1 }).lean(),
    Category.find({ active: true, slug: { $in: HOME_CATEGORY_ROWS.flatMap((row) => row.slugs) } })
      .select("slug")
      .lean(),
  ]);

  const brands = await Promise.all(
    featuredBrands.map(async (brand) => ({
      name: brand.name,
      slug: brand.slug,
      products: await findCards({ brand: brand._id }, { soldCount: -1, updatedAt: -1 }, 5),
    })),
  );

  const categoryRows = await Promise.all(
    HOME_CATEGORY_ROWS.map(async (row) => {
      const ids = rowCategories.filter((category) => row.slugs.includes(category.slug)).map((category) => category._id);
      return {
        id: row.id,
        title: row.title,
        href: row.href,
        products: ids.length > 0 ? await findCards({ category: { $in: ids } }, { soldCount: -1, updatedAt: -1 }, 2) : [],
      };
    }),
  );

  return {
    exclusive,
    topSelling,
    newArrivals,
    brands: brands.filter((brand) => brand.products.length > 0),
    categoryRows: categoryRows.filter((row) => row.products.length > 0),
  };
};

/*
 * Every active product, in the shape the shop page filters and sorts.
 * The catalog is small (dozens of products), so filtering happens in memory
 * on this cached list instead of one database query per filter combination.
 */
export const getListingItems = async (): Promise<ListingItem[]> => {
  "use cache";
  cacheTag(PRODUCTS_TAG, CATALOG_TAG);
  cacheLife("hours");

  await connectDB();
  const [docs, categories, brands] = await Promise.all([
    Product.find({ active: true })
      .select(`${CARD_FIELDS} category brand soldCount createdAt`)
      .lean<(CardSource & Pick<ProductDoc, "category" | "brand" | "soldCount" | "createdAt">)[]>(),
    Category.find({ active: true }).select("slug").lean(),
    Brand.find({ active: true }).select("slug").lean(),
  ]);

  const categorySlugs = new Map(categories.map((doc) => [doc._id.toString(), doc.slug]));
  const brandSlugs = new Map(brands.map((doc) => [doc._id.toString(), doc.slug]));

  return docs.flatMap((doc) => {
    const categorySlug = categorySlugs.get(doc.category.toString());
    // Products in a hidden category are hidden too.
    if (!categorySlug) return [];
    return [
      {
        card: toCardProduct(doc),
        categorySlug,
        brandSlug: (doc.brand && brandSlugs.get(doc.brand.toString())) || null,
        tags: doc.tags,
        soldCount: doc.soldCount,
        createdAt: new Date(doc.createdAt).getTime(),
      },
    ];
  });
};

const toImage = (image: { src: string; alt?: string; position?: string }, fallbackAlt: string): ProductDetailImage => ({
  src: image.src,
  alt: image.alt || fallbackAlt,
  position: image.position || undefined,
});

export const getProduct = async (slug: string): Promise<ProductDetail | null> => {
  "use cache";
  cacheTag(PRODUCTS_TAG, CATALOG_TAG, `product:${slug}`);
  cacheLife("hours");

  await connectDB();
  const doc = await Product.findOne({ slug, active: true })
    .populate<{ category: { name: string; slug: string; active: boolean } }>("category", "name slug active")
    .populate<{ brand: { name: string; slug: string } | null }>("brand", "name slug")
    .lean();

  if (!doc || !doc.category?.active) return null;

  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    brand: doc.brand ? { name: doc.brand.name, slug: doc.brand.slug } : null,
    category: { name: doc.category.name, slug: doc.category.slug },
    shortSpec: doc.shortSpec,
    description: doc.description,
    keyFeatures: doc.keyFeatures,
    specGroups: doc.specGroups.map((group) => ({
      title: group.title,
      items: group.items.map((item) => ({ label: item.label, value: item.value })),
    })),
    images: doc.images.map((image) => toImage(image, doc.name)),
    variants: doc.variants.map((variant) => ({
      id: variant._id.toString(),
      name: variant.name,
      colorHex: variant.colorHex || undefined,
      sku: variant.sku,
      price: variant.price,
      salePrice: variant.salePrice ?? undefined,
      stock: variant.stock,
      images: variant.images.map((image) => toImage(image, `${doc.name}, ${variant.name}`)),
    })),
    offerEndsAt: doc.offerEndsAt ? new Date(doc.offerEndsAt).toISOString() : undefined,
  };
};

/** Same category first, then best sellers, up to `limit` (excluding the product itself). */
export const getSimilarProducts = async (slug: string, categorySlug: string, limit = 5): Promise<CardProduct[]> => {
  "use cache";
  cacheTag(PRODUCTS_TAG, CATALOG_TAG);
  cacheLife("hours");

  const items = await getListingItems();
  const others = items.filter((item) => item.card.slug !== slug);
  const sameCategory = others.filter((item) => item.categorySlug === categorySlug);
  const rest = others
    .filter((item) => item.categorySlug !== categorySlug)
    .sort((a, b) => b.soldCount - a.soldCount || b.createdAt - a.createdAt);
  return [...sameCategory, ...rest].slice(0, limit).map((item) => item.card);
};

/** Slugs to prerender at build time. */
export const getProductSlugs = async (): Promise<string[]> => {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("hours");

  await connectDB();
  const docs = await Product.find({ active: true }).select("slug").lean();
  return docs.map((doc) => doc.slug);
};
