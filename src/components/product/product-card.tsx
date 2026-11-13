import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { CardProduct } from "@/config/sample-products";
import { cn } from "@/lib/utils";
import { PriceTag } from "./price-tag";

type ProductCardProps = {
  product: CardProduct;
  /** "order" = blue "Order now", "cart" = outline "Add to cart". */
  cta?: "order" | "cart";
  className?: string;
};

const badgeClass =
  "absolute top-2 left-2 rounded-sm px-2 py-0.5 font-heading text-[11px] leading-4 font-semibold lg:top-2.5 lg:left-2.5 lg:px-2.5 lg:py-0.75 lg:text-small";

/*
 * The image and name form one link (stretched over the card); the button is a
 * separate link so there are no nested interactive elements.
 * TODO(cart stage): "Add to cart" adds to the cart instead of opening the product.
 */
export const ProductCard = ({ product, cta = "cart", className }: ProductCardProps) => {
  const href = `/product/${product.slug}`;
  const onSale = product.oldPrice !== undefined && product.price !== null && product.oldPrice > product.price;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-shadow duration-150 ease-out hover:shadow-glow",
        className,
      )}
    >
      <div className="relative aspect-square bg-media-frame">
        <Image
          src={product.image.src}
          alt=""
          fill
          sizes="(min-width: 1200px) 220px, (min-width: 1024px) 19vw, 50vw"
          className="object-cover"
          style={{ objectPosition: product.image.position ?? "center" }}
        />
      </div>
      {onSale ? (
        <span className={cn(badgeClass, "bg-offer text-on-offer")}>Sale</span>
      ) : product.isNew ? (
        <span className={cn(badgeClass, "bg-brand text-on-brand")}>New</span>
      ) : null}

      <div className="flex flex-1 flex-col gap-1 p-3 lg:p-3.5">
        <h3 className="font-sans text-card-name font-normal tracking-normal text-ink-muted lg:text-card-name-lg">
          <Link
            href={href}
            className="line-clamp-2 h-10 rounded-sm after:absolute after:inset-0 after:content-[''] lg:h-11"
          >
            {product.name}
          </Link>
        </h3>
        <PriceTag price={product.price} oldPrice={product.oldPrice} className="mt-auto pt-1" />
        <p className="text-small text-ink-muted">{product.spec}</p>
        <Link
          href={href}
          aria-label={`${cta === "order" ? "Order now" : "Add to cart"}: ${product.name}`}
          className={cn(
            buttonVariants({ variant: cta === "order" ? "default" : "outline", size: "sm" }),
            "relative z-10 mt-2 h-10 w-full lg:mt-2.5",
          )}
        >
          {cta === "order" ? "Order now" : "Add to cart"}
        </Link>
      </div>
    </article>
  );
};
