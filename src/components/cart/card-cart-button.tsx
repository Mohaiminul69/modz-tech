"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import { addToCart } from "@/lib/cart/store";
import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

type CardCartButtonProps = {
  product: CardProduct;
  /** "order" = add and go to checkout, "cart" = add and stay. */
  cta: "order" | "cart";
  className?: string;
};

export const CardCartButton = ({ product, cta, className }: CardCartButtonProps) => {
  const router = useRouter();
  const label = cta === "order" ? "Order now" : "Add to cart";
  const classes = cn(
    buttonVariants({ variant: cta === "order" ? "default" : "outline", size: "sm" }),
    "relative z-10 h-10 w-full",
    className,
  );

  // Several colours: let the shopper choose on the product page.
  if (product.hasOptions) {
    return (
      <Link href={`/product/${product.slug}`} aria-label={`${label}: choose a colour of ${product.name}`} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={`${label}: ${product.name}`}
      className={classes}
      onClick={() => {
        addToCart({ productId: product.id, variantId: product.variantId, slug: product.slug });
        if (cta === "order") {
          router.push("/checkout");
          return;
        }
        toast.success("Added to cart.", {
          description: product.name,
          action: { label: "View cart", onClick: () => router.push("/cart") },
        });
      }}
    >
      {label}
    </button>
  );
};
