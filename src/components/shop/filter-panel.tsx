"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format";
import { OTHER_BRAND, type ShopFilters, buildShopHref } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

type Option = { slug: string; name: string; count?: number };

/** Cheapest/most expensive product price (rounded to `step`), for the price slider. */
export type PriceBounds = { min: number; max: number; step: number };

type FilterPanelProps = {
  filters: ShopFilters;
  categories: Option[];
  brands: Option[];
  priceBounds: PriceBounds;
};

type FieldsProps = FilterPanelProps & {
  layout: "sidebar" | "sheet";
  onChange: (next: ShopFilters) => void;
};

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const legendClass = "pb-2 font-heading text-body font-semibold tracking-normal text-ink lg:text-[15px] lg:leading-5";

const CheckRow = ({
  id,
  label,
  count,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  onCheckedChange: () => void;
}) => (
  <div className="flex min-h-10 items-center gap-3 lg:min-h-8.5 lg:gap-2.5">
    <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} className="lg:size-4.5" />
    <label htmlFor={id} className="flex flex-1 cursor-pointer items-center text-body lg:text-label">
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-small text-ink-muted">{count}</span>}
    </label>
  </div>
);

/*
 * Price range slider (shadcn Slider, two thumbs) between the cheapest and most
 * expensive product. A thumb at either end means "no limit" on that side.
 * Sidebar: applies when a thumb is released. Sheet: updates the draft (applied with "Show results").
 */
const PriceSlider = ({
  filters,
  onChange,
  layout,
  bounds,
}: Pick<FieldsProps, "filters" | "onChange" | "layout"> & { bounds: PriceBounds }) => {
  const clamp = (value: number) => Math.min(bounds.max, Math.max(bounds.min, value));
  const [range, setRange] = useState<[number, number]>([
    clamp(filters.min ?? bounds.min),
    clamp(filters.max ?? bounds.max),
  ]);

  const toFilters = ([low, high]: number[]): ShopFilters => ({
    ...filters,
    min: low <= bounds.min ? undefined : low,
    max: high >= bounds.max ? undefined : high,
  });

  if (bounds.max <= bounds.min) {
    return <p className="text-label text-ink-muted">All products are {formatPrice(bounds.min)}.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      <p aria-live="polite" className="flex justify-between font-heading text-label font-semibold text-ink">
        <span>{formatPrice(range[0])}</span>
        <span>
          {formatPrice(range[1])}
          {range[1] >= bounds.max ? "+" : ""}
        </span>
      </p>
      <Slider
        min={bounds.min}
        max={bounds.max}
        step={bounds.step}
        minStepsBetweenThumbs={1}
        value={range}
        thumbLabels={["Minimum price", "Maximum price"]}
        onValueChange={(value) => {
          setRange([value[0], value[1]]);
          if (layout === "sheet") onChange(toFilters(value));
        }}
        onValueCommit={(value) => {
          if (layout !== "sidebar") return;
          const next = toFilters(value);
          if (next.min !== filters.min || next.max !== filters.max) onChange(next);
        }}
      />
    </div>
  );
};

const FilterFields = ({ filters, categories, brands, priceBounds, layout, onChange }: FieldsProps) => {
  const id = useId();
  const sidebar = layout === "sidebar";
  const fieldsetClass = cn("flex flex-col", sidebar ? "gap-0.5 border-b border-border pb-4" : "gap-1");

  return (
    <>
      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Category</legend>
        {sidebar ? (
          categories.map((category) => (
            <CheckRow
              key={category.slug}
              id={`${id}-cat-${category.slug}`}
              label={category.name}
              count={category.count}
              checked={filters.categories.includes(category.slug)}
              onCheckedChange={() => onChange({ ...filters, categories: toggle(filters.categories, category.slug) })}
            />
          ))
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const selected = filters.categories.includes(category.slug);
              return (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ ...filters, categories: toggle(filters.categories, category.slug) })}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border px-3.5 text-label font-medium transition-colors duration-150",
                    selected
                      ? "border-brand-bright bg-brand-tint text-brand-bright"
                      : "border-control bg-surface text-ink",
                  )}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      <fieldset className={cn(fieldsetClass, "gap-2")}>
        <legend className={legendClass}>Price</legend>
        <PriceSlider
          // Reset the thumbs when the price range changes from outside (e.g. "Clear all", "Reset").
          key={`${filters.min}-${filters.max}`}
          filters={filters}
          onChange={onChange}
          layout={layout}
          bounds={priceBounds}
        />
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className={legendClass}>Brand</legend>
        {[...brands, { slug: OTHER_BRAND, name: "Other brands" }].map((brand) => (
          <CheckRow
            key={brand.slug}
            id={`${id}-brand-${brand.slug}`}
            label={brand.name}
            checked={filters.brands.includes(brand.slug)}
            onCheckedChange={() => onChange({ ...filters, brands: toggle(filters.brands, brand.slug) })}
          />
        ))}
      </fieldset>

      <fieldset className={cn(fieldsetClass, sidebar && "border-b-0 pb-0")}>
        <legend className={legendClass}>Availability</legend>
        <CheckRow
          id={`${id}-stock`}
          label="In stock only"
          checked={filters.inStock}
          onCheckedChange={() => onChange({ ...filters, inStock: !filters.inStock })}
        />
        <CheckRow
          id={`${id}-sale`}
          label="On sale"
          checked={filters.onSale}
          onCheckedChange={() => onChange({ ...filters, onSale: !filters.onSale })}
        />
      </fieldset>
    </>
  );
};

