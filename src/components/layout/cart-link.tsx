import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type CartLinkProps = {
  /** "icon" = mobile header icon with a bubble, "text" = desktop "Cart" link with a pill. */
  variant: "icon" | "text";
  count?: number;
  current?: boolean;
};

const cartLabel = (count: number) =>
  count > 0 ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart";

// TODO(cart stage): read the count from the cart store instead of a prop.
export const CartLink = ({ variant, count = 0, current = false }: CartLinkProps) => {
  if (variant === "icon") {
    return (
      <Link
        href="/cart"
        aria-label={cartLabel(count)}
        aria-current={current ? "page" : undefined}
        className={cn(
          "relative flex size-11 items-center justify-center rounded-md",
          current ? "text-chrome-accent" : "text-chrome-silver",
        )}
      >
        <ShoppingCart aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
        {count > 0 && (
          <span
            aria-hidden="true"
            className="absolute top-1.25 right-0.75 h-4.5 min-w-4.5 rounded-full bg-chrome-accent px-1 text-center font-heading text-[11px] leading-4.5 font-bold text-chrome"
          >
            {count}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      aria-label={cartLabel(count)}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-2 rounded-md px-3 text-label",
        current ? "font-semibold text-chrome-accent" : "font-medium text-chrome-silver hover:text-on-chrome",
      )}
    >
      <ShoppingCart aria-hidden="true" strokeWidth={1.5} className="size-5" />
      Cart
      {count > 0 && (
        <span
          aria-hidden="true"
          className="h-5 min-w-5 rounded-full bg-chrome-accent px-1 text-center font-heading text-[11px] leading-5 font-bold text-chrome"
        >
          {count}
        </span>
      )}
    </Link>
  );
};
