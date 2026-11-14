import Link from "next/link";
import { SearchX } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteHeader } from "@/components/layout/site-header";
import { MiniProductCard } from "@/components/product/mini-product-card";
import { ProductCard } from "@/components/product/product-card";
import { getBrands, getCategories } from "@/lib/data/catalog";
import { getListingItems } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";
import { searchProducts } from "@/lib/search";
import type { CardProduct, CategoryItem } from "@/lib/types";

type SearchResultsProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const MAX_RESULTS = 48;

const chipClass =
  "inline-flex h-9 shrink-0 items-center rounded-full border border-control bg-surface px-3.5 text-label font-medium text-ink hover:bg-brand-tint";

const CategoryChips = ({ categories }: { categories: CategoryItem[] }) => (
  <section aria-labelledby="browse-title" className="flex flex-col gap-2.5">
    <h2 id="browse-title" className="px-4 text-base font-semibold tracking-[-0.01em] text-ink lg:px-0">
      Browse by category
    </h2>
    <nav aria-labelledby="browse-title" className="flex gap-2 overflow-x-auto px-4 scrollbar-none lg:flex-wrap lg:px-0">
      {categories.map((category) => (
        <Link key={category.slug} href={`/category/${category.slug}`} className={chipClass}>
          {category.name}
        </Link>
      ))}
    </nav>
  </section>
);

const PopularRow = ({ products }: { products: CardProduct[] }) =>
  products.length === 0 ? null : (
    <section aria-labelledby="popular-title" className="flex flex-col gap-3">
      <h2 id="popular-title" className="px-4 text-panel-title text-ink lg:px-0">
        Popular right now
      </h2>
      <ul className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none lg:grid lg:grid-cols-4 lg:gap-5 lg:px-0">
        {products.map((product) => (
          <li key={product.id} className="flex w-40 shrink-0 lg:w-auto">
            <MiniProductCard product={product} className="w-full" />
          </li>
        ))}
      </ul>
    </section>
  );

// Reads ?q= (request-time), so it renders inside <Suspense> on the search page.
export const SearchResults = async ({ searchParams }: SearchResultsProps) => {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (raw ?? "").trim().slice(0, 100);

  const [items, categories, brands, settings] = await Promise.all([
    getListingItems(),
    getCategories(),
    getBrands(),
    getSettings(),
  ]);
  const brandNames = new Map(brands.map((brand) => [brand.slug, brand.name]));
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  const searchable = items.map((item) => ({
    ...item,
    brandName: item.brandSlug ? brandNames.get(item.brandSlug) : undefined,
    categoryName: categoryNames.get(item.categorySlug),
  }));

  const results = query ? searchProducts(searchable, query).slice(0, MAX_RESULTS) : [];
  const popular = [...items]
    .filter((item) => item.card.inStock)
    .sort((a, b) => b.soldCount - a.soldCount || b.createdAt - a.createdAt)
    .slice(0, 4)
    .map((item) => item.card);

  const header = <SiteHeader leading="back" backHref="/shop" actions={["cart"]} showSearch searchQuery={query} />;

  // No query yet: a prompt plus ways to browse.
  if (!query) {
    return (
      <>
        {header}
        <main className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-content flex-col gap-6 pt-5 pb-12 lg:px-4 lg:pt-8 xl:px-0">
            <div className="flex flex-col gap-1.5 px-4 lg:px-0">
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
              <h1 className="mt-1 text-page-title text-ink lg:text-page-title-lg">Search</h1>
              <p className="text-ink-muted">Type what you&apos;re looking for in the search box, like “earbuds” or “Anker”.</p>
            </div>
            <CategoryChips categories={categories} />
            <PopularRow products={popular} />
          </div>
        </main>
      </>
    );
  }

  // No matches: the "no results" state from the mockup.
  if (results.length === 0) {
    const shorter = query.split(/\s+/)[0];
    return (
      <>
        {header}
        <main className="flex flex-1 flex-col">
          <div className="mx-auto flex w-full max-w-160 flex-col gap-6 pb-12 lg:max-w-content lg:px-4 xl:px-0">
            <section className="flex flex-col items-center gap-3 px-6 pt-10 pb-2 text-center">
              <span className="flex size-24 items-center justify-center rounded-full bg-brand-tint">
                <SearchX aria-hidden="true" strokeWidth={1.5} className="size-10 text-brand-bright" />
              </span>
              <h1 className="mt-2 text-section text-ink">No results for “{query}”.</h1>
              <p className="text-ink-muted">We couldn&apos;t find a match. A few things to try:</p>
              <ul className="flex flex-col gap-1.5 text-left text-label text-ink">
                {["Check the spelling", shorter !== query ? `Try a shorter word, like “${shorter}”` : "Try a different word", "Browse by category below"].map(
                  (tip) => (
                    <li key={tip} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-bright">
                        ✓
                      </span>
                      {tip}
                    </li>
                  ),
                )}
              </ul>
            </section>
            <CategoryChips categories={categories} />
            {settings.messengerUrl && (
              <p className="mx-4 rounded-md bg-brand-tint p-3 text-center text-label text-ink lg:mx-0">
                Can&apos;t find it?{" "}
                <a
                  href={settings.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm font-semibold text-brand-bright hover:text-brand"
                >
                  Message us on Facebook
                </a>{" "}
                and we&apos;ll check for you.
              </p>
            )}
            <PopularRow products={popular} />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {header}
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-content flex-col gap-4 pt-4 pb-12 lg:px-4 lg:pt-6 xl:px-0">
          <div className="flex flex-col gap-1 px-4 lg:px-0">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
            <h1 className="mt-1 text-page-title text-ink lg:text-page-title-lg">Results for “{query}”</h1>
            <p className="text-label text-ink-muted">
              {results.length} {results.length === 1 ? "product" : "products"}
              {results.length === MAX_RESULTS && " (showing the best matches)"}
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:gap-5 lg:px-0">
            {results.map((item, index) => (
              <li key={item.card.id} className="flex">
                <ProductCard product={item.card} cta="cart" showSpec={false} eager={index < 4} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};
