import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB } from "@/lib/db";
import type { BrandItem, CategoryItem } from "@/lib/types";
import { Brand } from "@/models/brand";
import { Category } from "@/models/category";

/** Cache tag for categories and brands. Call updateTag("catalog") after admin edits. */
export const CATALOG_TAG = "catalog";

export const getCategories = async (): Promise<CategoryItem[]> => {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  await connectDB();
  const docs = await Category.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    shortName: doc.shortName,
    slug: doc.slug,
    icon: doc.icon,
  }));
};

export const getBrands = async (): Promise<BrandItem[]> => {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");

  await connectDB();
  const docs = await Brand.find({ active: true }).sort({ sortOrder: 1, name: 1 }).lean();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    featured: doc.featured,
  }));
};
