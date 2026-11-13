/*
 * Seeds categories, brands, sample products and shop settings.
 *
 *   npm run seed
 *
 * Safe to re-run: it only creates records that don't exist yet (matched by
 * slug / key) and never overwrites or deletes anything.
 *
 * Only the Hoco EQ34 Plus price is real. The other prices are SAMPLE values:
 * edit them (or delete the products) before launch. Prefer seeding a separate
 * development database rather than production.
 */
import mongoose from "mongoose";
import { Brand } from "../src/models/brand";
import { Category } from "../src/models/category";
import { Product, type ProductDoc } from "../src/models/product";
import { Settings, type SettingsDoc } from "../src/models/settings";

const categories = [
  { name: "Earbuds", shortName: "Earbuds", slug: "earbuds", icon: "earbuds" },
  { name: "Earbud covers", shortName: "Covers", slug: "earbud-covers", icon: "earbud-covers" },
  { name: "Speakers", shortName: "Speakers", slug: "speakers", icon: "speakers" },
  { name: "Karaoke", shortName: "Karaoke", slug: "karaoke", icon: "karaoke" },
  { name: "Microphones", shortName: "Mics", slug: "microphones", icon: "microphones" },
  { name: "Smart watches", shortName: "Watches", slug: "smart-watches", icon: "smart-watches" },
  { name: "Trackers", shortName: "Trackers", slug: "trackers", icon: "trackers" },
  { name: "Adapters", shortName: "Adapters", slug: "adapters", icon: "adapters" },
  { name: "Chargers", shortName: "Chargers", slug: "chargers", icon: "chargers" },
].map((category, index) => ({ ...category, sortOrder: index + 1 }));

const brands = [
  { name: "Hoco", slug: "hoco", featured: true, sortOrder: 1 },
  { name: "Anker", slug: "anker", featured: true, sortOrder: 2 },
];

type SeedProduct = Omit<ProductDoc, "brand" | "category" | "variants" | "createdAt" | "updatedAt" | "soldCount" | "active"> & {
  brand?: string;
  category: string;
  variants: Omit<ProductDoc["variants"][number], "_id">[];
};

const img = (file: string, alt: string, position?: string) => ({ src: `/sample/${file}`, alt, position });

