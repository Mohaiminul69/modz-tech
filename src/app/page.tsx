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
import { getCategories } from "@/lib/data/catalog";
import { getHomeProducts } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";

const HomePage = async () => {
  const [settings, categories, home] = await Promise.all([getSettings(), getCategories(), getHomeProducts()]);

  return (
    <>
      <SiteHeader leading="menu" actions={["account", "cart"]} showSearch activeCategory="all" />
      <main className="flex flex-1 flex-col">
        <HeroBanner slides={settings.heroSlides} />

        {/* Light page body: full width on phones, 1200px column on desktop */}
        <div className="mx-auto flex w-full max-w-content flex-col lg:px-4 xl:px-0">
          <CategoryGrid categories={categories} />
          <TrustStrip />
          <ProductSection
            id="exclusive"
            eyebrow="Hand-picked"
            title="Exclusive"
            href="/shop?tag=exclusive"
            cta="order"
            products={home.exclusive}
          />
          {home.brands.length > 0 && (
            <BrandShelf
              title="Shop by brand"
              href="/shop"
              panels={home.brands.map((brand) => ({
                slug: brand.slug,
                name: brand.name,
                content: <ProductGrid products={brand.products} cta="cart" />,
              }))}
            />
          )}
          <PromoTiles tiles={settings.promoTiles} />
          <ProductSection
            id="top-selling"
            eyebrow="Customers love"
            title="Top selling"
            href="/shop?sort=best-selling"
            cta="order"
            products={home.topSelling}
            mobileCount={4}
          />
          {settings.saleBanner && <SaleBanner {...settings.saleBanner} />}
          <ProductSection
            id="new-arrivals"
            eyebrow="Just landed"
            title="New arrivals"
            href="/shop?sort=newest"
            cta="cart"
            products={home.newArrivals}
          />
          {home.categoryRows.map((row) => (
            <ProductSection key={row.id} {...row} cta="cart" mobileOnly />
          ))}
          <SeoBlock />
        </div>
      </main>
      <SiteFooter variant="full" />
      <BottomNav current="home" />
    </>
  );
};

export default HomePage;
