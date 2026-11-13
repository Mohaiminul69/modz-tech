"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Banknote, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { CartLine } from "@/app/cart/actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { MiniProductCard } from "@/components/product/mini-product-card";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { buttonVariants } from "@/components/ui/button";
import { MAX_LINE_QUANTITY, removeFromCart, setCartQuantity } from "@/lib/cart/store";
import { type CartRow, cartTotals, useCartLines } from "@/lib/cart/use-cart-lines";
import { formatPrice } from "@/lib/format";
import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

type CartViewProps = {
  /** Best sellers, for the empty state and "Goes well with". */
  popular: CardProduct[];
};

const itemsLabel = (count: number) => `${count} ${count === 1 ? "item" : "items"}`;

const CodNote = ({ className }: { className?: string }) => (
  <p className={cn("flex items-center gap-2.5 rounded-md bg-brand-tint p-3 text-label text-ink lg:px-4 lg:py-3.5", className)}>
    <Banknote aria-hidden="true" strokeWidth={1.5} className="size-5.5 shrink-0 text-brand-bright" />
    Pay cash when your order arrives. No advance payment.
  </p>
);

const LineImage = ({ line }: { line: CartLine }) => (
  <span className="relative size-22 shrink-0 overflow-hidden rounded-md bg-media-frame">
    {line.image && (
      <Image
        src={line.image.src}
        alt=""
        fill
        sizes="88px"
        className="object-cover"
        style={{ objectPosition: line.image.position ?? "center" }}
      />
    )}
  </span>
);

const StockNote = ({ line, quantity }: { line: CartLine; quantity: number }) => {
  if (line.stock === 0) return <span className="text-small font-semibold text-danger lg:text-small-lg">Out of stock</span>;
  if (quantity > line.stock) {
    return <span className="text-small font-semibold text-danger lg:text-small-lg">Only {line.stock} left</span>;
  }
  return <span className="hidden text-small-lg font-semibold text-success lg:inline">✓ In stock</span>;
};

const EmptyCart = ({ popular }: { popular: CardProduct[] }) => (
  <div className="flex flex-col">
    <section className="flex flex-col items-center gap-3 px-6 pt-14 pb-10 text-center">
      <span className="flex size-28 items-center justify-center rounded-full bg-brand-tint">
        <ShoppingCart aria-hidden="true" strokeWidth={1.5} className="size-12 text-brand-bright" />
      </span>
      <h1 className="mt-3 text-[24px] leading-7.5 text-ink">Your cart is empty.</h1>
      <p className="max-w-75 text-ink-muted">Find something you&apos;ll love. Cash on delivery all over Bangladesh.</p>
      <Link href="/shop" className={cn(buttonVariants(), "mt-2 h-12 px-8")}>
        Start shopping
      </Link>
    </section>
    {popular.length > 0 && (
      <section aria-labelledby="popular-title" className="flex flex-col gap-3 pb-8">
        <div className="flex items-baseline justify-between px-4 lg:px-0">
          <h2 id="popular-title" className="text-panel-title text-ink">
            Popular right now
          </h2>
          <Link href="/shop?sort=best-selling" className="rounded-sm text-label font-semibold text-brand-bright hover:text-brand">
            Show all
          </Link>
        </div>
        <ul className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none lg:grid lg:grid-cols-4 lg:gap-5 lg:px-0">
          {popular.slice(0, 4).map((product) => (
            <li key={product.id} className="flex w-40 shrink-0 lg:w-auto">
              <MiniProductCard product={product} className="w-full" />
            </li>
          ))}
        </ul>
      </section>
    )}
  </div>
);

