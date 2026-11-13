/*
 * Shop filters live in the URL, so filtered pages can be shared, bookmarked and
 * work without JavaScript. Shared by the server pages and the client filter panel.
 *
 *   /shop?category=earbuds,speakers&brand=hoco,other&min=500&max=2000&stock=1&sale=1&tag=exclusive&sort=price-asc&page=2
 *   /category/earbuds?brand=hoco      (one category uses the clean category URL)
 */
import type { ListingItem } from "./types";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "best-selling", label: "Best selling" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const TAG_LABELS: Record<string, string> = {
  exclusive: "Exclusive",
  "top-selling": "Top selling",
  new: "New arrivals",
};

/** "other" = products without a listed brand. */
export const OTHER_BRAND = "other";

export const PAGE_SIZE = 12;

export type ShopFilters = {
  categories: string[];
  brands: string[];
  min?: number;
  max?: number;
  inStock: boolean;
  onSale: boolean;
  tag?: string;
  sort: SortKey;
  page: number;
};

export const emptyFilters = (): ShopFilters => ({
  categories: [],
  brands: [],
  inStock: false,
  onSale: false,
  sort: "newest",
  page: 1,
});

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

const list = (value: string | string[] | undefined) =>
  (first(value) ?? "")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);

const wholeNumber = (value: string | string[] | undefined) => {
  const parsed = Number.parseInt((first(value) ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** `fixedCategory` is set on /category/[slug] pages. */
export const parseFilters = (params: RawParams, fixedCategory?: string): ShopFilters => {
  const sort = first(params.sort);
  const tag = first(params.tag);
  return {
    categories: fixedCategory ? [fixedCategory] : list(params.category),
    brands: list(params.brand),
    min: wholeNumber(params.min),
    max: wholeNumber(params.max),
    inStock: first(params.stock) === "1",
    onSale: first(params.sale) === "1",
    tag: tag && tag in TAG_LABELS ? tag : undefined,
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? (sort as SortKey) : "newest",
    page: Math.max(1, wholeNumber(params.page) ?? 1),
  };
};

export const buildShopHref = (filters: ShopFilters) => {
  const params = new URLSearchParams();
  let path = "/shop";

  if (filters.categories.length === 1) path = `/category/${filters.categories[0]}`;
  else if (filters.categories.length > 1) params.set("category", filters.categories.join(","));

  if (filters.brands.length > 0) params.set("brand", filters.brands.join(","));
  if (filters.min !== undefined) params.set("min", String(filters.min));
  if (filters.max !== undefined) params.set("max", String(filters.max));
  if (filters.inStock) params.set("stock", "1");
  if (filters.onSale) params.set("sale", "1");
  if (filters.tag) params.set("tag", filters.tag);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();
  return query ? `${path}?${query}` : path;
};

/** Number of filters the shopper has turned on (categories excluded: they have chips). */
export const countActiveFilters = (filters: ShopFilters) =>
  filters.brands.length +
  (filters.min !== undefined || filters.max !== undefined ? 1 : 0) +
  (filters.inStock ? 1 : 0) +
  (filters.onSale ? 1 : 0) +
  (filters.tag ? 1 : 0);

const matches = (item: ListingItem, filters: ShopFilters, ignore?: "category") => {
  const { card } = item;
  if (ignore !== "category" && filters.categories.length > 0 && !filters.categories.includes(item.categorySlug)) {
    return false;
  }
  if (filters.brands.length > 0) {
    const brand = item.brandSlug ?? OTHER_BRAND;
    if (!filters.brands.includes(brand)) return false;
  }
  if (filters.min !== undefined && card.price < filters.min) return false;
  if (filters.max !== undefined && card.price > filters.max) return false;
  if (filters.inStock && !card.inStock) return false;
  if (filters.onSale && card.oldPrice === undefined) return false;
  if (filters.tag && !item.tags.includes(filters.tag)) return false;
  return true;
};

const sorters: Record<SortKey, (a: ListingItem, b: ListingItem) => number> = {
  newest: (a, b) => b.createdAt - a.createdAt,
  "price-asc": (a, b) => a.card.price - b.card.price || b.createdAt - a.createdAt,
  "price-desc": (a, b) => b.card.price - a.card.price || b.createdAt - a.createdAt,
  "best-selling": (a, b) => b.soldCount - a.soldCount || b.createdAt - a.createdAt,
};

export const applyFilters = (items: ListingItem[], filters: ShopFilters) => {
  const results = items.filter((item) => matches(item, filters)).sort(sorters[filters.sort]);
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);

  // Category counts respect every other filter, so the numbers match what a click would show.
  const categoryCounts = new Map<string, number>();
  for (const item of items) {
    if (matches(item, filters, "category")) {
      categoryCounts.set(item.categorySlug, (categoryCounts.get(item.categorySlug) ?? 0) + 1);
    }
  }

  return { results, total: results.length, page, pageCount, categoryCounts };
};
