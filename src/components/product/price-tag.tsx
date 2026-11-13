import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type PriceTagProps = {
  /** null = unknown price (sample data placeholder). */
  price: number | null;
  oldPrice?: number;
  className?: string;
};

// Now price + struck-through old price. Product-page "Save ৳71" variant comes with that page.
export const PriceTag = ({ price, oldPrice, className }: PriceTagProps) => (
  <div className={cn("flex items-baseline gap-1.5 font-heading lg:gap-2", className)}>
    <span className="text-card-price font-bold tracking-[-0.01em] text-ink lg:text-card-price-lg">
      {price === null ? "৳[price]" : formatPrice(price)}
    </span>
    {oldPrice !== undefined && price !== null && oldPrice > price && (
      <s className="text-small text-ink-muted lg:text-small-lg">
        <span className="sr-only">was </span>
        {formatPrice(oldPrice)}
      </s>
    )}
  </div>
);
