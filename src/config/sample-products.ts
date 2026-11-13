/*
 * TEMPORARY sample products so the home page isn't empty.
 * Replaced by MongoDB products (with variants and stock) in the database stage.
 * Only the Hoco EQ34 Plus price is real; `price: null` renders the mockup's
 * "৳[price]" placeholder.
 */
export type CardProduct = {
  slug: string;
  name: string;
  brand?: string;
  category: string;
  /** null = price not known yet (placeholder). */
  price: number | null;
  oldPrice?: number;
  /** Short spec line under the price. */
  spec: string;
  isNew?: boolean;
  image: { src: string; position?: string };
};

export const sampleProducts = {
  eq34: {
    slug: "hoco-eq34-plus",
    name: "Hoco EQ34 Plus ANC + ENC Earbuds",
    brand: "Hoco",
    category: "earbuds",
    price: 729,
    oldPrice: 800,
    spec: "32h playtime · IPX5",
    image: { src: "/sample/post-hoco-eq34-plus.webp", position: "center 60%" },
  },
  mic: {
    slug: "hoco-l22-dual-wireless-mic",
    name: "Hoco L22 Dual Wireless Lapel Mic",
    brand: "Hoco",
    category: "microphones",
    price: null,
    spec: "Magnetic & lapel clip",
    isNew: true,
    image: { src: "/sample/post-hoco-l22-mic.webp", position: "center 72%" },
  },
  anker: {
    slug: "anker-45w-usb-c-charger",
    name: "Anker 45W USB-C Fast Charger",
    brand: "Anker",
    category: "chargers",
    price: null,
    spec: "iPhone · Galaxy · iPad",
    image: { src: "/sample/post-anker-45w-charger.webp", position: "center 78%" },
  },
  watch: {
    slug: "y80-ultra-smart-watch",
    name: "Y80 Ultra Smart Watch",
    category: "smart-watches",
    price: null,
    spec: "8 strap styles",
    image: { src: "/sample/post-y80-ultra-watch.webp", position: "center 55%" },
  },
  tracker: {
    slug: "hoco-e103-tracker",
    name: "Hoco E103 Anti-lost Tracker",
    brand: "Hoco",
    category: "trackers",
    price: null,
    spec: "Find My & Find Hub",
    isNew: true,
    image: { src: "/sample/post-hoco-e103-tracker.webp", position: "62% 50%" },
  },
  boomboxBlue: {
    slug: "boombox-bluetooth-speaker-blue",
    name: "Boombox Bluetooth Speaker, Blue",
    category: "speakers",
    price: null,
    spec: "Portable · Big sound",
    image: { src: "/sample/post-boombox-blue.webp", position: "center 62%" },
  },
  boomboxCamo: {
    slug: "boombox-bluetooth-speaker-camo",
    name: "Boombox Bluetooth Speaker, Camo",
    category: "speakers",
    price: null,
    spec: "Portable · Big sound",
    image: { src: "/sample/post-boombox-green.webp", position: "center 62%" },
  },
} satisfies Record<string, CardProduct>;
