import "server-only";
import { connectDB } from "@/lib/db";
import { effectivePrice } from "@/lib/pricing";
import { Brand } from "@/models/brand";
import { Category } from "@/models/category";
import { ContactMessage } from "@/models/contact-message";
import { ORDER_STATUSES, Order, type OrderStatus } from "@/models/order";
import { Product } from "@/models/product";
import { Settings } from "@/models/settings";
import type { ProductInput } from "./product-schema";
import type { SettingsInput } from "./settings-schema";

/*
 * Admin reads: always fresh (never cached). Callers must have passed
 * requireAdminPage() first.
 */

const dhakaDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(date)
    .split("/")
    .reverse()
    .join("-");

export const formatDhakaDateTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

// ---------- Orders ----------

export type AdminOrderRow = {
  orderNumber: string;
  createdAt: string;
  name: string;
  phone: string;
  area: "inside" | "outside";
  district: string;
  units: number;
  total: number;
  deliveryFee: number | null;
  status: OrderStatus;
};

export const listOrders = async (status?: OrderStatus, page = 1, pageSize = 30) => {
  await connectDB();
  const filter = status ? { status } : {};
  const [docs, total, counts] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(filter),
    Order.aggregate<{ _id: OrderStatus; count: number }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const statusCounts = Object.fromEntries(ORDER_STATUSES.map((value) => [value, 0])) as Record<OrderStatus, number>;
  for (const row of counts) statusCounts[row._id] = row.count;

  const rows: AdminOrderRow[] = docs.map((doc) => ({
    orderNumber: doc.orderNumber,
    createdAt: new Date(doc.createdAt).toISOString(),
    name: doc.customer.name,
    phone: doc.customer.phone,
    area: doc.delivery.area,
    district: doc.delivery.district,
    units: doc.items.reduce((sum, item) => sum + item.quantity, 0),
    total: doc.total,
    deliveryFee: doc.deliveryFee ?? null,
    status: doc.status,
  }));

  return { rows, total, statusCounts, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
};

export const getOrderDetail = async (orderNumber: string) => {
  await connectDB();
  const doc = await Order.findOne({ orderNumber }).lean();
  if (!doc) return null;

  // Fake-order check: what happened to this phone number's other orders.
  const history = await Order.aggregate<{ _id: OrderStatus; count: number }>([
    { $match: { "customer.phone": doc.customer.phone, _id: { $ne: doc._id } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const phoneHistory = Object.fromEntries(history.map((row) => [row._id, row.count])) as Partial<Record<OrderStatus, number>>;

  return {
    orderNumber: doc.orderNumber,
    createdAt: new Date(doc.createdAt).toISOString(),
    status: doc.status,
    customer: { name: doc.customer.name, phone: doc.customer.phone, email: doc.customer.email ?? "" },
    delivery: {
      area: doc.delivery.area,
      district: doc.delivery.district,
      address: doc.delivery.address,
      note: doc.delivery.note ?? "",
    },
    items: doc.items.map((item) => ({
      productId: item.product.toString(),
      sku: item.sku,
      name: item.name,
      variantName: item.variantName ?? "",
      image: item.image ?? "",
      price: item.price,
      quantity: item.quantity,
    })),
    subtotal: doc.subtotal,
    deliveryFee: doc.deliveryFee ?? null,
    total: doc.total,
    statusHistory: doc.statusHistory.map((entry) => ({
      status: entry.status,
      at: new Date(entry.at).toISOString(),
      note: entry.note ?? "",
    })),
    courier: {
      name: doc.courier?.name ?? "",
      trackingId: doc.courier?.trackingId ?? "",
      trackingUrl: doc.courier?.trackingUrl ?? "",
    },
    adminNotes: doc.adminNotes ?? "",
    stockRestored: Boolean(doc.stockRestored),
    ip: doc.meta?.ip ?? "",
    phoneHistory,
  };
};

export type AdminOrderDetail = NonNullable<Awaited<ReturnType<typeof getOrderDetail>>>;

// ---------- Products ----------

export const listProductsAdmin = async () => {
  await connectDB();
  const [docs, categories] = await Promise.all([
    Product.find().sort({ createdAt: -1 }).lean(),
    Category.find().select("name").lean(),
  ]);
  const categoryNames = new Map(categories.map((category) => [category._id.toString(), category.name]));

  return docs.map((doc) => {
    const prices = doc.variants.map((variant) => effectivePrice(variant));
    return {
      id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      image: doc.images[0]?.src ?? doc.variants.find((variant) => variant.images.length)?.images[0]?.src ?? "",
      category: categoryNames.get(doc.category.toString()) ?? "—",
      variants: doc.variants.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      stock: doc.variants.reduce((sum, variant) => sum + variant.stock, 0),
      outOfStock: doc.variants.filter((variant) => variant.stock === 0).length,
      soldCount: doc.soldCount,
      active: doc.active,
    };
  });
};

export const getProductForEdit = async (id: string): Promise<ProductInput | null> => {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connectDB();
  const doc = await Product.findById(id).lean();
  if (!doc) return null;

  const image = (item: { src: string; publicId?: string; alt?: string; position?: string }) => ({
    src: item.src,
    publicId: item.publicId || undefined,
    alt: item.alt || undefined,
    position: item.position || undefined,
  });

  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    brand: doc.brand?.toString() ?? "",
    category: doc.category.toString(),
    shortSpec: doc.shortSpec,
    description: doc.description,
    keyFeatures: doc.keyFeatures,
    specGroups: doc.specGroups.map((group) => ({
      title: group.title,
      items: group.items.map((item) => ({ label: item.label, value: item.value })),
    })),
    images: doc.images.map(image),
    tags: doc.tags,
    active: doc.active,
    offerEndsAt: doc.offerEndsAt ? dhakaDate(new Date(doc.offerEndsAt)) : "",
    variants: doc.variants.map((variant) => ({
      id: variant._id.toString(),
      name: variant.name,
      colorHex: variant.colorHex ?? "",
      sku: variant.sku,
      price: variant.price,
      salePrice: variant.salePrice ?? null,
      stock: variant.stock,
      images: variant.images.map(image),
    })),
  };
};

// ---------- Categories & brands ----------

export const listCategoriesAdmin = async () => {
  await connectDB();
  const [categories, counts] = await Promise.all([
    Category.find().sort({ sortOrder: 1, name: 1 }).lean(),
    Product.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
  ]);
  const byId = new Map(counts.map((row) => [String(row._id), row.count]));
  return categories.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    shortName: doc.shortName,
    slug: doc.slug,
    icon: doc.icon,
    active: doc.active,
    products: byId.get(doc._id.toString()) ?? 0,
  }));
};

export const listBrandsAdmin = async () => {
  await connectDB();
  const [brands, counts] = await Promise.all([
    Brand.find().sort({ sortOrder: 1, name: 1 }).lean(),
    Product.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: "$brand", count: { $sum: 1 } } }]),
  ]);
  const byId = new Map(counts.map((row) => [String(row._id), row.count]));
  return brands.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    featured: doc.featured,
    active: doc.active,
    products: byId.get(doc._id.toString()) ?? 0,
  }));
};

