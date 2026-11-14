"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { AdminInputError, adminAction } from "@/lib/admin-auth";
import { CATALOG_TAG } from "@/lib/data/catalog";
import { connectDB } from "@/lib/db";
import { Brand } from "@/models/brand";
import { Category } from "@/models/category";
import { Product } from "@/models/product";

const objectId = z.string().regex(/^[a-f\d]{24}$/i);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only use lowercase letters, numbers and dashes.");

const categorySchema = z.object({
  id: objectId.optional(),
  name: z.string().trim().min(2, "Enter a name.").max(60),
  shortName: z.string().trim().min(2, "Enter a short name.").max(20),
  slug,
  icon: z.string().trim().max(40),
  active: z.boolean(),
});

export const saveCategory = async (input: unknown) =>
  adminAction(async () => {
    const data = categorySchema.parse(input);
    await connectDB();
    if (data.id) {
      const result = await Category.updateOne({ _id: data.id }, { $set: { ...data, id: undefined } });
      if (result.matchedCount === 0) throw new AdminInputError("That category no longer exists.");
    } else {
      const last = await Category.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
      await Category.create({ ...data, sortOrder: (last?.sortOrder ?? 0) + 1 });
    }
    updateTag(CATALOG_TAG);
  }, "Category saved.");

/** Swaps a category with its neighbour above or below. */
export const moveCategory = async (id: unknown, direction: unknown) =>
  adminAction(async () => {
    const categoryId = objectId.parse(id);
    const dir = z.enum(["up", "down"]).parse(direction);
    await connectDB();
    const list = await Category.find().sort({ sortOrder: 1, name: 1 }).select("_id").lean();
    const index = list.findIndex((item) => item._id.toString() === categoryId);
    const target = dir === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    // Rewrite every position, which also repairs gaps or duplicate sort orders.
    await Category.bulkWrite(
      list.map((item, position) => ({ updateOne: { filter: { _id: item._id }, update: { $set: { sortOrder: position + 1 } } } })),
    );
    updateTag(CATALOG_TAG);
  });

const brandSchema = z.object({
  id: objectId.optional(),
  name: z.string().trim().min(1, "Enter a name.").max(60),
  slug,
  featured: z.boolean(),
  active: z.boolean(),
});

export const saveBrand = async (input: unknown) =>
  adminAction(async () => {
    const data = brandSchema.parse(input);
    await connectDB();
    if (data.id) {
      const result = await Brand.updateOne({ _id: data.id }, { $set: { ...data, id: undefined } });
      if (result.matchedCount === 0) throw new AdminInputError("That brand no longer exists.");
    } else {
      const last = await Brand.findOne().sort({ sortOrder: -1 }).select("sortOrder").lean();
      await Brand.create({ ...data, sortOrder: (last?.sortOrder ?? 0) + 1 });
    }
    updateTag(CATALOG_TAG);
  }, "Brand saved.");

export const deleteBrand = async (id: unknown) =>
  adminAction(async () => {
    const brandId = objectId.parse(id);
    await connectDB();
    const used = await Product.countDocuments({ brand: brandId });
    if (used > 0) throw new AdminInputError(`${used} product(s) still use this brand. Change them first, or hide the brand.`);
    await Brand.deleteOne({ _id: brandId });
    updateTag(CATALOG_TAG);
  }, "Brand deleted.");
