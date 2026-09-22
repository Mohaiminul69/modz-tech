"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PiCheckBold } from "react-icons/pi";
import { shopProducts, shopCategories, type ShopProduct } from "@data/shopProducts";
import { siteConfig } from "@data/siteConfig";
import ShopProductCard from "@components/shop/ShopProductCard";

const PRICE_MIN = 300;
const PRICE_MAX = 5000;
const PRICE_STEP = 100;
const INITIAL_VISIBLE = 12;
const LOAD_MORE_STEP = 8;

const SORT_OPTIONS = [
  "Newest first",
  "Price: low to high",
  "Price: high to low",
  "Biggest discount",
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

const SORT_FNS: Partial<Record<SortOption, (a: ShopProduct, b: ShopProduct) => number>> = {
  "Price: low to high": (a, b) => a.price - b.price,
  "Price: high to low": (a, b) => b.price - a.price,
  "Biggest discount": (a, b) =>
    (b.oldPrice - b.price) / b.oldPrice - (a.oldPrice - a.price) / a.oldPrice,
};

const PROMO_ITEMS = [
  { title: "Cash on delivery", note: "Pay the courier when it arrives" },
  { title: "24–48 hr nationwide delivery", note: "Next day inside the city" },
  { title: "Order on WhatsApp", note: "We reply within the hour" },
];

const fmt = (n: number) => `৳${n.toLocaleString()}`;

const Shop = () => {
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [offerOnly, setOfferOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("Newest first");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const resetVisible = () => setVisible(INITIAL_VISIBLE);

  const categories = useMemo(
    () =>
      shopCategories.map((name) => ({
        name,
        count:
          name === "All"
            ? shopProducts.length
            : shopProducts.filter((p) => p.category === name).length,
      })),
    []
  );

  const filtered = useMemo(
    () =>
      shopProducts.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.price <= maxPrice &&
          (!offerOnly || p.oldPrice > p.price) &&
          (!inStockOnly || p.inStock)
      ),
    [category, maxPrice, offerOnly, inStockOnly]
  );

  const sorted = useMemo(() => {
    const fn = SORT_FNS[sort];
    return fn ? [...filtered].sort(fn) : filtered;
  }, [filtered, sort]);

  const visibleProducts = sorted.slice(0, visible);
  const hasMore = visibleProducts.length < sorted.length;
  const progress = Math.round((visibleProducts.length / Math.max(sorted.length, 1)) * 100);

  const chips: { label: string; clear: () => void }[] = [];
  if (category !== "All") chips.push({ label: category, clear: () => setCategory("All") });
  if (maxPrice < PRICE_MAX)
    chips.push({ label: `Under ${fmt(maxPrice)}`, clear: () => setMaxPrice(PRICE_MAX) });
  if (offerOnly) chips.push({ label: "On offer", clear: () => setOfferOnly(false) });
  if (inStockOnly) chips.push({ label: "In stock", clear: () => setInStockOnly(false) });

  const clearFilters = () => {
    setCategory("All");
    setMaxPrice(PRICE_MAX);
    setOfferOnly(false);
    setInStockOnly(false);
    resetVisible();
  };

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden px-[clamp(20px,4vw,64px)] pb-[clamp(28px,3vw,44px)] pt-[clamp(40px,5vw,72px)]">
        <div
          className="pointer-events-none absolute left-[22%] top-[-220px] h-[480px] w-[760px]"
          style={{
            background: "radial-gradient(ellipse at center, rgba(47,127,212,.18), transparent 68%)",
          }}
        />

        <div className="relative mx-auto max-w-[1680px]">
          <div className="mb-4.5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-snow/42">
            <Link href="/" className="text-snow/42 transition-colors hover:text-[#9ac8f5]">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#7fb0e4]">Shop</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1
                className="mb-4 font-heading text-[clamp(34px,4.4vw,60px)] font-bold leading-[1.02] tracking-[-0.035em]"
                style={{
                  background: "linear-gradient(180deg,#fff 30%,#a8b4c4 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Everything we stock.
              </h1>
              <p className="max-w-[460px] font-body text-[15px] leading-relaxed text-snow/60">
                Audio, power and everyday-carry pieces, all in stock and ready to ship today.
                Filter down to what you need.
              </p>
            </div>

            <div className="pb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-snow/45">
              {visibleProducts.length} of {sorted.length} products
            </div>
          </div>
        </div>
      </section>

      {/* Promo strip */}
      <div className="mx-auto flex max-w-[1680px] flex-wrap gap-3.5 px-[clamp(20px,4vw,64px)] pb-[clamp(28px,3vw,40px)]">
        {PROMO_ITEMS.map((item) => (
          <div
            key={item.title}
            className="flex flex-1 basis-55 items-center gap-3 rounded-2xl border border-white/9 bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))] px-5 py-3.75"
          >
            <span className="h-1.75 w-1.75 shrink-0 rounded-full bg-accent shadow-[0_0_10px_rgba(47,127,212,.8)]" />
            <div>
              <div className="font-body text-[13.5px] font-semibold text-snow">{item.title}</div>
              <div className="mt-0.5 font-body text-[12px] text-snow/50">{item.note}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar + results */}
      <section className="mx-auto flex max-w-[1680px] flex-wrap items-start gap-[clamp(20px,2.5vw,36px)] px-[clamp(20px,4vw,64px)] pb-[clamp(56px,6vw,96px)]">
        <aside className="sticky top-[92px] flex min-w-[min(100%,240px)] max-w-[300px] flex-1 basis-60 flex-col gap-3.5 max-[900px]:static max-[900px]:max-w-full">
          {/* Filter panel */}
          <div className="rounded-[20px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))] p-5.5">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-snow/55">
                Filters
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="font-body text-[12px] font-semibold text-[#7fb0e4] transition-colors hover:text-[#cfe3f8]"
              >
                Clear all
              </button>
            </div>

            <div className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/55">
              Category
            </div>
            <div className="mb-6 grid gap-0.5">
              {categories.map((c) => {
                const selected = category === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setCategory(c.name);
                      resetVisible();
                    }}
                    className={`flex min-h-11 w-full items-center justify-between gap-2.5 rounded-xl border px-3 py-2.5 text-left font-body text-[13px] transition-colors hover:border-[rgba(106,169,233,.45)] ${
                      selected
                        ? "border-[rgba(106,169,233,.5)] bg-[rgba(47,127,212,.16)] font-semibold text-white"
                        : "border-white/8 bg-transparent font-medium text-snow/72"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono text-[10px] text-snow/40">{c.count}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-3.5 flex items-center justify-between gap-2.5">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/55">
                Price
              </span>
              <span className="font-mono text-[10.5px] text-accent-tint">
                {maxPrice >= PRICE_MAX ? "Any" : `Up to ${fmt(maxPrice)}`}
              </span>
            </div>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                resetVisible();
              }}
              style={{ accentColor: "#4e9ae8" }}
              className="mb-2 w-full cursor-pointer"
            />
            <div className="mb-6 flex justify-between font-mono text-[10px] text-snow/40">
              <span>৳300</span>
              <span>৳5,000</span>
            </div>

            <div className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/55">
              Availability
            </div>
            <div className="grid gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setOfferOnly((v) => !v);
                  resetVisible();
                }}
                className="flex min-h-11 w-full items-center gap-2.75 text-left font-body text-[13px] text-snow"
              >
                <span
                  className={`flex h-4.25 w-4.25 shrink-0 items-center justify-center rounded-[5px] border ${
                    offerOnly ? "border-accent bg-accent" : "border-white/22 bg-white/4"
                  }`}
                >
                  {offerOnly && <PiCheckBold className="h-2.75 w-2.75 text-[#04060a]" />}
                </span>
                <span>On offer only</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInStockOnly((v) => !v);
                  resetVisible();
                }}
                className="flex min-h-11 w-full items-center gap-2.75 text-left font-body text-[13px] text-snow"
              >
                <span
                  className={`flex h-4.25 w-4.25 shrink-0 items-center justify-center rounded-[5px] border ${
                    inStockOnly ? "border-accent bg-accent" : "border-white/22 bg-white/4"
                  }`}
                >
                  {inStockOnly && <PiCheckBold className="h-2.75 w-2.75 text-[#04060a]" />}
                </span>
                <span>In stock only</span>
              </button>
            </div>
          </div>

          {/* WhatsApp panel */}
          <div
            className="rounded-[20px] border border-[rgba(106,169,233,.22)] px-5.5 py-5"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(47,127,212,.18), transparent 70%), rgba(255,255,255,.03)",
            }}
          >
            <div className="mb-1.75 font-heading text-[15.5px] font-semibold text-snow">
              Can&apos;t find it?
            </div>
            <p className="mb-4 font-body text-[12.5px] leading-relaxed text-snow/58">
              Tell us the model on WhatsApp and we&apos;ll source it for you.
            </p>
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-4.5 py-2.75 font-body text-[12.5px] font-bold text-white shadow-[0_8px_22px_rgba(47,127,212,.3)] transition-[filter] hover:brightness-[1.08]"
            >
              Message us
            </a>
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-[min(100%,300px)] flex-[3_1_520px]">
          <div className="mb-5.5 flex flex-wrap items-center justify-between gap-3.5 border-b border-white/7 pb-5">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(106,169,233,.35)] bg-[rgba(47,127,212,.12)] px-3.25 py-1.75 font-body text-[12px] font-semibold text-[#cfe3f8] transition-colors hover:bg-[rgba(47,127,212,.26)] hover:text-white"
                >
                  {chip.label}
                  <span className="text-[13px] opacity-70">×</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/45">
                Sort
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption);
                  resetVisible();
                }}
                className="cursor-pointer rounded-full border border-white/12 bg-white/4 px-3.5 py-2.25 font-body text-[12.5px] font-semibold text-snow outline-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-surface">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {visibleProducts.length > 0 ? (
            <div
              className="grid gap-[18px]"
              style={{ gridTemplateColumns: "repeat(auto-fit,minmax(215px,1fr))" }}
            >
              {visibleProducts.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/8 py-16 text-center">
              <p className="font-body text-[14px] text-snow/60">
                No products match those filters.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-white/16 px-5 py-2.5 font-body text-[13px] font-semibold text-snow transition-colors hover:bg-white/6"
              >
                Clear filters
              </button>
            </div>
          )}

          {sorted.length > 0 && (
            <div className="flex flex-col items-center gap-3.5 pt-10">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-snow/45">
                Showing {visibleProducts.length} of {sorted.length}
              </div>
              <div className="h-[3px] w-[min(240px,60%)] overflow-hidden rounded-full bg-white/9">
                <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
              </div>
              {hasMore && (
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + LOAD_MORE_STEP)}
                  className="mt-1.5 rounded-full border border-white/16 bg-white/4 px-7.5 py-3.5 font-body text-[13.5px] font-semibold text-snow transition-colors hover:bg-white/9"
                >
                  Load more products
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop;
