/*
 * Plain, serializable shapes the UI works with. Data functions in src/lib/data
 * map Mongoose documents to these (string IDs, no ObjectIds or Dates).
 */

export type CategoryItem = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  icon: string;
};

export type BrandItem = {
  id: string;
  name: string;
  slug: string;
  featured: boolean;
};

export type CardProduct = {
  id: string;
  slug: string;
  name: string;
  /** Lowest current price (sale price if on sale). */
  price: number;
  /** Regular price, only set when on sale. */
  oldPrice?: number;
  spec: string;
  isNew: boolean;
  inStock: boolean;
  image: { src: string; position?: string } | null;
};

/** A product as the shop page filters and sorts it. */
export type ListingItem = {
  card: CardProduct;
  categorySlug: string;
  /** null = no brand ("Other brands"). */
  brandSlug: string | null;
  tags: string[];
  soldCount: number;
  /** Milliseconds since epoch. */
  createdAt: number;
};

export type ProductDetailImage = { src: string; alt: string; position?: string };

export type ProductDetailVariant = {
  id: string;
  name: string;
  colorHex?: string;
  sku: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: ProductDetailImage[];
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string };
  shortSpec: string;
  description: string;
  keyFeatures: string[];
  specGroups: { title: string; items: { label: string; value: string }[] }[];
  images: ProductDetailImage[];
  variants: ProductDetailVariant[];
  /** ISO date string. */
  offerEndsAt?: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  badge?: string;
  headline: string[];
  description: string;
  descriptionLong?: string;
  price?: number;
  oldPrice?: number;
  cta: { label: string; href: string };
  image: { src: string; alt: string; position?: string };
};

export type PromoTile = { href: string; src: string; alt: string };

export type SaleBanner = {
  badge: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  /** ISO date string. */
  endsAt?: string;
  image: { src: string; alt: string; position?: string };
};

export type SiteSettings = {
  phone: string;
  email: string;
  hours: string;
  facebookUrl: string;
  /** facebookUrl without the protocol, for display: "facebook.com/ModzTech". */
  facebookLabel: string;
  messengerUrl: string;
  delivery: {
    insideDhaka: { fee?: number; time?: string };
    outsideDhaka: { fee?: number; time?: string };
  };
  heroSlides: HeroSlide[];
  promoTiles: PromoTile[];
  saleBanner: SaleBanner | null;
};
