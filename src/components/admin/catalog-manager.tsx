"use client";

import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { deleteBrand, moveCategory, saveBrand, saveCategory } from "@/app/admin/actions/catalog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/admin/product-schema";
import { cn } from "@/lib/utils";
import { useAdminAction } from "./use-admin-action";

type CategoryRow = { id: string; name: string; shortName: string; slug: string; icon: string; active: boolean; products: number };
type BrandRow = { id: string; name: string; slug: string; featured: boolean; active: boolean; products: number };

// Line icons available for category tiles (see components/home/category-grid.tsx).
const ICONS = [
  ["earbuds", "Earbuds"],
  ["earbud-covers", "Earbud cover"],
  ["speakers", "Speaker"],
  ["karaoke", "Karaoke mic"],
  ["microphones", "Microphone"],
  ["smart-watches", "Watch"],
  ["trackers", "Tracker"],
  ["adapters", "Adapter"],
  ["chargers", "Charger"],
  ["box", "Box (generic)"],
] as const;

const labelClass = "text-label font-semibold text-ink";
const rowClass = "flex flex-wrap items-center gap-2 p-3 lg:px-4";

const CategoryEditor = ({ initial, onDone }: { initial?: CategoryRow; onDone: () => void }) => {
  const id = useId();
  const { pending, run } = useAdminAction();
  const [values, setValues] = useState({
    name: initial?.name ?? "",
    shortName: initial?.shortName ?? "",
    slug: initial?.slug ?? "",
    icon: initial?.icon ?? "box",
    active: initial?.active ?? true,
  });

  return (
    <form
      className="flex flex-col gap-3 rounded-md border border-brand-bright/40 bg-brand-tint/40 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        run(() => saveCategory({ id: initial?.id, ...values }), onDone);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className={labelClass}>
            Name
          </label>
          <Input
            id={`${id}-name`}
            value={values.name}
            onChange={(event) =>
              setValues({
                ...values,
                name: event.target.value,
                slug: initial ? values.slug : slugify(event.target.value),
                shortName: initial || values.shortName.length > 0 ? values.shortName : event.target.value.slice(0, 20),
              })
            }
            placeholder="e.g. Earbud covers"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-short`} className={labelClass}>
            Short name <span className="font-normal text-ink-muted">(menus & tiles)</span>
          </label>
          <Input
            id={`${id}-short`}
            value={values.shortName}
            onChange={(event) => setValues({ ...values, shortName: event.target.value })}
            placeholder="e.g. Covers"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-slug`} className={labelClass}>
            Web address <span className="font-normal text-ink-muted">/category/{values.slug || "…"}</span>
          </label>
          <Input id={`${id}-slug`} value={values.slug} onChange={(event) => setValues({ ...values, slug: slugify(event.target.value) })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-icon`} className={labelClass}>
            Icon
          </label>
          <Select value={values.icon} onValueChange={(icon) => setValues({ ...values, icon })}>
            <SelectTrigger id={`${id}-icon`} className="h-11! w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-surface">
              {ICONS.map(([value, label]) => (
                <SelectItem key={value} value={value} className="min-h-10">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Checkbox id={`${id}-active`} checked={values.active} onCheckedChange={(value) => setValues({ ...values, active: value === true })} />
        <label htmlFor={`${id}-active`} className="text-body text-ink">
          Show on the shop
        </label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export const CategoryManager = ({ categories }: { categories: CategoryRow[] }) => {
  const { pending, run } = useAdminAction();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section aria-labelledby="categories-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="categories-title" className="text-section text-ink">
          Categories
        </h2>
        <Button type="button" size="sm" variant="outline" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" strokeWidth={1.5} /> Add category
        </Button>
      </div>
      {editing === "new" && <CategoryEditor onDone={() => setEditing(null)} />}
      <ul className="overflow-hidden rounded-lg border border-border bg-surface">
        {categories.map((category, index) => (
          <li key={category.id} className={cn(index > 0 && "border-t border-border")}>
            {editing === category.id ? (
              <div className="p-2">
                <CategoryEditor initial={category} onDone={() => setEditing(null)} />
              </div>
            ) : (
              <div className={cn(rowClass, !category.active && "opacity-60")}>
                <div className="flex flex-col">
                  <button
                    type="button"
                    aria-label={`Move ${category.name} up`}
                    disabled={pending || index === 0}
                    onClick={() => run(() => moveCategory(category.id, "up"))}
                    className="flex size-8 items-center justify-center rounded-sm text-ink-muted hover:text-ink disabled:opacity-30"
                  >
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${category.name} down`}
                    disabled={pending || index === categories.length - 1}
                    onClick={() => run(() => moveCategory(category.id, "down"))}
                    className="flex size-8 items-center justify-center rounded-sm text-ink-muted hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </button>
                </div>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-label font-semibold text-ink">
                    {category.name} {!category.active && <span className="font-normal text-ink-muted">(hidden)</span>}
                  </span>
                  <span className="text-small text-ink-muted">
                    /category/{category.slug} · {category.products} products
                  </span>
                </span>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(category.id)}>
                  <Pencil aria-hidden="true" strokeWidth={1.5} /> Edit
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

