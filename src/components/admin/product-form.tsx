"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { deleteProduct, saveProduct } from "@/app/admin/actions/products";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type ProductInput, slugify } from "@/lib/admin/product-schema";
import { PRODUCT_TAGS, PRODUCT_TAG_LABELS, type ProductTag } from "@/lib/product-tags";
import { ImageUploader, type UploadedImage } from "./image-uploader";
import { useAdminAction } from "./use-admin-action";

type Option = { id: string; name: string };

type ProductFormProps = {
  product?: ProductInput;
  categories: Option[];
  brands: Option[];
};

type VariantState = {
  key: string;
  id?: string;
  name: string;
  colorHex: string;
  sku: string;
  price: string;
  salePrice: string;
  stock: string;
  images: UploadedImage[];
};

const NONE = "__none__";
const cardClass = "flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 lg:p-5";
const labelClass = "text-label font-semibold text-ink";
const hintClass = "text-small font-normal text-ink-muted";

/*
 * Specification text format (easy to type on a phone):
 *
 *   General
 *   Brand: Hoco
 *   Model: EQ34 Plus
 *
 *   Battery
 *   Total playtime: Up to 32 hours
 */
const specsToText = (groups: ProductInput["specGroups"]) =>
  groups.map((group) => [group.title, ...group.items.map((item) => `${item.label}: ${item.value}`)].join("\n")).join("\n\n");

const textToSpecs = (text: string): ProductInput["specGroups"] =>
  text
    .split(/\n\s*\n/)
    .map((block) => block.split("\n").map((line) => line.trim()).filter(Boolean))
    .filter((lines) => lines.length > 0)
    .map(([title, ...rows]) => ({
      title,
      items: rows.flatMap((row) => {
        const split = row.indexOf(":");
        if (split <= 0) return [];
        return [{ label: row.slice(0, split).trim(), value: row.slice(split + 1).trim() }];
      }).filter((item) => item.label && item.value),
    }));

let keyCounter = 0;
const newKey = () => `v${Date.now()}-${keyCounter++}`;

const toVariantState = (variant: ProductInput["variants"][number]): VariantState => ({
  key: variant.id ?? newKey(),
  id: variant.id,
  name: variant.name,
  colorHex: variant.colorHex ?? "",
  sku: variant.sku,
  price: String(variant.price),
  salePrice: variant.salePrice == null ? "" : String(variant.salePrice),
  stock: String(variant.stock),
  images: variant.images,
});

const emptyVariant = (): VariantState => ({
  key: newKey(),
  name: "",
  colorHex: "",
  sku: "",
  price: "",
  salePrice: "",
  stock: "0",
  images: [],
});

const toNumber = (value: string) => (value.trim() === "" ? Number.NaN : Number(value.replace(/[,\s৳]/g, "")));

