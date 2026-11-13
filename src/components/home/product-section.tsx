import { ProductGrid } from "@/components/product/product-grid";
import type { CardProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

type ProductSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  href: string;
  products: CardProduct[];
  /** "order" = blue "Order now" buttons, "cart" = outline "Add to cart". */
  cta: "order" | "cart";
  /** How many cards phones show (desktop shows up to 5). */
  mobileCount?: number;
  /** Phones only (desktop has no category rows in the mockup). */
  mobileOnly?: boolean;
};

// Hidden entirely when there are no products, so an empty database doesn't show empty rows.
export const ProductSection = ({ id, eyebrow, title, href, products, cta, mobileCount, mobileOnly }: ProductSectionProps) =>
  products.length === 0 ? null : (
    <section
      aria-labelledby={`${id}-title`}
      className={cn("flex flex-col gap-3.5 px-4 pt-5 pb-2 lg:gap-5 lg:px-0 lg:pt-12", mobileOnly && "lg:hidden")}
    >
      <SectionHeader id={`${id}-title`} eyebrow={eyebrow} title={title} href={href} />
      <ProductGrid products={products} cta={cta} mobileCount={mobileCount} />
    </section>
  );
