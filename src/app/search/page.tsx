import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchResults } from "@/components/search/search-results";
import { ShopResultsSkeleton } from "@/components/shop/shop-results";

export const metadata: Metadata = {
  title: "Search",
  // Search result pages shouldn't be indexed (endless near-duplicate URLs).
  robots: { index: false, follow: true },
};

// The header (with the query in the search box) and results depend on ?q=, so both stream in.
const SearchRoute = ({ searchParams }: PageProps<"/search">) => (
  <>
    <Suspense
      fallback={
        <>
          <SiteHeader leading="back" backHref="/shop" actions={["cart"]} showSearch />
          <main className="mx-auto w-full max-w-content flex-1 lg:px-4 lg:pt-6 xl:px-0">
            <ShopResultsSkeleton />
          </main>
        </>
      }
    >
      <SearchResults searchParams={searchParams} />
    </Suspense>
    <SiteFooter variant="minimal" />
  </>
);

export default SearchRoute;
