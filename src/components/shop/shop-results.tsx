import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { buttonVariants } from "@/components/ui/button";
import { getBrands, getCategories } from "@/lib/data/catalog";
import { getListingItems } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import {
  OTHER_BRAND,
  PAGE_SIZE,
  type ShopFilters,
  TAG_LABELS,
  applyFilters,
  buildShopHref,
  countActiveFilters,
  parseFilters,
} from "@/lib/shop-filters";
import { cn } from "@/lib/utils";
import { FilterSheet, FilterSidebar } from "./filter-panel";
import { SortSelect } from "./sort-select";

type ShopResultsProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  /** Set on /category/[slug]. */
  fixedCategory?: string;
};

const chipClass = (selected: boolean) =>
  cn(
    "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-label transition-colors duration-150",
    selected
      ? "border-brand-bright bg-brand-tint font-semibold text-brand-bright"
      : "border-control bg-surface font-medium text-ink hover:bg-brand-tint",
  );

const appliedChips = (filters: ShopFilters, brandNames: Map<string, string>) => {
  const chips: { label: string; href: string }[] = [];
  const reset = { ...filters, page: 1 };

  for (const brand of filters.brands) {
    chips.push({
      label: brand === OTHER_BRAND ? "Other brands" : (brandNames.get(brand) ?? brand),
      href: buildShopHref({ ...reset, brands: filters.brands.filter((item) => item !== brand) }),
    });
  }
  if (filters.min !== undefined || filters.max !== undefined) {
    const label =
      filters.min !== undefined && filters.max !== undefined
        ? `${formatPrice(filters.min)}–${formatPrice(filters.max)}`
        : filters.min !== undefined
          ? `From ${formatPrice(filters.min)}`
          : `Up to ${formatPrice(filters.max ?? 0)}`;
    chips.push({ label, href: buildShopHref({ ...reset, min: undefined, max: undefined }) });
  }
  if (filters.inStock) chips.push({ label: "In stock", href: buildShopHref({ ...reset, inStock: false }) });
  if (filters.onSale) chips.push({ label: "On sale", href: buildShopHref({ ...reset, onSale: false }) });
  if (filters.tag) {
    chips.push({ label: TAG_LABELS[filters.tag] ?? filters.tag, href: buildShopHref({ ...reset, tag: undefined }) });
  }
  return chips;
};

const pageNumbers = (page: number, pageCount: number) => {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, index) => index + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pageCount));
  return [...pages].sort((a, b) => a - b);
};

