import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: CardProduct[];
  cta?: "order" | "cart";
  /** Cards from this index on are hidden on phones/tablets. */
  mobileCount?: number;
};

// Home rows: 2 across on phones, 5 across on desktop.
export const ProductGrid = ({ products, cta, mobileCount = 2 }: ProductGridProps) => (
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-6">
    {products.slice(0, 5).map((product, index) => (
      <ProductCard
        key={product.id}
        product={product}
        cta={cta}
        className={cn(index >= mobileCount && "hidden lg:flex")}
      />
    ))}
  </div>
);