const cleared = (filters: ShopFilters): ShopFilters => ({
  ...filters,
  categories: [],
  brands: [],
  min: undefined,
  max: undefined,
  inStock: false,
  onSale: false,
  tag: undefined,
  page: 1,
});

/** Desktop: sticky sidebar, every change applies straight away. */
export const FilterSidebar = ({ filters, categories, brands, priceBounds }: FilterPanelProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const apply = (next: ShopFilters) =>
    startTransition(() => router.push(buildShopHref({ ...next, page: 1 }), { scroll: false }));

  return (
    <aside
      aria-label="Filters"
      aria-busy={pending}
      className={cn(
        "sticky top-6 flex flex-col gap-5 rounded-lg border border-border bg-surface p-5 transition-opacity duration-150",
        pending && "opacity-70",
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-panel-title text-ink">Filters</h2>
        <button
          type="button"
          onClick={() => apply(cleared(filters))}
          className="h-8 rounded-sm text-[13px] font-semibold text-brand-bright hover:text-brand"
        >
          Clear all
        </button>
      </div>
      <FilterFields filters={filters} categories={categories} brands={brands} priceBounds={priceBounds} layout="sidebar" onChange={apply} />
    </aside>
  );
};

/** Phones: bottom sheet; changes apply when "Show results" is tapped. */
export const FilterSheet = ({
  filters,
  categories,
  brands,
  priceBounds,
  activeCount,
}: FilterPanelProps & { activeCount: number }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(filters);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(filters);
        setOpen(next);
      }}
    >
      <SheetTrigger className="flex h-12 items-center justify-center gap-2 border-r border-border text-label font-semibold text-ink">
        <SlidersHorizontal aria-hidden="true" strokeWidth={1.5} className="size-5" />
        Filter
        {activeCount > 0 && (
          <span className="h-5 min-w-5 rounded-full bg-brand px-1 text-center font-heading text-[11px] leading-5 font-semibold text-on-brand">
            {activeCount}
            <span className="sr-only"> active</span>
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" showCloseButton={false} className="h-[90dvh] gap-0 rounded-t-2xl bg-surface p-0">
        <div aria-hidden="true" className="flex justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>
        <div className="flex items-center justify-between border-b border-border px-4 pt-2 pb-3">
          <SheetTitle className="font-heading text-panel-title-lg font-bold tracking-[-0.02em] text-ink">Filter</SheetTitle>
          <SheetDescription className="sr-only">Narrow the product list</SheetDescription>
          <SheetClose className="flex size-11 items-center justify-center rounded-md text-ink" aria-label="Close filters">
            <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
          </SheetClose>
        </div>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
          <FilterFields
            filters={draft}
            categories={categories}
            brands={brands}
            priceBounds={priceBounds}
            layout="sheet"
            onChange={setDraft}
          />
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-2 border-t border-border px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))]">
          <Button variant="outline" className="h-12" onClick={() => setDraft(cleared(draft))}>
            Reset
          </Button>
          <Button
            className="h-12"
            onClick={() => {
              setOpen(false);
              router.push(buildShopHref({ ...draft, page: 1 }), { scroll: false });
            }}
          >
            Show results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
