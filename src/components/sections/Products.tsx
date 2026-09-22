"use client";

import Image from "next/image";
import Link from "next/link";
import {
  PiArrowRight,
  PiHeadphones,
  PiBatteryChargingVertical,
  PiWatch,
  PiUsb,
  PiCube,
} from "react-icons/pi";
import { products, type Product, type ProductIcon } from "@data/products";
import { useCart } from "@context/CartContext";

const ICONS: Record<ProductIcon, typeof PiCube> = {
  earbuds: PiHeadphones,
  battery: PiBatteryChargingVertical,
  watch: PiWatch,
  hub: PiUsb,
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();
  const Icon = ICONS[product.icon] || PiCube;

  return (
    <Link
      href={product.slug}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-white/8 transition-colors hover:border-[rgba(106,169,233,.45)]"
      style={{
        backgroundImage:
          "linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))",
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/7 bg-surface-media">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            role="img"
            aria-label={product.name}
          >
            <Icon className="h-10 w-10 text-accent-tint/60" strokeWidth={1.5} />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full border border-white/12 bg-[rgba(7,9,13,.75)] px-2.5 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.1em] text-[#a9c9ee]">
          {product.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-[18px]">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-snow/40">
          {product.category}
        </span>
        <h3 className="font-heading text-[16.5px] font-semibold text-snow">
          {product.name}
        </h3>
        <p className="font-body text-[12.5px] leading-relaxed text-snow/50">
          {product.note}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-heading text-[16px] font-semibold text-snow">
            ৳{product.price.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addItem(product.id, 1);
            }}
            className="rounded-full border border-[rgba(106,169,233,.4)] bg-[rgba(47,127,212,.14)] px-4 py-1.5 font-body text-[12.5px] font-semibold text-[#cfe3f8] transition-colors hover:bg-[rgba(47,127,212,.3)] hover:text-white"
          >
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

const Products = () => {
  return (
    <section
      id="featured"
      className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-[clamp(56px,6vw,96px)]"
    >
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent-tint">
            02 — Featured products
          </span>
          <h2 className="mt-3 max-w-2xl font-heading text-[clamp(26px,3vw,40px)] font-bold leading-[1.1] tracking-[-0.028em] text-snow">
            The pieces people keep coming back for.
          </h2>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border-b border-white/20 pb-1 font-body text-[13px] font-semibold text-snow/70 transition-colors hover:text-snow"
        >
          View all products
          <PiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div
        className="grid gap-[18px]"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Products;