export const ShopResults = async ({ searchParams, fixedCategory }: ShopResultsProps) => {
  const filters = parseFilters(await searchParams, fixedCategory);
  const [items, categories, brands] = await Promise.all([getListingItems(), getCategories(), getBrands()]);
  const { results, total, page, pageCount, categoryCounts } = applyFilters(items, { ...filters });
  const current = { ...filters, page };

  const brandNames = new Map(brands.map((brand) => [brand.slug, brand.name]));
  const chips = appliedChips(current, brandNames);
  const clearHref = buildShopHref({
    ...current,
    brands: [],
    min: undefined,
    max: undefined,
    inStock: false,
    onSale: false,
    tag: undefined,
    page: 1,
  });

  const categoryOptions = categories.map((category) => ({
    slug: category.slug,
    name: category.name,
    count: categoryCounts.get(category.slug) ?? 0,
  }));
  const brandOptions = brands.map((brand) => ({ slug: brand.slug, name: brand.name }));

  // Phones show everything up to this page ("Load more"); desktop shows only this page.
  const shown = results.slice(0, page * PAGE_SIZE);
  const firstOnPage = (page - 1) * PAGE_SIZE;
  const lastOnPage = Math.min(page * PAGE_SIZE, total);

  const chipList =
    chips.length > 0 ? (
      <>
        {chips.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            scroll={false}
            aria-label={`Remove filter: ${chip.label}`}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-brand-tint py-0 pr-2 pl-3 text-[13px] leading-4.5 text-ink hover:bg-brand-tint/70"
          >
            {chip.label}
            <X aria-hidden="true" strokeWidth={1.5} className="size-4 text-ink-muted" />
          </Link>
        ))}
        <Link
          href={clearHref}
          scroll={false}
          className="inline-flex h-8 items-center rounded-sm px-1 text-[13px] font-semibold text-brand-bright hover:text-brand"
        >
          Clear all
        </Link>
      </>
    ) : null;

  return (
    <>
      <p className="px-4 pt-1 text-label text-ink-muted lg:hidden">
        {total} {total === 1 ? "product" : "products"}
      </p>

      {/* Phones: category chips */}
      <nav aria-label="Categories" className="flex gap-2 overflow-x-auto p-4 scrollbar-none lg:hidden">
        <Link
          href={buildShopHref({ ...current, categories: [], page: 1 })}
          aria-current={current.categories.length === 0 ? "page" : undefined}
          className={chipClass(current.categories.length === 0)}
        >
          All
        </Link>
        {categories.map((category) => {
          const selected = current.categories.length === 1 && current.categories[0] === category.slug;
          return (
            <Link
              key={category.slug}
              href={buildShopHref({ ...current, categories: [category.slug], page: 1 })}
              aria-current={selected ? "page" : undefined}
              className={chipClass(selected)}
            >
              {category.shortName}
            </Link>
          );
        })}
      </nav>

      {/* Phones: filter / sort bar (sits under the sticky header) */}
      <div className="sticky top-31.25 z-30 grid grid-cols-2 border-y border-border bg-surface lg:hidden">
        <FilterSheet
          filters={current}
          categories={categoryOptions}
          brands={brandOptions}
          activeCount={countActiveFilters(current)}
        />
        <SortSelect filters={current} variant="bar" />
      </div>
      {chipList && <div className="flex flex-wrap items-center gap-2 px-4 pt-3 lg:hidden">{chipList}</div>}

      <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <div className="hidden lg:block lg:self-stretch">
          <FilterSidebar filters={current} categories={categoryOptions} brands={brandOptions} />
        </div>

        <div className="flex flex-col gap-4">
          {/* Desktop: results bar */}
          <div className="hidden flex-wrap items-center gap-3 lg:flex">
            <span className="text-label text-ink-muted">
              {total === 0
                ? "No products"
                : `Showing ${firstOnPage + 1}–${lastOnPage} of ${total} ${total === 1 ? "product" : "products"}`}
            </span>
            {chipList}
            <div className="ml-auto">
              <SortSelect filters={current} variant="inline" />
            </div>
          </div>

          {total === 0 ? (
            <div className="mx-4 flex flex-col items-center gap-3 rounded-lg border border-dashed border-control bg-surface px-4 py-10 text-center lg:mx-0">
              <p className="text-panel-title font-heading font-bold tracking-[-0.02em] text-ink">
                No products match these filters.
              </p>
              <p className="text-ink-muted">Try removing a filter or two.</p>
              <Link href={clearHref} className={buttonVariants({ variant: "outline" })}>
                Clear all filters
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 px-4 pt-4 lg:grid-cols-4 lg:gap-5 lg:px-0 lg:pt-0">
              {shown.map((item, index) => (
                <li key={item.card.id} className={cn("flex", index < firstOnPage && "lg:hidden")}>
                  <ProductCard
                    product={item.card}
                    cta="cart"
                    showSpec={false}
                    eager={index - firstOnPage < 4 && index >= firstOnPage}
                    className="w-full"
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Phones: load more */}
          {total > 0 && (
            <div className="flex flex-col items-center gap-2 px-4 pt-4 pb-8 lg:hidden">
              <span className="text-small text-ink-muted">
                Showing {Math.min(page * PAGE_SIZE, total)} of {total}
              </span>
              {page < pageCount && (
                <Link
                  href={buildShopHref({ ...current, page: page + 1 })}
                  scroll={false}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full text-label")}
                >
                  Load more
                </Link>
              )}
            </div>
          )}

          {/* Desktop: pagination */}
          {pageCount > 1 && (
            <nav aria-label="Pages" className="hidden justify-center gap-2 pt-4 lg:flex">
              {page > 1 ? (
                <Link
                  href={buildShopHref({ ...current, page: page - 1 })}
                  aria-label="Previous page"
                  className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "size-10")}
                >
                  <ChevronLeft aria-hidden="true" strokeWidth={1.5} />
                </Link>
              ) : null}
              {pageNumbers(page, pageCount).map((number) => (
                <Link
                  key={number}
                  href={buildShopHref({ ...current, page: number })}
                  aria-current={number === page ? "page" : undefined}
                  className={cn(
                    buttonVariants({ variant: number === page ? "default" : "outline", size: "icon-sm" }),
                    "size-10 font-heading text-label",
                  )}
                >
                  {number}
                </Link>
              ))}
              {page < pageCount ? (
                <Link
                  href={buildShopHref({ ...current, page: page + 1 })}
                  aria-label="Next page"
                  className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "size-10")}
                >
                  <ChevronRight aria-hidden="true" strokeWidth={1.5} />
                </Link>
              ) : null}
            </nav>
          )}
        </div>
      </div>
    </>
  );
};

/** Shown while results load (filters live in the URL, so this part renders per request). */
export const ShopResultsSkeleton = () => (
  <div aria-hidden="true" className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-8">
    <div className="hidden h-120 rounded-lg border border-border bg-surface lg:block" />
    <ul className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4 lg:gap-5 lg:p-0">
      {Array.from({ length: 8 }, (_, index) => (
        <li key={index} className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
          <div className="aspect-square animate-pulse bg-media-frame" />
          <div className="flex flex-col gap-2 p-3">
            <div className="h-4 w-4/5 animate-pulse rounded-sm bg-media-frame" />
            <div className="h-5 w-1/3 animate-pulse rounded-sm bg-media-frame" />
            <div className="mt-2 h-10 animate-pulse rounded-md bg-media-frame" />
          </div>
        </li>
      ))}
    </ul>
  </div>
);
