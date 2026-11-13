"use client";

import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SORT_OPTIONS, type ShopFilters, type SortKey, buildShopHref } from "@/lib/shop-filters";

type SortSelectProps = {
  filters: ShopFilters;
  /** "bar" = mobile filter bar half, "inline" = desktop "Sort by" select. */
  variant: "bar" | "inline";
};

export const SortSelect = ({ filters, variant }: SortSelectProps) => {
  const router = useRouter();
  const id = useId();
  const current = SORT_OPTIONS.find((option) => option.value === filters.sort) ?? SORT_OPTIONS[0];

  const select = (trigger: React.ReactNode) => (
    <Select
      value={filters.sort}
      onValueChange={(value) =>
        router.push(buildShopHref({ ...filters, sort: value as SortKey, page: 1 }), { scroll: false })
      }
    >
      {trigger}
      <SelectContent position="popper" align="end" className="bg-surface">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value} className="min-h-11 text-label">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (variant === "bar") {
    return select(
      <SelectTrigger
        aria-label={`Sort: ${current.label}`}
        className="h-12! w-full justify-center gap-2 rounded-none border-0 bg-transparent text-label font-semibold [&>svg:last-child]:hidden"
      >
        <ArrowUpDown aria-hidden="true" strokeWidth={1.5} className="size-5" />
        <span>Sort: {current.label}</span>
      </SelectTrigger>,
    );
  }

  return (
    <div className="flex items-center gap-2 text-label text-ink-muted">
      <span id={id}>Sort by</span>
      {select(
        <SelectTrigger aria-labelledby={id} className="min-w-44">
          <SelectValue />
        </SelectTrigger>,
      )}
    </div>
  );
};
