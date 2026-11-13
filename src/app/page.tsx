import { BrandShelf } from "@/components/home/brand-shelf";
import { CategoryGrid } from "@/components/home/category-grid";
import { HeroBanner } from "@/components/home/hero-banner";
import { ProductSection } from "@/components/home/product-section";
import { PromoTiles } from "@/components/home/promo-tiles";
import { SaleBanner } from "@/components/home/sale-banner";
import { SeoBlock } from "@/components/home/seo-block";
import { TrustStrip } from "@/components/home/trust-strip";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductGrid } from "@/components/product/product-grid";
import {
  brandShelf,
  categoryRows,
  exclusiveRow,
  newArrivalsRow,
  promoTiles,
  saleBanner,
  topSellingRow,
} from "@/config/home";
import { heroSlides } from "@/config/hero";

const HomePage = () => (
  <>
    <SiteHeader leading="menu" actions={["account", "cart"]} showSearch activeCategory="all" />
    <main className="flex flex-1 flex-col">
      <HeroBanner slides={heroSlides} />

      {/* Light page body: full width on phones, 1200px column on desktop */}
      <div className="mx-auto flex w-full max-w-content flex-col lg:px-4 xl:px-0">
        <CategoryGrid />
        <TrustStrip />
        <ProductSection row={exclusiveRow} />
        <BrandShelf
          title={brandShelf.title}
          href={brandShelf.href}
          panels={brandShelf.brands.map((brand) => ({
            slug: brand.slug,
            name: brand.name,
            content: <ProductGrid products={brand.products} cta="cart" />,
          }))}
        />
        <PromoTiles tiles={promoTiles} />
        <ProductSection row={topSellingRow} />
        <SaleBanner {...saleBanner} />
        <ProductSection row={newArrivalsRow} />
        {categoryRows.map((row) => (
          <ProductSection key={row.id} row={row} />
        ))}
        <SeoBlock />
      </div>
    </main>
    <SiteFooter variant="full" />
    <BottomNav current="home" />
  </>
);

export default HomePage;
