"use server";

import { updateTag } from "next/cache";
import { Types } from "mongoose";
import { z } from "zod";
import { AdminInputError, adminAction } from "@/lib/admin-auth";
import { productInputSchema } from "@/lib/admin/product-schema";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/product";

// Dhaka is UTC+6: an offer "ends 30 Nov" means the end of 30 Nov in Bangladesh.
const endOfDayDhaka = (date: string) => new Date(`${date}T23:59:59+06:00`);

export const saveProduct = async (input: unknown) =>
  adminAction(async () => {
    const data = productInputSchema.parse(input);
    await connectDB();

    const skus = data.variants.map((variant) => variant.sku.toUpperCase());
    if (new Set(skus).size !== skus.length) throw new AdminInputError("Two variants have the same SKU.");

    const fields = {
      name: data.name,
      slug: data.slug,
      brand: data.brand ? new Types.ObjectId(data.brand) : undefined,
      category: new Types.ObjectId(data.category),
      shortSpec: data.shortSpec,
      description: data.description,
      keyFeatures: data.keyFeatures,
      specGroups: data.specGroups,
      images: data.images,
      tags: data.tags,
      active: data.active,
      offerEndsAt: data.offerEndsAt ? endOfDayDhaka(data.offerEndsAt) : undefined,
      variants: data.variants.map((variant) => ({
        // Keep existing variant IDs so carts and past orders still point at the same variant.
        _id: variant.id ? new Types.ObjectId(variant.id) : new Types.ObjectId(),
        name: variant.name,
        colorHex: variant.colorHex || undefined,
        sku: variant.sku,
        price: variant.price,
        salePrice: variant.salePrice ?? undefined,
        stock: variant.stock,
        images: variant.images,
      })),
    };

    let product;
    if (data.id) {
      product = await Product.findById(data.id);
      if (!product) throw new AdminInputError("That product no longer exists.");
      product.set(fields);
      if (!data.brand) product.set("brand", undefined);
      if (!data.offerEndsAt) product.set("offerEndsAt", undefined);
      await product.save();
    } else {
      product = await Product.create(fields);
    }

    updateTag(PRODUCTS_TAG);
    return { id: product._id.toString(), slug: product.slug };
  }, "Product saved.");

export const setProductActive = async (id: unknown, active: unknown) =>
  adminAction(async () => {
    const productId = z.string().regex(/^[a-f\d]{24}$/i).parse(id);
    await connectDB();
    await Product.updateOne({ _id: productId }, { $set: { active: z.boolean().parse(active) } });
    updateTag(PRODUCTS_TAG);
  });

// Past orders keep their own copy of names and prices, so deleting is safe for order history.
export const deleteProduct = async (id: unknown) =>
  adminAction(async () => {
    const productId = z.string().regex(/^[a-f\d]{24}$/i).parse(id);
    await connectDB();
    const result = await Product.deleteOne({ _id: productId });
    if (result.deletedCount !== 1) throw new AdminInputError("That product was already deleted.");
    updateTag(PRODUCTS_TAG);
    // TODO: also delete its images from Cloudinary.
  }, "Product deleted.");