// ---------- Settings ----------

export const getSettingsForEdit = async (): Promise<SettingsInput> => {
  await connectDB();
  const doc = await Settings.findOne({ key: "site" }).lean();
  const banner = doc?.saleBanner;
  return {
    phone: doc?.phone ?? "",
    email: doc?.email ?? "",
    hours: doc?.hours ?? "",
    facebookUrl: doc?.facebookUrl ?? "",
    messengerUrl: doc?.messengerUrl ?? "",
    whatsappUrl: doc?.whatsappUrl ?? "",
    delivery: {
      insideDhaka: { fee: doc?.delivery?.insideDhaka?.fee ?? null, time: doc?.delivery?.insideDhaka?.time ?? "" },
      outsideDhaka: { fee: doc?.delivery?.outsideDhaka?.fee ?? null, time: doc?.delivery?.outsideDhaka?.time ?? "" },
    },
    heroSlides: (doc?.heroSlides ?? []).map((slide) => ({
      eyebrow: slide.eyebrow,
      badge: slide.badge ?? "",
      headline: slide.headline,
      description: slide.description,
      descriptionLong: slide.descriptionLong ?? "",
      price: slide.price ?? null,
      oldPrice: slide.oldPrice ?? null,
      ctaLabel: slide.ctaLabel,
      ctaHref: slide.ctaHref,
      image: { src: slide.image.src, alt: slide.image.alt ?? "", position: slide.image.position ?? "" },
    })),
    promoTiles: (doc?.promoTiles ?? []).map((tile) => ({
      href: tile.href,
      image: { src: tile.image.src, alt: tile.image.alt ?? "" },
    })),
    saleBanner: {
      enabled: banner?.enabled ?? false,
      badge: banner?.badge ?? "Sale",
      title: banner?.title ?? "",
      description: banner?.description ?? "",
      ctaLabel: banner?.ctaLabel ?? "",
      ctaHref: banner?.ctaHref ?? "",
      endsAt: banner?.endsAt ? dhakaDate(new Date(banner.endsAt)) : "",
      image: { src: banner?.image?.src ?? "", alt: banner?.image?.alt ?? "", position: banner?.image?.position ?? "" },
    },
  };
};

// ---------- Messages ----------

export const listMessages = async () => {
  await connectDB();
  const docs = await ContactMessage.find().sort({ createdAt: -1 }).limit(200).lean();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    phone: doc.phone,
    message: doc.message,
    status: doc.status,
    createdAt: new Date(doc.createdAt).toISOString(),
  }));
};

export const countNewMessages = async () => {
  await connectDB();
  return ContactMessage.countDocuments({ status: "new" });
};