const BrandEditor = ({ initial, onDone }: { initial?: BrandRow; onDone: () => void }) => {
  const id = useId();
  const { pending, run } = useAdminAction();
  const [values, setValues] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    featured: initial?.featured ?? false,
    active: initial?.active ?? true,
  });

  return (
    <form
      className="flex flex-col gap-3 rounded-md border border-brand-bright/40 bg-brand-tint/40 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        run(() => saveBrand({ id: initial?.id, ...values }), onDone);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className={labelClass}>
            Name
          </label>
          <Input
            id={`${id}-name`}
            value={values.name}
            onChange={(event) =>
              setValues({ ...values, name: event.target.value, slug: initial ? values.slug : slugify(event.target.value) })
            }
            placeholder="e.g. Baseus"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-slug`} className={labelClass}>
            Slug
          </label>
          <Input id={`${id}-slug`} value={values.slug} onChange={(event) => setValues({ ...values, slug: slugify(event.target.value) })} />
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id={`${id}-featured`}
            checked={values.featured}
            onCheckedChange={(value) => setValues({ ...values, featured: value === true })}
          />
          <label htmlFor={`${id}-featured`} className="text-body text-ink">
            Show in &quot;Shop by brand&quot; on the home page
          </label>
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id={`${id}-active`} checked={values.active} onCheckedChange={(value) => setValues({ ...values, active: value === true })} />
          <label htmlFor={`${id}-active`} className="text-body text-ink">
            Active
          </label>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export const BrandManager = ({ brands }: { brands: BrandRow[] }) => {
  const { pending, run } = useAdminAction();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section aria-labelledby="brands-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="brands-title" className="text-section text-ink">
          Brands
        </h2>
        <Button type="button" size="sm" variant="outline" onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" strokeWidth={1.5} /> Add brand
        </Button>
      </div>
      {editing === "new" && <BrandEditor onDone={() => setEditing(null)} />}
      <ul className="overflow-hidden rounded-lg border border-border bg-surface">
        {brands.length === 0 && <li className="p-4 text-label text-ink-muted">No brands yet.</li>}
        {brands.map((brand, index) => (
          <li key={brand.id} className={cn(index > 0 && "border-t border-border")}>
            {editing === brand.id ? (
              <div className="p-2">
                <BrandEditor initial={brand} onDone={() => setEditing(null)} />
              </div>
            ) : (
              <div className={cn(rowClass, !brand.active && "opacity-60")}>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-label font-semibold text-ink">
                    {brand.name}
                    {brand.featured && <span className="ml-2 rounded-sm bg-brand-tint px-1.5 text-small text-brand-bright">Featured</span>}
                  </span>
                  <span className="text-small text-ink-muted">{brand.products} products</span>
                </span>
                <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(brand.id)}>
                  <Pencil aria-hidden="true" strokeWidth={1.5} /> Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={pending}
                  onClick={() => {
                    if (window.confirm(`Delete the brand "${brand.name}"?`)) run(() => deleteBrand(brand.id));
                  }}
                >
                  <Trash2 aria-hidden="true" strokeWidth={1.5} />
                  <span className="sr-only">Delete {brand.name}</span>
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
