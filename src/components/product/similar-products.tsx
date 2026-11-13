import Image from "next/image";
import Link from "next/link";
import type { CardProduct } from "@/lib/types";
import { PriceTag } from "./price-tag";
import { ProductCard } from "./product-card";

// Phones: compact rows with a thumbnail. Desktop: five cards without buttons.
export const SimilarProducts = ({ products }: { products: CardProduct[] }) =>
  products.length === 0 ? null : (
    <section
      aria-labelledby="similar-title"
      className="flex flex-col gap-3 border-t border-border px-4 py-6 lg:gap-5 lg:border-0 lg:px-0 lg:pt-8 lg:pb-16"
    >
      <h2 id="similar-title" className="text-section text-ink lg:text-[24px] lg:leading-7.5">
        Similar products
      </h2>

      <ul className="flex flex-col gap-3 lg:hidden">
        {products.slice(0, 3).map((product) => (
          <li key={product.id}>
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5 transition-shadow duration-150 hover:shadow-glow"
            >
              <span className="relative size-20 shrink-0 overflow-hidden rounded-md bg-media-frame">
                {product.image && (
                  <Image
                    src={product.image.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                    style={{ objectPosition: product.image.position ?? "center" }}
                  />
                )}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-card-name text-ink-muted">{product.name}</span>
                <PriceTag price={product.price} oldPrice={product.oldPrice} />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <ul className="hidden grid-cols-5 gap-6 lg:grid">
        {products.map((product) => (
          <li key={product.id} className="flex">
            <ProductCard product={product} showSpec={false} showButton={false} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
