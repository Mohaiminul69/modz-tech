import { ProductGrid } from "@/components/product/product-grid";
import type { ProductRow } from "@/config/home";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

export const ProductSection = ({ row }: { row: ProductRow }) => (
  <section
    aria-labelledby={`${row.id}-title`}
    className={cn("flex flex-col gap-3.5 px-4 pt-5 pb-2 lg:gap-5 lg:px-0 lg:pt-12", row.mobileOnly && "lg:hidden")}
  >
    <SectionHeader id={`${row.id}-title`} eyebrow={row.eyebrow} title={row.title} href={row.href} />
    <ProductGrid products={row.products} cta={row.cta} mobileCount={row.mobileCount} />
  </section>
);
