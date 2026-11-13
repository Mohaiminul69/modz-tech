import Image from "next/image";
import Link from "next/link";
import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";

// Small card (photo, name, price) for "Popular right now" and "Goes well with" rows.
export const MiniProductCard = ({ product, className }: { product: CardProduct; className?: string }) => (
  <Link
    href={`/product/${product.slug}`}
    className={cn(
      "flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow duration-150 hover:shadow-glow",
      className,
    )}
  >
    <span className="relative block aspect-square bg-media-frame">
      {product.image && (
        <Image
          src={product.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 220px, 160px"
          className="object-cover"
          style={{ objectPosition: product.image.position ?? "center" }}
        />
      )}
    </span>
    <span className="flex flex-col gap-1 p-3">
      <span className="line-clamp-2 h-10 text-card-name text-ink-muted">{product.name}</span>
      <PriceTag price={product.price} oldPrice={product.oldPrice} />
    </span>
  </Link>
);
