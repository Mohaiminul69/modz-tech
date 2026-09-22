"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PiHeadphones,
  PiBatteryChargingVertical,
  PiWatch,
  PiPlugCharging,
  PiUsb,
  PiSpeakerHigh,
  PiLaptop,
  PiDeviceMobile,
  PiCube,
} from "react-icons/pi";
import { useCart, type CartItem } from "@context/CartContext";
import { siteConfig } from "@data/siteConfig";
import type { ShopProductIcon } from "@data/shopProducts";
import {
  BUNDLE,
  DELIVERY_FLAT,
  FREE_DELIVERY_OVER,
  computeCartTotals,
  fmt,
} from "@utils/cartPricing";

const ICONS: Record<ShopProductIcon, typeof PiCube> = {
  earbuds: PiHeadphones,
  battery: PiBatteryChargingVertical,
  watch: PiWatch,
  charger: PiPlugCharging,
  hub: PiUsb,
  speaker: PiSpeakerHigh,
  laptop: PiLaptop,
  case: PiDeviceMobile,
};

const CartLine = ({ line }: { line: CartItem }) => {
  const { product, qty } = line;
  const { incrementItem, decrementItem, removeItem } = useCart();
  const Icon = ICONS[product.icon] || PiCube;
  const hasDiscount = product.oldPrice > product.price;
  const isBundleItem = product.id === BUNDLE.case;
  const tag = hasDiscount ? "On sale" : isBundleItem ? "Bundle" : null;

  return (
    <article
      className={`flex flex-wrap gap-4.5 rounded-[20px] border p-4.5 ${
        tag ? "border-[rgba(106,169,233,.3)]" : "border-white/8"
      }`}
      style={{
        background: tag
          ? "radial-gradient(ellipse at 0% 0%, rgba(47,127,212,.12), transparent 70%), rgba(255,255,255,.03)"
          : "linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))",
      }}
    >
      <div className="relative h-26 w-26 shrink-0 overflow-hidden rounded-2xl border border-white/9 bg-surface-media">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="104px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-8 w-8 text-accent-tint/60" strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex min-w-60 flex-1 flex-col gap-1.75">
        <div className="flex flex-wrap items-center gap-2.25">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-snow/50">
            {product.category}
          </span>
          {tag && (
            <span className="rounded-full bg-[rgba(47,127,212,.9)] px-2.25 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#04060a]">
              {tag}
            </span>
          )}
        </div>
        <h2 className="font-heading text-[17px] font-semibold tracking-[-0.012em] text-snow">
          {product.name}
        </h2>
        <p className="font-body text-[12.5px] leading-relaxed text-snow/55">{product.note}</p>

        <div className="mt-auto flex flex-wrap items-center gap-3.5 pt-2.5">
          <div className="flex items-center gap-1 rounded-full border border-white/14 bg-white/4 p-1.25">
            <button
              type="button"
              onClick={() => decrementItem(product.id)}
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white/5 font-body text-[16px] font-semibold leading-none text-snow transition-colors hover:bg-white/12"
            >
              −
            </button>
            <span className="min-w-7 text-center font-heading text-[14px] font-semibold text-snow">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => incrementItem(product.id)}
              className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white/5 font-body text-[16px] font-semibold leading-none text-snow transition-colors hover:bg-white/12"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="font-body text-[12.5px] font-semibold text-snow/50 transition-colors hover:text-snow"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="ml-auto flex shrink-0 flex-col items-end gap-1">
        <span className="font-heading text-[19px] font-semibold text-snow">
          {fmt(product.price * qty)}
        </span>
        {hasDiscount && (
          <span className="font-body text-[12px] text-snow/42 line-through">
            {fmt(product.oldPrice * qty)}
          </span>
        )}
        <span className="font-mono text-[9.5px] tracking-[0.12em] text-snow/45">
          {fmt(product.price)} each
        </span>
      </div>
    </article>
  );
};