export const CartView = ({ popular }: CartViewProps) => {
  const { items, rows } = useCartLines();

  // Server render / first paint: we can't read the browser cart yet.
  if (items === null || rows === null) {
    return (
      <div aria-busy="true" className="flex flex-col gap-3 px-4 py-6 lg:px-0">
        <span className="sr-only">Loading your cart…</span>
        {[0, 1].map((index) => (
          <div key={index} className="h-28 animate-pulse rounded-lg border border-border bg-surface" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return <EmptyCart popular={popular} />;

  const { units, subtotal, savings } = cartTotals(rows);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const inCart = new Set(items.map((item) => item.productId));
  const suggestions = popular.filter((product) => !inCart.has(product.id)).slice(0, 4);

  const remove = (row: CartRow) => {
    removeFromCart(row.item.variantId);
    toast(`Removed ${row.line.name}.`);
  };

  return (
    <>
      <div className="flex flex-col gap-1 px-4 pt-4 pb-2 lg:gap-1.5 lg:px-0 lg:pt-0 lg:pb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <h1 className="mt-1 text-page-title text-ink lg:mt-0 lg:text-page-title-lg">
          Your cart{" "}
          <span className="hidden font-sans text-lg font-normal tracking-normal text-ink-muted lg:inline">
            {itemsLabel(totalUnits)}
          </span>
        </h1>
        <p className="text-label text-ink-muted lg:hidden">{itemsLabel(totalUnits)}</p>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-8">
        <div className="flex flex-col gap-3 lg:gap-8">
          {/* Lines */}
          <section aria-label="Items in your cart" className="px-4 py-2 lg:px-0 lg:py-0">
            <div className="hidden grid-cols-[minmax(0,1fr)_120px_140px_120px_48px] gap-4 rounded-t-lg border border-b-0 border-border bg-media-frame px-5 py-3 text-[13px] leading-4.5 font-semibold text-ink-muted lg:grid">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
              <span />
            </div>
            <ul className="flex flex-col gap-3 lg:gap-0 lg:overflow-hidden lg:rounded-b-lg lg:border lg:border-border lg:bg-surface">
              {rows.map((row) => {
                const { item, line } = row;
                const max = Math.max(1, Math.min(line.stock, MAX_LINE_QUANTITY));
                const quantity = Math.min(item.quantity, Math.max(line.stock, 1));
                const href = `/product/${line.slug}`;
                const stepper = (
                  <QuantityStepper
                    value={quantity}
                    max={max}
                    onChange={(value) => setCartQuantity(item.variantId, value)}
                    size="sm"
                    label={`Quantity of ${line.name}`}
                  />
                );

                return (
                  <li
                    key={item.variantId}
                    className="rounded-lg border border-border bg-surface p-3 lg:rounded-none lg:border-0 lg:border-t lg:p-5 lg:first:border-t-0"
                  >
                    {/* Phones */}
                    <div className="flex gap-3 lg:hidden">
                      <LineImage line={line} />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <Link href={href} className="rounded-sm text-label text-ink hover:text-brand-bright">
                          {line.name}
                        </Link>
                        {line.variantName && <span className="text-small text-ink-muted">Colour: {line.variantName}</span>}
                        <div className="flex items-baseline gap-1.5 font-heading">
                          <span className="text-card-price font-bold tracking-[-0.01em] text-ink">{formatPrice(line.price)}</span>
                          {line.oldPrice && <s className="text-small text-ink-muted">{formatPrice(line.oldPrice)}</s>}
                        </div>
                        <StockNote line={line} quantity={item.quantity} />
                        <div className="mt-1 flex items-center justify-between">
                          {line.stock > 0 ? stepper : <span />}
                          <button
                            type="button"
                            onClick={() => remove(row)}
                            className="inline-flex h-10 items-center gap-1 rounded-sm px-1 text-label font-semibold text-danger"
                          >
                            <Trash2 aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop */}
                    <div className="hidden grid-cols-[minmax(0,1fr)_120px_140px_120px_48px] items-center gap-4 lg:grid">
                      <div className="flex min-w-0 items-center gap-4">
                        <LineImage line={line} />
                        <div className="flex min-w-0 flex-col gap-1">
                          <Link href={href} className="rounded-sm text-[15px] leading-5.5 text-ink hover:text-brand-bright">
                            {line.name}
                          </Link>
                          {line.variantName && <span className="text-small-lg text-ink-muted">Colour: {line.variantName}</span>}
                          <StockNote line={line} quantity={item.quantity} />
                        </div>
                      </div>
                      <div className="flex flex-col font-heading">
                        <span className="text-[17px] font-bold text-ink">{formatPrice(line.price)}</span>
                        {line.oldPrice && <s className="text-small-lg text-ink-muted">{formatPrice(line.oldPrice)}</s>}
                      </div>
                      <div>{line.stock > 0 ? stepper : null}</div>
                      <span className="text-right font-heading text-lg font-bold text-ink">
                        {line.stock > 0 ? formatPrice(line.price * quantity) : "–"}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${line.name}`}
                        onClick={() => remove(row)}
                        className="flex size-11 items-center justify-center rounded-md text-danger hover:bg-danger/10"
                      >
                        <Trash2 aria-hidden="true" strokeWidth={1.5} className="size-5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <Link
            href="/shop"
            className="hidden items-center gap-1.5 self-start rounded-sm text-body font-semibold text-brand-bright hover:text-brand lg:inline-flex"
          >
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
            Continue shopping
          </Link>

          {/* Summary on phones sits between the lines and the suggestions */}
          <div className="flex flex-col gap-3 p-4 lg:hidden">
            <Summary units={units} subtotal={subtotal} savings={savings} />
            <CodNote />
            <Link href="/shop" className="self-center rounded-sm p-2.5 text-label font-semibold text-brand-bright">
              Continue shopping
            </Link>
          </div>

          {suggestions.length > 0 && (
            <section aria-labelledby="suggestions-title" className="flex flex-col gap-3 pt-2 pb-6 lg:gap-4 lg:p-0">
              <h2 id="suggestions-title" className="px-4 text-panel-title text-ink lg:px-0 lg:text-section">
                Goes well with
              </h2>
              <ul className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none lg:grid lg:grid-cols-4 lg:gap-5 lg:px-0">
                {suggestions.map((product) => (
                  <li key={product.id} className="flex w-38 shrink-0 lg:w-auto">
                    <MiniProductCard product={product} className="w-full" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Desktop summary */}
        <aside className="sticky top-6 hidden flex-col gap-3 lg:flex">
          <Summary units={units} subtotal={subtotal} savings={savings} desktop />
          <CodNote />
        </aside>
      </div>

      {/* Phones: sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-surface px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgb(11_15_22/0.08)] lg:hidden">
        <div className="flex flex-col">
          <span className="text-small text-ink-muted">Total</span>
          <span className="font-heading text-section leading-6.5 font-bold tracking-[-0.02em] text-ink">
            {formatPrice(subtotal)}
          </span>
        </div>
        <CheckoutLink units={units} className="ml-auto h-12 flex-1" />
      </div>
    </>
  );
};

type SummaryProps = {
  units: number;
  subtotal: number;
  savings: number;
  desktop?: boolean;
};

// Disabled-looking (not a link) when nothing in the cart can be ordered.
const CheckoutLink = ({ units, className }: { units: number; className?: string }) =>
  units > 0 ? (
    <Link href="/checkout" className={cn(buttonVariants(), className)}>
      Checkout
    </Link>
  ) : (
    <span aria-disabled="true" className={cn(buttonVariants(), "pointer-events-none opacity-50", className)}>
      Checkout
    </span>
  );

const Summary = ({ units, subtotal, savings, desktop = false }: SummaryProps) => (
  <section
    aria-labelledby={desktop ? "summary-title-lg" : "summary-title"}
    className="flex flex-col gap-2.5 rounded-lg border border-border bg-surface p-4 shadow-card lg:gap-3 lg:p-6"
  >
    <h2 id={desktop ? "summary-title-lg" : "summary-title"} className="mb-1 text-panel-title text-ink lg:text-panel-title-lg">
      Order summary
    </h2>
    <dl className="flex flex-col gap-2.5 text-label lg:gap-3 lg:text-body">
      <div className="flex justify-between">
        <dt className="text-ink-muted">Subtotal ({itemsLabel(units)})</dt>
        <dd className="font-heading font-semibold text-ink">{formatPrice(subtotal)}</dd>
      </div>
      {savings > 0 && (
        <div className="flex justify-between">
          <dt className="text-ink-muted">You save</dt>
          <dd className="font-heading font-semibold text-offer-ink">{formatPrice(savings)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-ink-muted">Delivery</dt>
        <dd className="text-ink-muted">At checkout</dd>
      </div>
      <div className="h-px bg-border" />
      <div className="flex items-baseline justify-between">
        <dt className="text-body font-semibold text-ink lg:text-base">Total</dt>
        <dd className="font-heading text-section leading-6.5 font-bold tracking-[-0.02em] text-ink lg:text-[28px] lg:leading-8">
          {formatPrice(subtotal)}
        </dd>
      </div>
    </dl>
    {desktop && (
      <CheckoutLink units={units} className="mt-2 h-13 text-base" />
    )}
  </section>
);
