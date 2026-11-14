import { Suspense } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ShopResults, ShopResultsSkeleton } from "./shop-results";

type ShopPageProps = {
  title: string;
  breadcrumbs: Crumb[];
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  /** Set on /category/[slug]. */
  category?: string;
};

// Shared by /shop and /category/[slug]. Header, title and footer are static;
// the filtered results depend on the URL and stream in.
export const ShopPage = ({ title, breadcrumbs, searchParams, category }: ShopPageProps) => (
  <>
    <SiteHeader
      leading="back"
      backHref="/"
      actions={["cart"]}
      showSearch
      activeCategory={category ?? "all"}
    />
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-content flex-col lg:gap-6 lg:px-4 lg:pt-6 lg:pb-16 xl:px-0">
        <div className="flex flex-col gap-1 px-4 pt-4 lg:gap-1.5 lg:px-0 lg:pt-0">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-1 text-page-title text-ink lg:mt-0 lg:text-page-title-lg">{title}</h1>
        </div>
        <Suspense fallback={<ShopResultsSkeleton />}>
          <ShopResults searchParams={searchParams} fixedCategory={category} />
        </Suspense>
      </div>
    </main>
    <SiteFooter variant="compact" />
    <BottomNav current="categories" />
  </>
);

/** Shown while a page that isn't prerendered (e.g. a new category) works out its title. */
export const ShopPageSkeleton = () => (
  <>
    <SiteHeader leading="back" backHref="/" actions={["cart"]} showSearch />
    <main aria-busy="true" className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-content flex-col lg:gap-6 lg:px-4 lg:pt-6 lg:pb-16 xl:px-0">
        <div className="flex flex-col gap-2 px-4 pt-4 lg:px-0 lg:pt-0">
          <div className="h-4 w-40 animate-pulse rounded-sm bg-media-frame" />
          <div className="h-8 w-56 animate-pulse rounded-sm bg-media-frame" />
        </div>
        <ShopResultsSkeleton />
      </div>
    </main>
    <SiteFooter variant="compact" />
    <BottomNav current="categories" />
  </>
);
