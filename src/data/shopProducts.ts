import type { StaticImageData } from "next/image";
import heroProduct from "@public/products/hero-section-product.jpg";
import airpodsPro2 from "@public/products/earbuds-pro2.jpg";
import airpodsPro3 from "@public/products/earbuds-pro3.jpg";
import nintentoCover from "@public/products/nintendo.png";
import adidasCase from "@public/products/adidas.png";
import blackPantherCase from "@public/products/black-panther.png";
import controllerCase from "@public/products/controller.png";
import hogCase from "@public/products/hog.png";
import pikachuCase from "@public/products/pikachu.png";
import polaroidCase from "@public/products/polaroid.png";
import radioCase from "@public/products/radio.png";

export type ShopProductIcon =
  | "earbuds"
  | "battery"
  | "watch"
  | "charger"
  | "hub"
  | "speaker"
  | "laptop"
  | "case";

export type QuickSpec = { value: string; label: string };
export type Spec = { k: string; v: string };
export type GalleryItem = { label: string; image: StaticImageData | null };
export type Colour = { name: string; swatch: string };
export type Bundle = {
  kicker: string;
  highlighted: boolean;
  parts: { name: string; image: StaticImageData | null }[];
  partIds: string[];
  save: number;
};

export type ProductDetails = {
  description: string[];
  quickSpecs: QuickSpec[];
  specs: Spec[];
  gallery?: GalleryItem[];
  colours?: Colour[];
  bundles?: Bundle[];
  related?: string[];
};

export type ShopProduct = {
  id: string;
  slug: string;
  category: string;
  name: string;
  note: string;
  price: number;
  oldPrice: number;
  tag: string;
  inStock: boolean;
  image: StaticImageData | null;
  icon: ShopProductIcon;
  details?: ProductDetails;
};

// Full shop catalogue — placeholder products across 5 categories so the
// sidebar filters, sort, and pagination have something to bite on. Replace
// wholesale with the real catalogue; image: null shows an icon placeholder
// until real photography exists for that item.
//
// `details` is optional, richer product-page content (description
// paragraphs, quick spec strip, full spec table, colour options, gallery,
// bundles, related product ids). Only fleshed out for the two products
// featured in the design handoff (Hoco EQ34 Plus, Airpods Pro 3) — every
// other product falls back to generic details derived from the fields
// above, per the handoff's own "fall back to same-category items" guidance.

// Single site-wide offer window, matching the homepage offers strip.
export const offerEndsAt = new Date("2026-09-30T23:59:00");