export const ProductForm = ({ product, categories, brands }: ProductFormProps) => {
  const id = useId();
  const router = useRouter();
  const { pending, run } = useAdminAction();
  const editing = Boolean(product?.id);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [category, setCategory] = useState(product?.category ?? "");
  const [brand, setBrand] = useState(product?.brand || NONE);
  const [shortSpec, setShortSpec] = useState(product?.shortSpec ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [features, setFeatures] = useState((product?.keyFeatures ?? []).join("\n"));
  const [specs, setSpecs] = useState(specsToText(product?.specGroups ?? []));
  const [images, setImages] = useState<UploadedImage[]>(product?.images ?? []);
  const [tags, setTags] = useState<ProductTag[]>(product?.tags ?? []);
  const [active, setActive] = useState(product?.active ?? true);
  const [offerEndsAt, setOfferEndsAt] = useState(product?.offerEndsAt ?? "");
  const [variants, setVariants] = useState<VariantState[]>(
    product?.variants.length ? product.variants.map(toVariantState) : [emptyVariant()],
  );

  const updateVariant = (key: string, patch: Partial<VariantState>) =>
    setVariants((list) => list.map((variant) => (variant.key === key ? { ...variant, ...patch } : variant)));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const input: ProductInput = {
      id: product?.id,
      name,
      slug,
      brand: brand === NONE ? "" : brand,
      category,
      shortSpec,
      description,
      keyFeatures: features.split("\n").map((line) => line.trim()).filter(Boolean),
      specGroups: textToSpecs(specs),
      images,
      tags,
      active,
      offerEndsAt,
      variants: variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        colorHex: variant.colorHex,
        sku: variant.sku,
        price: toNumber(variant.price),
        salePrice: variant.salePrice.trim() === "" ? null : toNumber(variant.salePrice),
        stock: toNumber(variant.stock),
        images: variant.images,
      })),
    };
    run(
      () => saveProduct(input),
      (data) => {
        if (!editing && data) router.replace(`/admin/products/${data.id}`);
      },
    );
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <section className={cardClass} aria-labelledby={`${id}-basics`}>
        <h2 id={`${id}-basics`} className="text-panel-title text-ink">
          Basics
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-name`} className={labelClass}>
            Product name
          </label>
          <Input
            id={`${id}-name`}
            value={name}
            required
            onChange={(event) => {
              setName(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
            placeholder="e.g. Hoco EQ34 Plus ANC + ENC Earbuds"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-slug`} className={labelClass}>
            Web address <span className={hintClass}>modztech…/product/{slug || "…"}</span>
          </label>
          <Input
            id={`${id}-slug`}
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
          />
          {editing && <span className={hintClass}>Changing this breaks old links to the product.</span>}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-category`} className={labelClass}>
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id={`${id}-category`} className="h-11! w-full">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-surface">
                {categories.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="min-h-10">
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-brand`} className={labelClass}>
              Brand
            </label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger id={`${id}-brand`} className="h-11! w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-surface">
                <SelectItem value={NONE} className="min-h-10">
                  No brand / other
                </SelectItem>
                {brands.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="min-h-10">
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-short`} className={labelClass}>
            Short spec line <span className={hintClass}>(under the price on cards)</span>
          </label>
          <Input
            id={`${id}-short`}
            value={shortSpec}
            onChange={(event) => setShortSpec(event.target.value)}
            placeholder="e.g. 32h playtime · IPX5"
          />
        </div>
        <ImageUploader images={images} onChange={setImages} folder="products" />
      </section>

      <section className={cardClass} aria-labelledby={`${id}-variants`}>
        <div className="flex items-center justify-between gap-3">
          <h2 id={`${id}-variants`} className="text-panel-title text-ink">
            Variants, prices & stock
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={() => setVariants((list) => [...list, emptyVariant()])}>
            <Plus aria-hidden="true" strokeWidth={1.5} /> Add variant
          </Button>
        </div>
        <p className={hintClass}>
          One variant per colour (or model). Each has its own price, stock and SKU. Prices in taka, whole numbers.
        </p>
        <ul className="flex flex-col gap-3">
          {variants.map((variant, index) => (
            <li key={variant.key} className="flex flex-col gap-3 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-label font-semibold text-ink">Variant {index + 1}</span>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setVariants((list) => list.filter((item) => item.key !== variant.key))}
                    className="flex h-9 items-center gap-1 rounded-sm px-1 text-small font-semibold text-danger"
                  >
                    <Trash2 aria-hidden="true" strokeWidth={1.5} className="size-4" /> Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["name", "Name", "e.g. Black", "text"],
                    ["sku", "SKU", "e.g. HOCO-EQ34P-BLK", "text"],
                    ["colorHex", "Swatch colour (optional)", "#111111", "text"],
                    ["price", "Regular price (৳)", "800", "numeric"],
                    ["salePrice", "Sale price (৳, optional)", "729", "numeric"],
                    ["stock", "Stock", "20", "numeric"],
                  ] as const
                ).map(([field, label, placeholder, mode]) => (
                  <div key={field} className="flex flex-col gap-1.5">
                    <label htmlFor={`${id}-${variant.key}-${field}`} className={labelClass}>
                      {label}
                    </label>
                    <Input
                      id={`${id}-${variant.key}-${field}`}
                      value={variant[field]}
                      inputMode={mode === "numeric" ? "numeric" : undefined}
                      placeholder={placeholder}
                      onChange={(event) => updateVariant(variant.key, { [field]: event.target.value })}
                    />
                  </div>
                ))}
              </div>
              <ImageUploader
                images={variant.images}
                onChange={(next) => updateVariant(variant.key, { images: next })}
                folder="products"
                max={6}
                label="Variant photos (optional)"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className={cardClass} aria-labelledby={`${id}-details`}>
        <h2 id={`${id}-details`} className="text-panel-title text-ink">
          Details
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-features`} className={labelClass}>
            Key features <span className={hintClass}>(one per line)</span>
          </label>
          <Textarea id={`${id}-features`} rows={4} value={features} onChange={(event) => setFeatures(event.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-description`} className={labelClass}>
            Description <span className={hintClass}>(blank line = new paragraph; start a line with ## for a heading)</span>
          </label>
          <Textarea
            id={`${id}-description`}
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-specs`} className={labelClass}>
            Specification
          </label>
          <span className={hintClass}>
            A group title on its own line, then one &quot;Label: Value&quot; per line. Leave a blank line between groups.
          </span>
          <Textarea
            id={`${id}-specs`}
            rows={8}
            value={specs}
            onChange={(event) => setSpecs(event.target.value)}
            placeholder={"General\nBrand: Hoco\nModel: EQ34 Plus\n\nBattery\nTotal playtime: Up to 32 hours"}
            className="font-mono text-label"
          />
        </div>
      </section>

      <section className={cardClass} aria-labelledby={`${id}-show`}>
        <h2 id={`${id}-show`} className="text-panel-title text-ink">
          Where it shows
        </h2>
        <fieldset className="flex flex-col gap-2">
          <legend className={`${labelClass} pb-1`}>Home page sections</legend>
          {PRODUCT_TAGS.map((tag) => (
            <div key={tag} className="flex items-center gap-2.5">
              <Checkbox
                id={`${id}-tag-${tag}`}
                checked={tags.includes(tag)}
                onCheckedChange={() =>
                  setTags((list) => (list.includes(tag) ? list.filter((item) => item !== tag) : [...list, tag]))
                }
              />
              <label htmlFor={`${id}-tag-${tag}`} className="text-body text-ink">
                {PRODUCT_TAG_LABELS[tag]}
              </label>
            </div>
          ))}
        </fieldset>
        <div className="flex flex-col gap-1.5 sm:max-w-60">
          <label htmlFor={`${id}-offer`} className={labelClass}>
            Offer ends <span className={hintClass}>(optional, shown when on sale)</span>
          </label>
          <Input id={`${id}-offer`} type="date" value={offerEndsAt} onChange={(event) => setOfferEndsAt(event.target.value)} />
        </div>
        <div className="flex items-center gap-2.5">
          <Checkbox id={`${id}-active`} checked={active} onCheckedChange={(value) => setActive(value === true)} />
          <label htmlFor={`${id}-active`} className="text-body text-ink">
            Show on the shop
          </label>
        </div>
      </section>

      <div className="sticky bottom-0 z-30 -mx-4 flex flex-wrap items-center gap-2 border-t border-border bg-surface px-4 py-3 lg:mx-0 lg:rounded-lg lg:border">
        <Button type="submit" disabled={pending} className="min-w-36">
          {pending ? "Saving…" : editing ? "Save changes" : "Create product"}
        </Button>
        <Link href="/admin/products" className="px-2 text-label font-semibold text-ink-muted hover:text-ink">
          Cancel
        </Link>
        {editing && product?.slug && (
          <Link href={`/product/${product.slug}`} target="_blank" className="px-2 text-label font-semibold text-brand-bright">
            View on shop
          </Link>
        )}
        {editing && product?.id && (
          <Button
            type="button"
            variant="destructive"
            className="ml-auto"
            disabled={pending}
            onClick={() => {
              if (!window.confirm(`Delete "${product.name}" for good? To just hide it, untick "Show on the shop".`)) return;
              run(
                () => deleteProduct(product.id),
                () => router.replace("/admin/products"),
              );
            }}
          >
            <Trash2 aria-hidden="true" strokeWidth={1.5} /> Delete
          </Button>
        )}
      </div>
    </form>
  );
};