const products: SeedProduct[] = [
  {
    name: "Hoco EQ34 Plus ANC + ENC Earbuds",
    slug: "hoco-eq34-plus",
    brand: "hoco",
    category: "earbuds",
    shortSpec: "32h playtime · IPX5",
    description:
      "Premium sound at a budget price. The Hoco EQ34 Plus combines active noise cancellation (ANC) with environmental noise cancellation (ENC) for clearer music and calls, with up to 32 hours of total playtime and IPX5 water resistance.",
    keyFeatures: [
      "Active noise cancellation (ANC)",
      "Environmental noise cancellation (ENC) for calls",
      "Up to 32 hours total playtime",
      "IPX5 water resistant",
    ],
    specGroups: [
      { title: "General", items: [{ label: "Brand", value: "Hoco" }, { label: "Model", value: "EQ34 Plus" }, { label: "Colour", value: "Black" }] },
      { title: "Audio", items: [{ label: "Noise control", value: "ANC + ENC" }] },
      { title: "Battery", items: [{ label: "Total playtime", value: "Up to 32 hours" }] },
      { title: "Durability", items: [{ label: "Water resistance", value: "IPX5" }] },
    ],
    images: [img("post-hoco-eq34-plus.webp", "Hoco EQ34 Plus earbuds and case", "center 60%")],
    variants: [{ name: "Black", colorHex: "#111111", sku: "HOCO-EQ34P-BLK", price: 800, salePrice: 729, stock: 20, images: [] }],
    tags: ["exclusive", "top-selling"],
  },
  {
    name: "Hoco L22 Dual Wireless Lapel Mic",
    slug: "hoco-l22-dual-wireless-mic",
    brand: "hoco",
    category: "microphones",
    shortSpec: "Magnetic & lapel clip",
    description: "Dual wireless lapel microphones with magnetic and clip mounting.",
    keyFeatures: ["Two wireless microphones", "Magnetic and lapel clip mounting"],
    specGroups: [],
    images: [img("post-hoco-l22-mic.webp", "Hoco L22 dual wireless mic", "center 72%")],
    variants: [{ name: "Black", colorHex: "#111111", sku: "HOCO-L22-BLK", price: 1250, stock: 15, images: [] }], // SAMPLE price
    tags: ["exclusive", "new"],
  },
  {
    name: "Anker 45W USB-C Fast Charger",
    slug: "anker-45w-usb-c-charger",
    brand: "anker",
    category: "chargers",
    shortSpec: "iPhone · Galaxy · iPad",
    description: "45W USB-C fast charging for iPhone, Galaxy, iPad and MacBook.",
    keyFeatures: ["45W USB-C fast charging", "Works with iPhone, Galaxy, iPad and MacBook"],
    specGroups: [],
    images: [img("post-anker-45w-charger.webp", "Anker 45W USB-C charger", "center 78%")],
    variants: [{ name: "White", colorHex: "#f5f5f5", sku: "ANKER-45W-WHT", price: 2450, stock: 12, images: [] }], // SAMPLE price
    tags: ["top-selling"],
  },
  {
    name: "Y80 Ultra Smart Watch",
    slug: "y80-ultra-smart-watch",
    category: "smart-watches",
    shortSpec: "8 strap styles",
    description: "One smart watch. Eight strap styles: silicone, sport, steel and braided.",
    keyFeatures: ["Eight interchangeable straps"],
    specGroups: [],
    images: [img("post-y80-ultra-watch.webp", "Y80 Ultra smart watch with eight straps", "center 55%")],
    variants: [{ name: "Orange", colorHex: "#f07800", sku: "Y80-ULTRA-ORG", price: 1850, stock: 10, images: [] }], // SAMPLE price
    tags: ["exclusive", "top-selling"],
  },
  {
    name: "Hoco E103 Anti-lost Tracker",
    slug: "hoco-e103-tracker",
    brand: "hoco",
    category: "trackers",
    shortSpec: "Find My & Find Hub",
    description: "Anti-lost tracker that works with Apple Find My and Google Find Hub.",
    keyFeatures: ["Works with Find My and Find Hub"],
    specGroups: [],
    images: [img("post-hoco-e103-tracker.webp", "Hoco E103 location tracker", "62% 50%")],
    variants: [{ name: "White", colorHex: "#f5f5f5", sku: "HOCO-E103-WHT", price: 990, stock: 25, images: [] }], // SAMPLE price
    tags: ["exclusive", "top-selling", "new"],
  },
  {
    name: "Boombox Bluetooth Speaker",
    slug: "boombox-bluetooth-speaker",
    category: "speakers",
    shortSpec: "Portable · Big sound",
    description: "Portable Bluetooth speaker with big sound.",
    keyFeatures: ["Portable", "Big sound"],
    specGroups: [],
    images: [img("post-boombox-blue.webp", "Blue Boombox speaker", "center 62%")],
    variants: [
      // SAMPLE prices
      { name: "Blue", colorHex: "#1f5bc4", sku: "BOOMBOX-BLU", price: 1650, stock: 8, images: [img("post-boombox-blue.webp", "Blue Boombox speaker", "center 62%")] },
      { name: "Camo", colorHex: "#4b5d3a", sku: "BOOMBOX-CAMO", price: 1650, stock: 0, images: [img("post-boombox-green.webp", "Camo Boombox speaker", "center 62%")] },
    ],
    tags: ["exclusive", "top-selling", "new"],
  },
];

