/*
 * Home page content.
 * TEMPORARY: product rows come from MongoDB (by tag / sales / date) in the
 * database stage; promo tiles and the sale banner move to admin Settings.
 */
import { type CardProduct, sampleProducts as p } from "./sample-products";

export type ProductRow = {
  id: string;
  eyebrow?: string;
  title: string;
  href: string;
  /** "order" = blue "Order now" buttons, "cart" = outline "Add to cart". */
  cta: "order" | "cart";
  products: CardProduct[];
  /** How many cards phones show (desktop shows up to 5). */
  mobileCount?: number;
  /** Phones only, as in the mockup (desktop has no category rows). */
  mobileOnly?: boolean;
};

export const exclusiveRow: ProductRow = {
  id: "exclusive",
  eyebrow: "Hand-picked",
  title: "Exclusive",
  href: "/shop?tag=exclusive",
  cta: "order",
  products: [p.eq34, p.mic, p.watch, p.boomboxBlue, p.tracker],
};

export const brandShelf = {
  title: "Shop by brand",
  href: "/shop",
  brands: [
    { name: "Hoco", slug: "hoco", products: [p.tracker, p.mic, p.eq34] },
    { name: "Anker", slug: "anker", products: [p.anker] },
  ],
};

export const topSellingRow: ProductRow = {
  id: "top-selling",
  eyebrow: "Customers love",
  title: "Top selling",
  href: "/shop?sort=best-selling",
  cta: "order",
  products: [p.eq34, p.watch, p.boomboxBlue, p.anker, p.tracker],
  mobileCount: 4,
};

export const newArrivalsRow: ProductRow = {
  id: "new-arrivals",
  eyebrow: "Just landed",
  title: "New arrivals",
  href: "/shop?sort=newest",
  cta: "cart",
  products: [p.mic, p.tracker, p.boomboxCamo, p.watch, p.anker],
};

export const categoryRows: ProductRow[] = [
  {
    id: "speakers-audio",
    title: "Speakers & audio",
    href: "/category/speakers",
    cta: "cart",
    products: [p.boomboxBlue, p.boomboxCamo],
    mobileOnly: true,
  },
  {
    id: "watches-trackers",
    title: "Watches & trackers",
    href: "/category/smart-watches",
    cta: "cart",
    products: [p.watch, p.tracker],
    mobileOnly: true,
  },
];

export const promoTiles = [
  { href: "/category/smart-watches", src: "/sample/post-y80-ultra-watch.webp", alt: "Y80 Ultra smart watch with eight straps" },
  { href: "/category/trackers", src: "/sample/post-hoco-e103-tracker.webp", alt: "Hoco E103 location tracker" },
  { href: "/category/chargers", src: "/sample/post-anker-45w-charger.webp", alt: "Anker 45W USB-C charger" },
  { href: "/category/microphones", src: "/sample/post-hoco-l22-mic.webp", alt: "Hoco L22 dual wireless mic" },
];

export const saleBanner = {
  badge: "Sale",
  title: "Unleash your sound.",
  description: "Boombox speakers at a limited-time price.",
  cta: { label: "Shop speakers", href: "/category/speakers" },
  /** Countdown target (Bangladesh time). Placeholder date. */
  endsAt: "2026-11-30T23:59:59+06:00",
  image: { src: "/sample/post-boombox-blue.webp", alt: "Blue Boombox speaker", position: "center 62%" },
};
