/*
 * Home hero slides.
 * TEMPORARY: hero content moves to the admin Settings page (stored in MongoDB,
 * images on Cloudinary) in the admin stage. Images are the placeholder posts
 * from design/assets/product-posts.
 */
export type HeroSlide = {
  id: string;
  /** Small uppercase label above the headline. */
  eyebrow: string;
  /** Optional orange pill next to the eyebrow, e.g. "Launch offer". */
  badge?: string;
  /** Each entry is one line of the headline. */
  headline: string[];
  /** Short line for phones. */
  description: string;
  /** Longer line for desktop; falls back to `description`. */
  descriptionLong?: string;
  /** When set, shows "Now ৳price, was ৳oldPrice." after the description. */
  price?: number;
  oldPrice?: number;
  cta: { label: string; href: string };
  image: { src: string; alt: string; position?: string };
};

export const heroSlides: HeroSlide[] = [
  {
    id: "hoco-eq34-plus",
    eyebrow: "Hoco EQ34 Plus",
    badge: "Launch offer",
    headline: ["Premium sound.", "Budget price."],
    description: "ANC + ENC earbuds.",
    descriptionLong: "ANC + ENC earbuds with up to 32 hours of playtime.",
    price: 729,
    oldPrice: 800,
    cta: { label: "Order now", href: "/product/hoco-eq34-plus" },
    image: {
      src: "/sample/post-hoco-eq34-plus.webp",
      alt: "Hoco EQ34 Plus earbuds and case",
      position: "center 55%",
    },
  },
  {
    id: "y80-ultra-watch",
    eyebrow: "Y80 Ultra smart watch",
    headline: ["One smart watch.", "Eight strap styles."],
    description: "Silicone, sport, steel and braided straps.",
    descriptionLong: "Silicone, sport, steel and braided straps in one box.",
    cta: { label: "Shop watches", href: "/category/smart-watches" },
    image: {
      src: "/sample/post-y80-ultra-watch.webp",
      alt: "Y80 Ultra smart watch with eight straps",
      position: "center 58%",
    },
  },
  {
    id: "anker-45w-charger",
    eyebrow: "Anker 45W charger",
    headline: ["Power without", "the wait."],
    description: "45W USB-C fast charging.",
    descriptionLong: "45W USB-C fast charging for iPhone, Galaxy, iPad and MacBook.",
    cta: { label: "Shop chargers", href: "/category/chargers" },
    image: {
      src: "/sample/post-anker-45w-charger.webp",
      alt: "Anker 45W USB-C charger",
      position: "center 75%",
    },
  },
];