const settings: Omit<SettingsDoc, "createdAt" | "updatedAt"> = {
  key: "site",
  phone: "[YOUR PHONE NUMBER]",
  email: "[YOUR EMAIL]",
  hours: "[10am–10pm]",
  facebookUrl: "https://facebook.com/ModzTech",
  messengerUrl: "https://m.me/ModzTech",
  delivery: { insideDhaka: {}, outsideDhaka: {} },
  heroSlides: [
    {
      eyebrow: "Hoco EQ34 Plus",
      badge: "Launch offer",
      headline: ["Premium sound.", "Budget price."],
      description: "ANC + ENC earbuds.",
      descriptionLong: "ANC + ENC earbuds with up to 32 hours of playtime.",
      price: 729,
      oldPrice: 800,
      ctaLabel: "Order now",
      ctaHref: "/product/hoco-eq34-plus",
      image: { src: "/sample/post-hoco-eq34-plus.webp", alt: "Hoco EQ34 Plus earbuds and case", position: "center 55%" },
    },
    {
      eyebrow: "Y80 Ultra smart watch",
      headline: ["One smart watch.", "Eight strap styles."],
      description: "Silicone, sport, steel and braided straps.",
      descriptionLong: "Silicone, sport, steel and braided straps in one box.",
      ctaLabel: "Shop watches",
      ctaHref: "/category/smart-watches",
      image: { src: "/sample/post-y80-ultra-watch.webp", alt: "Y80 Ultra smart watch with eight straps", position: "center 58%" },
    },
    {
      eyebrow: "Anker 45W charger",
      headline: ["Power without", "the wait."],
      description: "45W USB-C fast charging.",
      descriptionLong: "45W USB-C fast charging for iPhone, Galaxy, iPad and MacBook.",
      ctaLabel: "Shop chargers",
      ctaHref: "/category/chargers",
      image: { src: "/sample/post-anker-45w-charger.webp", alt: "Anker 45W USB-C charger", position: "center 75%" },
    },
  ],
  promoTiles: [
    { href: "/category/smart-watches", image: { src: "/sample/post-y80-ultra-watch.webp", alt: "Y80 Ultra smart watch with eight straps" } },
    { href: "/category/trackers", image: { src: "/sample/post-hoco-e103-tracker.webp", alt: "Hoco E103 location tracker" } },
    { href: "/category/chargers", image: { src: "/sample/post-anker-45w-charger.webp", alt: "Anker 45W USB-C charger" } },
    { href: "/category/microphones", image: { src: "/sample/post-hoco-l22-mic.webp", alt: "Hoco L22 dual wireless mic" } },
  ],
  saleBanner: {
    enabled: true,
    badge: "Sale",
    title: "Unleash your sound.",
    description: "Boombox speakers at a limited-time price.",
    ctaLabel: "Shop speakers",
    ctaHref: "/category/speakers",
    endsAt: new Date("2026-11-30T23:59:59+06:00"),
    image: { src: "/sample/post-boombox-blue.webp", alt: "Blue Boombox speaker", position: "center 62%" },
  },
};

const createIfMissing = async <T>(
  label: string,
  exists: () => Promise<unknown>,
  create: () => Promise<T>,
) => {
  if (await exists()) {
    console.log(`  skip    ${label} (already exists)`);
    return false;
  }
  await create();
  console.log(`  created ${label}`);
  return true;
};

const main = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");

  await mongoose.connect(uri);
  console.log(`Connected to database "${mongoose.connection.name}".`);

  // Build indexes (unique slugs, SKUs, search) before inserting.
  await Promise.all([Category.init(), Brand.init(), Product.init(), Settings.init()]);

  console.log("Categories");
  for (const category of categories) {
    await createIfMissing(category.slug, () => Category.exists({ slug: category.slug }), () => Category.create(category));
  }

  console.log("Brands");
  for (const brand of brands) {
    await createIfMissing(brand.slug, () => Brand.exists({ slug: brand.slug }), () => Brand.create(brand));
  }

  const categoryIds = new Map((await Category.find().select("slug").lean()).map((doc) => [doc.slug, doc._id]));
  const brandIds = new Map((await Brand.find().select("slug").lean()).map((doc) => [doc.slug, doc._id]));

  console.log("Products");
  for (const { brand, category, ...product } of products) {
    const categoryId = categoryIds.get(category);
    if (!categoryId) throw new Error(`Unknown category "${category}" for ${product.slug}`);
    await createIfMissing(
      product.slug,
      () => Product.exists({ slug: product.slug }),
      () => Product.create({ ...product, category: categoryId, brand: brand ? brandIds.get(brand) : undefined }),
    );
  }

  console.log("Settings");
  await createIfMissing("site settings", () => Settings.exists({ key: "site" }), () => Settings.create(settings));

  console.log("Done. Remember: only the Hoco EQ34 Plus price is real; the rest are sample prices.");
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
