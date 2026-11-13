"use client";

import Image from "next/image";
import { Banknote, MessageCircle, Share2, ShieldCheck, Truck } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { effectivePrice } from "@/lib/pricing";
import type { ProductDetail, ProductDetailImage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { QuantityStepper } from "./quantity-stepper";

type ProductViewProps = {
  product: ProductDetail;
  /** Pre-formatted on the server, e.g. "30 Nov". */
  offerEndsLabel?: string;
  messengerUrl: string;
};

const MAX_QUANTITY = 10;

const uniqueImages = (images: ProductDetailImage[]) => {
  const seen = new Set<string>();
  return images.filter((image) => (seen.has(image.src) ? false : (seen.add(image.src), true)));
};

/*
 * Gallery + buy box + mobile sticky order bar. One client island because the
 * selected colour changes the photos, price, stock and SKU together.
 */
export const ProductView = ({ product, offerEndsLabel, messengerUrl }: ProductViewProps) => {
  const ids = useId();
  const initialVariant = product.variants.find((variant) => variant.stock > 0) ?? product.variants[0];
  const [variantId, setVariantId] = useState(initialVariant.id);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const variant = product.variants.find((item) => item.id === variantId) ?? initialVariant;
  const images = uniqueImages([...variant.images, ...product.images]);
  const image = images[Math.min(imageIndex, images.length - 1)];
  const price = effectivePrice(variant);
  const onSale = price < variant.price;
  const inStock = variant.stock > 0;
  const maxQuantity = Math.max(1, Math.min(variant.stock, MAX_QUANTITY));
  const brandName = product.brand?.name;

  const selectVariant = (id: string) => {
    const next = product.variants.find((item) => item.id === id);
    setVariantId(id);
    setImageIndex(0);
    setQuantity((current) => Math.min(current, Math.max(1, Math.min(next?.stock ?? 1, MAX_QUANTITY))));
  };

  // TODO(cart stage): add to cart / go to checkout. Until then, point shoppers to Messenger.
  const orderSoon = () =>
    toast.info("Online ordering opens very soon.", {
      description: "Message us on Messenger and we'll take your order.",
      action: messengerUrl
        ? { label: "Message us", onClick: () => window.open(messengerUrl, "_blank", "noopener,noreferrer") }
        : undefined,
    });

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("Link copied.");
    } catch {
      // Share sheet dismissed: nothing to do.
    }
  };

  return (
    <>
      <section className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12">
        {/* Gallery */}
        <div
          className={cn(
            "flex flex-col gap-2 px-4 lg:px-0",
            images.length > 1 && "lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-4",
          )}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-media-frame lg:order-2">
            {image && (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                preload={imageIndex === 0}
                sizes="(min-width: 1200px) 488px, (min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                style={{ objectPosition: image.position ?? "center" }}
              />
            )}
            {onSale && inStock && (
              <span className="absolute top-3 left-3 rounded-sm bg-offer px-2.5 py-0.75 font-heading text-small font-semibold text-on-offer lg:top-4 lg:left-4 lg:px-3 lg:py-1 lg:text-[13px] lg:leading-4.5">
                Sale
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 lg:order-1 lg:flex lg:flex-col lg:gap-2.5">
              {images.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  aria-label={`Photo ${index + 1}`}
                  aria-pressed={index === imageIndex}
                  onClick={() => setImageIndex(index)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-md bg-media-frame lg:size-22",
                    index === imageIndex ? "border-2 border-brand-bright" : "border border-border",
                  )}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="88px"
                    className="object-cover"
                    style={{ objectPosition: item.position ?? "center" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy box */}
        <div className="flex flex-col gap-3.5 px-4 pt-5 pb-4 lg:gap-4.5 lg:px-0 lg:pt-0 lg:pb-0">
          <div className="flex flex-col gap-1.5 lg:gap-2">
            <div className="flex items-center justify-between">
              {brandName ? <span className="eyebrow text-brand-bright">{brandName}</span> : <span />}
              <button
                type="button"
                onClick={share}
                className="inline-flex h-9 items-center gap-1.5 rounded-sm px-1 text-label font-semibold text-brand-bright hover:text-brand"
              >
                <Share2 aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
                Share
              </button>
            </div>
            <h1 className="text-section text-ink lg:text-page-title-lg">{product.name}</h1>
            <p className="flex gap-3 text-small lg:gap-4 lg:text-small-lg">
              {inStock ? (
                <span className="font-semibold text-success">✓ In stock</span>
              ) : (
                <span className="font-semibold text-danger">Out of stock</span>
              )}
              <span className="text-ink-muted">SKU: {variant.sku}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-2 lg:items-center lg:gap-x-3.5 lg:border-y lg:border-border lg:py-4">
            <span className="font-heading text-price font-bold tracking-[-0.02em] text-ink lg:text-price-lg">
              {formatPrice(price)}
            </span>
            {onSale && (
              <>
                <s className="font-heading text-body text-ink-muted lg:text-[17px] lg:leading-5.5">
                  <span className="sr-only">was </span>
                  {formatPrice(variant.price)}
                </s>
                <span className="text-label font-semibold text-offer-ink lg:text-body">
                  Save {formatPrice(variant.price - price)}
                </span>
              </>
            )}
            {onSale && offerEndsLabel && (
              <div className="w-full lg:ml-auto lg:w-auto">
                <span className="inline-block rounded-full bg-offer px-3 py-1 font-heading text-small font-semibold text-on-offer lg:py-1.25">
                  Offer ends {offerEndsLabel}
                </span>
              </div>
            )}
          </div>

          <p className="flex items-center gap-2.5 rounded-md bg-brand-tint p-3 text-label lg:hidden">
            <Banknote aria-hidden="true" strokeWidth={1.5} className="size-5.5 shrink-0 text-brand-bright" />
            Cash on delivery all over Bangladesh. 100% authentic{brandName ? ` ${brandName}` : ""} product.
          </p>

          {product.keyFeatures.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <h2 className="text-base font-semibold tracking-[-0.01em] text-ink lg:sr-only">Key features</h2>
              <ul className="list-disc pl-5 text-ink lg:leading-6.5">
                {product.keyFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:gap-6">
            <div className="flex flex-col gap-2">
              <span id={`${ids}-colour`} className="text-label font-semibold text-ink">
                Colour <span className="font-normal text-ink-muted">{variant.name}</span>
              </span>
              <div role="group" aria-labelledby={`${ids}-colour`} className="flex flex-wrap gap-2">
                {product.variants.map((item) => {
                  const selected = item.id === variant.id;
                  const thumb = item.images[0] ?? (product.variants.length === 1 ? product.images[0] : undefined);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-label={`${item.name}${item.stock > 0 ? "" : ", out of stock"}`}
                      aria-pressed={selected}
                      onClick={() => selectVariant(item.id)}
                      className={cn(
                        "relative size-16 overflow-hidden rounded-md bg-media-frame lg:size-14",
                        selected ? "border-2 border-brand-bright" : "border border-border",
                        item.stock === 0 && "opacity-50",
                      )}
                    >
                      {thumb ? (
                        <Image
                          src={thumb.src}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                          style={{ objectPosition: thumb.position ?? "center" }}
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="absolute inset-3 rounded-full border border-border"
                          // Swatch colour is product data, not a design token.
                          style={{ backgroundColor: item.colorHex ?? "transparent" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {inStock && (
              <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                <span id={`${ids}-qty`} className="text-label font-semibold text-ink">
                  Quantity
                </span>
                <QuantityStepper value={quantity} max={maxQuantity} onChange={setQuantity} labelId={`${ids}-qty`} />
              </div>
            )}
          </div>

          {inStock ? (
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              <Button variant="outline" className="h-12 lg:h-13 lg:text-base" onClick={orderSoon}>
                Add to cart
              </Button>
              <Button className="h-12 lg:h-13 lg:text-base" onClick={orderSoon}>
                Order now
              </Button>
            </div>
          ) : (
            <Button variant="outline" disabled className="h-12 w-full text-danger lg:h-13">
              Out of stock
            </Button>
          )}

          {messengerUrl && (
            <a
              href={messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center justify-center gap-2 rounded-md text-label font-semibold text-brand-bright hover:text-brand lg:hidden"
            >
              <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-5" />
              Questions? Ask us on Messenger
            </a>
          )}

          <ul className="hidden grid-cols-2 gap-3 rounded-md bg-brand-tint p-4 text-label lg:grid">
            <li className="flex items-center gap-2">
              <Banknote aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
              Cash on delivery
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
              100% authentic{brandName ? ` ${brandName}` : ""}
            </li>
            <li className="flex items-center gap-2">
              <Truck aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
              All over Bangladesh
            </li>
            {messengerUrl && (
              <li>
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-sm font-semibold text-brand-bright hover:text-brand"
                >
                  <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-5" />
                  Ask on Messenger
                </a>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Phones: sticky order bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-surface px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgb(11_15_22/0.08)] lg:hidden">
        <div className="flex flex-col">
          <span className="font-heading text-section leading-6.5 font-bold tracking-[-0.02em] text-ink">
            {formatPrice(price)}
          </span>
          <span className="text-small text-ink-muted">Cash on delivery</span>
        </div>
        {inStock ? (
          <Button className="ml-auto h-12 flex-1" onClick={orderSoon}>
            Order now
          </Button>
        ) : (
          <Button variant="outline" disabled className="ml-auto h-12 flex-1 text-danger">
            Out of stock
          </Button>
        )}
      </div>
    </>
  );
};