const Cart = () => {
  const { items, count, addItem } = useCart();

  const { listTotal, offerSavings, bundleDiscount, deliveryCost, total, hasBuds, hasCase } =
    computeCartTotals(items);

  const intro =
    count === 0
      ? "Nothing here yet. Add something from the shop and it will show up on this page."
      : `${count} item${count === 1 ? "" : "s"} reserved for you. Nothing is charged now — you pay the courier at your door.`;

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-2 px-[clamp(20px,4vw,64px)] pt-[clamp(24px,3vw,40px)] font-mono text-[10.5px] uppercase tracking-[0.16em] text-snow/45">
        <Link href="/" className="text-snow/45 transition-colors hover:text-[#9ac8f5]">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#7fb0e4]">Cart</span>
      </div>

      {/* Page head */}
      <section className="px-[clamp(20px,4vw,64px)] pb-[clamp(28px,3vw,40px)] pt-[clamp(20px,2.5vw,32px)]">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-end justify-between gap-5">
          <div>
            <h1
              className="mb-3.5 font-heading text-[clamp(32px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.034em]"
              style={{
                background: "linear-gradient(180deg,#ffffff 30%,#a8b4c4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Your cart.
            </h1>
            <p className="max-w-[460px] font-body text-[15px] leading-relaxed text-snow/60">
              {intro}
            </p>
          </div>
          <Link
            href="/shop"
            className="border-b border-white/20 pb-1 font-body text-[13px] font-semibold text-snow/70 transition-colors hover:text-snow"
          >
            Continue shopping →
          </Link>
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto flex max-w-[1680px] flex-wrap items-start gap-[clamp(20px,2.5vw,36px)] px-[clamp(20px,4vw,64px)] pb-[clamp(56px,6vw,96px)]">
        <div className="flex min-w-[min(100%,300px)] flex-[2_1_480px] flex-col gap-3.5">
          {count === 0 ? (
            <div className="flex flex-col items-start gap-4 rounded-[20px] border border-dashed border-white/16 bg-white/2 px-7 py-11">
              <div>
                <h2 className="mb-2 font-heading text-[21px] font-semibold tracking-[-0.016em] text-snow">
                  Your cart is empty.
                </h2>
                <p className="max-w-90 font-body text-[13.5px] leading-relaxed text-snow/58">
                  Nothing reserved yet. Browse the shop and add something — you still pay only
                  when it reaches your door.
                </p>
              </div>
              <Link
                href="/shop"
                className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-6 py-3.25 font-body text-[13.5px] font-bold text-white shadow-[0_10px_28px_rgba(47,127,212,.3)] transition-[filter] hover:brightness-[1.08]"
              >
                Browse the shop →
              </Link>
            </div>
          ) : (
            <>
              {items.map((line) => (
                <CartLine key={line.id} line={line} />
              ))}

              <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-dashed border-white/16 bg-white/2 p-4.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/55">
                  Promo code
                </span>
                <input
                  placeholder="Enter code"
                  className="min-w-40 flex-1 rounded-full border border-white/14 bg-white/4 px-4.5 py-3 font-body text-[13px] text-snow outline-none transition-colors focus:border-[rgba(106,169,233,.6)]"
                />
                <button
                  type="button"
                  className="rounded-full border border-[rgba(106,169,233,.4)] bg-[rgba(47,127,212,.14)] px-5.5 py-3 font-body text-[12.5px] font-semibold text-[#cfe3f8] transition-colors hover:bg-[rgba(47,127,212,.3)] hover:text-white"
                >
                  Apply
                </button>
              </div>

              {hasBuds && !hasCase && (
                <div
                  className="flex flex-wrap items-center gap-3.5 rounded-[20px] border border-[rgba(106,169,233,.25)] px-5 py-4.5"
                  style={{
                    background:
                      "radial-gradient(ellipse at 0% 0%, rgba(47,127,212,.16), transparent 70%), rgba(255,255,255,.03)",
                  }}
                >
                  <div className="min-w-60 flex-1">
                    <div className="mb-1.25 font-heading text-[15.5px] font-semibold text-snow">
                      Add a case and save {fmt(BUNDLE.discount)}
                    </div>
                    <p className="font-body text-[12.5px] leading-relaxed text-snow/58">
                      Silicone Case Cover pairs with the Airpods Pro 3 already in your cart.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addItem(BUNDLE.case, 1)}
                    className="rounded-full border border-[rgba(106,169,233,.4)] bg-[rgba(47,127,212,.14)] px-5 py-3 font-body text-[12.5px] font-semibold text-[#cfe3f8] transition-colors hover:bg-[rgba(47,127,212,.32)] hover:text-white"
                  >
                    Add for {fmt(390 - BUNDLE.discount)}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <aside className="flex min-w-[min(100%,280px)] max-w-[400px] flex-1 basis-75 flex-col gap-3.5 lg:sticky lg:top-24">
          {count > 0 && (
            <div
              className="rounded-[20px] border border-white/8 p-6"
              style={{
                backgroundImage:
                  "linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))",
              }}
            >
              <div className="mb-5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-snow/55">
                Order summary
              </div>

              <div className="grid gap-3.25 font-body text-[13.5px]">
                <div className="flex justify-between gap-3">
                  <span className="text-snow/68">Subtotal ({count} items)</span>
                  <span className="font-semibold text-snow">{fmt(listTotal)}</span>
                </div>
                {offerSavings > 0 && (
                  <div className="flex justify-between gap-3">
                    <span className="text-snow/68">Offer savings</span>
                    <span className="font-semibold text-[#8fc4fb]">−{fmt(offerSavings)}</span>
                  </div>
                )}
                {bundleDiscount > 0 && (
                  <div className="flex justify-between gap-3">
                    <span className="text-snow/68">Bundle discount</span>
                    <span className="font-semibold text-[#8fc4fb]">−{fmt(bundleDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between gap-3 border-t border-white/8 pt-3.25">
                  <span className="text-snow/68">Delivery</span>
                  <span className="font-semibold text-snow">
                    {deliveryCost === 0 ? "Free" : fmt(deliveryCost)}
                  </span>
                </div>
                <div className="-mt-1 font-body text-[12px] leading-relaxed text-snow/48">
                  {deliveryCost === 0
                    ? `Free nationwide delivery on orders over ${fmt(FREE_DELIVERY_OVER)}.`
                    : `Flat ${fmt(DELIVERY_FLAT)} nationwide. Free over ${fmt(FREE_DELIVERY_OVER)}.`}
                </div>
              </div>

              <div className="mt-5.5 flex items-baseline justify-between gap-3 border-t border-white/10 pt-5">
                <span className="font-heading text-[16px] font-semibold text-snow">Total</span>
                <span
                  className="font-heading text-[30px] font-bold tracking-[-0.02em]"
                  style={{
                    background: "linear-gradient(180deg,#8fc4fb 10%,#2a6fbf 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {fmt(total)}
                </span>
              </div>
              <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-snow/50">
                Payable on delivery
              </div>

              <div className="mt-5.5">
                <Link
                  href="/checkout"
                  className="bg-brand-gradient block w-full rounded-full px-6 py-3.75 text-center font-body text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(47,127,212,.35)] transition-[filter] hover:brightness-[1.08]"
                >
                  Proceed to checkout →
                </Link>
              </div>
            </div>
          )}

          <div className="grid gap-0.5 overflow-hidden rounded-[20px] border border-white/8 bg-white/6">
            {[
              "24–48 hr nationwide delivery",
              "Check the parcel before you pay",
              `Questions? WhatsApp ${siteConfig.whatsappDisplay}`,
            ].map((line) => (
              <div
                key={line}
                className="flex items-center gap-3 bg-surface px-4.5 py-3.5 font-body text-[12.5px] text-snow/70"
              >
                <span className="text-accent">•</span> {line}
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
};

export default Cart;