export const shopProducts: ShopProduct[] = [
  {
    id: "hoco-eq-34-plus",
    slug: "/shop/hoco-eq-34-plus",
    category: "Audio",
    name: "Hoco EQ34 Plus",
    note: "ANC+ENC TWS with a 32-hour case battery.",
    price: 729,
    oldPrice: 990,
    tag: "Bestseller",
    inStock: true,
    image: heroProduct,
    icon: "earbuds",
    details: {
      description: [
        "Active noise cancellation that actually cancels, a case that lasts the week, and touch controls that don't fire by accident — the earbuds we reach for ourselves.",
        "Four silicone tip sizes are in the box, and the case tops the buds up several times over before it needs a charge itself.",
      ],
      quickSpecs: [
        { value: "ANC+ENC", label: "Noise control" },
        { value: "BT 5.3", label: "Connection" },
        { value: "Touch", label: "Controls" },
      ],
      specs: [
        { k: "NOISE CONTROL", v: "Active ANC + ENC calls" },
        { k: "PLAYBACK", v: "7 hr buds · 32 hr with case" },
        { k: "CHARGING", v: "USB-C" },
        { k: "CONNECTION", v: "Bluetooth 5.3" },
        { k: "CONTROLS", v: "Touch, per-ear" },
        { k: "IN THE BOX", v: "Buds, case, 3 tip sizes, cable" },
        { k: "WEIGHT", v: "4.8 g per bud · 44 g case" },
      ],
      gallery: [
        { label: "FRONT", image: heroProduct },
        { label: "CASE", image: heroProduct },
        { label: "BUDS", image: heroProduct },
        { label: "IN BOX", image: heroProduct },
      ],
    },
  },
  {
    id: "pro_2",
    slug: "/shop/pro_2",
    category: "Power",
    name: "Hoco J102",
    note: "20,000mAh power bank, best in budget.",
    price: 1690,
    oldPrice: 2150,
    tag: "On offer",
    inStock: true,
    image: airpodsPro2,
    icon: "battery",
  },
  {
    id: "pro_3",
    slug: "/shop/pro_3",
    category: "Audio",
    name: "Airpods Pro 3",
    note: "Active noise cancellation, USB-C case.",
    price: 2149,
    oldPrice: 2500,
    tag: "Limited",
    inStock: true,
    image: airpodsPro3,
    icon: "earbuds",
    details: {
      description: [
        "Active noise cancellation that actually cancels, a USB-C case that lasts the week, and a fit that stays put on a rickshaw ride. Sealed retail box, checked before it leaves us.",
        "Four silicone tip sizes are in the box. Sweat and splash resistant to IPX4, so a wet commute is not a problem.",
      ],
      quickSpecs: [
        { value: "ANC", label: "Noise control" },
        { value: "30 hr", label: "With case" },
        { value: "USB-C", label: "Charging" },
      ],
      specs: [
        { k: "NOISE CONTROL", v: "Active ANC + transparency" },
        { k: "PLAYBACK", v: "6 hr buds · 30 hr with case" },
        { k: "CHARGING", v: "USB-C · wireless Qi" },
        { k: "CONNECTION", v: "Bluetooth 5.3, multipoint" },
        { k: "WATER RESISTANCE", v: "IPX4 buds and case" },
        { k: "IN THE BOX", v: "Buds, case, 4 tip sizes, cable" },
        { k: "WEIGHT", v: "5.3 g per bud · 51 g case" },
      ],
      colours: [
        { name: "White", swatch: "#e8ebef" },
        { name: "Midnight", swatch: "#1b1f26" },
      ],
      gallery: [
        { label: "FRONT", image: airpodsPro3 },
        { label: "SIDE", image: airpodsPro3 },
        { label: "BUDS", image: airpodsPro3 },
        { label: "IN BOX", image: airpodsPro3 },
      ],
      bundles: [
        {
          kicker: "Most added",
          highlighted: true,
          parts: [
            { name: "Airpods Pro 3", image: airpodsPro3 },
            { name: "Silicone Case Cover", image: null },
          ],
          partIds: ["pro_3", "silicone-case-cover"],
          save: 100,
        },
        {
          kicker: "Protect it",
          highlighted: false,
          parts: [
            { name: "Airpods Pro 3", image: airpodsPro3 },
            { name: "Clear Armour Case", image: null },
          ],
          partIds: ["pro_3", "clear-armour-case"],
          save: 130,
        },
        {
          kicker: "Full kit",
          highlighted: false,
          parts: [
            { name: "Airpods Pro 3", image: airpodsPro3 },
            { name: "Case Cover", image: null },
            { name: "Foam Tips", image: null },
          ],
          partIds: ["pro_3", "silicone-case-cover", "memory-foam-tips"],
          save: 270,
        },
      ],
      related: [
        "silicone-case-cover",
        "clear-armour-case",
        "memory-foam-tips",
        "braided-cable-30cm",
      ],
    },
  },
  {
    id: "nitento_cover",
    slug: "/shop/nitento_cover",
    category: "Accessories",
    name: "Nitento Phone Case",
    note: "Shock-absorbing shell with a raised lip.",
    price: 890,
    oldPrice: 1100,
    tag: "Restocked",
    inStock: true,
    image: nintentoCover,
    icon: "case",
  },
  {
    id: "hoco-y13-watch",
    slug: "/shop/hoco-y13-watch",
    category: "Wearables",
    name: "Hoco Y13 Smart Watch",
    note: "Calls, heart rate, a week between charges.",
    price: 1450,
    oldPrice: 1790,
    tag: "On offer",
    inStock: true,
    image: pikachuCase,
    icon: "watch",
  },
  {
    id: "hoco-c72-charger",
    slug: "/shop/hoco-c72-charger",
    category: "Power",
    name: "Hoco C72 20W Charger",
    note: "Single USB-C port, full phone in 90 minutes.",
    price: 560,
    oldPrice: 560,
    tag: "",
    inStock: true,
    image: radioCase,
    icon: "charger",
  },
  {
    id: "braided-usbc-cable",
    slug: "/shop/braided-usbc-cable",
    category: "Accessories",
    name: "Braided USB-C Cable 1m",
    note: "60W rated, tested to 10,000 bends.",
    price: 320,
    oldPrice: 320,
    tag: "",
    inStock: true,
    image: null,
    icon: "hub",
  },
  {
    id: "hoco-ah14-dock",
    slug: "/shop/hoco-ah14-dock",
    category: "Desk",
    name: "Hoco AH14 3-in-1 Dock",
    note: "Phone, watch and buds from one adapter.",
    price: 2390,
    oldPrice: 2900,
    tag: "New",
    inStock: true,
    image: polaroidCase,
    icon: "hub",
  },
  {
    id: "hoco-w35-overear",
    slug: "/shop/hoco-w35-overear",
    category: "Audio",
    name: "Hoco W35 Over-Ear",
    note: "Foldable wireless cans, 24-hour playback.",
    price: 1250,
    oldPrice: 1250,
    tag: "",
    inStock: true,
    image: adidasCase,
    icon: "earbuds",
  },
  {
    id: "hoco-bs41-speaker",
    slug: "/shop/hoco-bs41-speaker",
    category: "Audio",
    name: "Hoco BS41 Speaker",
    note: "Pocket speaker with a surprising low end.",
    price: 980,
    oldPrice: 980,
    tag: "",
    inStock: false,
    image: blackPantherCase,
    icon: "speaker",
  },
  {
    id: "magfold-stand",
    slug: "/shop/magfold-stand",
    category: "Desk",
    name: "MagFold Phone Stand",
    note: "Aluminium, folds flat, magnetic hold.",
    price: 690,
    oldPrice: 690,
    tag: "",
    inStock: true,
    image: null,
    icon: "laptop",
  },
  {
    id: "hoco-y5-band",
    slug: "/shop/hoco-y5-band",
    category: "Wearables",
    name: "Hoco Y5 Fitness Band",
    note: "Step, sleep and heart tracking, IP68.",
    price: 1150,
    oldPrice: 1150,
    tag: "",
    inStock: true,
    image: hogCase,
    icon: "watch",
  },
  {
    id: "hoco-z49-car-charger",
    slug: "/shop/hoco-z49-car-charger",
    category: "Power",
    name: "Hoco Z49 Car Charger",
    note: "Dual port, 38W, fits flush in the socket.",
    price: 640,
    oldPrice: 640,
    tag: "",
    inStock: true,
    image: null,
    icon: "charger",
  },
  {
    id: "felt-laptop-sleeve",
    slug: "/shop/felt-laptop-sleeve",
    category: "Accessories",
    name: 'Felt Laptop Sleeve 14"',
    note: "Wool-blend felt with a soft inner lining.",
    price: 1290,
    oldPrice: 1290,
    tag: "",
    inStock: true,
    image: null,
    icon: "laptop",
  },
  {
    id: "hoco-cw39-pad",
    slug: "/shop/hoco-cw39-pad",
    category: "Power",
    name: "Hoco CW39 Wireless Pad",
    note: "15W Qi pad with a grippy silicone face.",
    price: 880,
    oldPrice: 880,
    tag: "",
    inStock: false,
    image: null,
    icon: "battery",
  },
  {
    id: "modz-usbc-hub",
    slug: "/shop/modz-usbc-hub",
    category: "Desk",
    name: "Modz 6-in-1 USB-C Hub",
    note: "HDMI, two USB-A, SD, microSD, 100W PD.",
    price: 2450,
    oldPrice: 2450,
    tag: "New",
    inStock: true,
    image: controllerCase,
    icon: "hub",
  },
  // Accessory items — modeled as real catalogue entries (not just inline
  // copy on the Airpods Pro 3 detail page) so they're independently
  // browsable and match the "explicit accessory relation" guidance.
  {
    id: "silicone-case-cover",
    slug: "/shop/silicone-case-cover",
    category: "Accessories",
    name: "Silicone Case Cover",
    note: "Grippy shell with a carabiner loop.",
    price: 390,
    oldPrice: 390,
    tag: "",
    inStock: true,
    image: null,
    icon: "case",
  },
  {
    id: "clear-armour-case",
    slug: "/shop/clear-armour-case",
    category: "Accessories",
    name: "Clear Armour Case",
    note: "Shock-absorbing clear shell, no yellowing.",
    price: 450,
    oldPrice: 450,
    tag: "",
    inStock: true,
    image: null,
    icon: "case",
  },
  {
    id: "memory-foam-tips",
    slug: "/shop/memory-foam-tips",
    category: "Accessories",
    name: "Memory Foam Tips (3 pairs)",
    note: "Better seal, deeper ANC, less fatigue.",
    price: 320,
    oldPrice: 320,
    tag: "",
    inStock: true,
    image: null,
    icon: "earbuds",
  },
  {
    id: "braided-cable-30cm",
    slug: "/shop/braided-cable-30cm",
    category: "Accessories",
    name: "Braided USB-C Cable 30cm",
    note: "Short cable sized for a case, 60W rated.",
    price: 260,
    oldPrice: 260,
    tag: "",
    inStock: true,
    image: null,
    icon: "hub",
  },
];

export const shopCategories = ["All", "Audio", "Power", "Wearables", "Desk", "Accessories"];
