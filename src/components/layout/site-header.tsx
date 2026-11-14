import Link from "next/link";
import { ChevronLeft, Search, Truck } from "lucide-react";
import { getCategories } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";
import { AccountLink } from "./account-link";
import { CartLink } from "./cart-link";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SearchForm } from "./search-form";

type HeaderAction = "search" | "account" | "cart";

type SiteHeaderProps = {
  /** Mobile: what sits left of the logo. */
  leading?: "menu" | "back" | "none";
  backHref?: string;
  backLabel?: string;
  /** Mobile: icon buttons on the right, in order. */
  actions?: HeaderAction[];
  /** Mobile: show the search field row under the top bar (home, shop, search). */
  showSearch?: boolean;
  /** Prefills the search fields (search results page). */
  searchQuery?: string;
  /** Desktop: show the category nav row (home, shop, product). */
  showCategoryNav?: boolean;
  /** Highlights the matching desktop header link. */
  current?: "cart" | "track" | "login";
  /** Highlights a category in the desktop category nav ("all" = All products). */
  activeCategory?: string;
  /** false = desktop header only (log in / sign up have their own dark band on phones). */
  mobile?: boolean;
};

const iconLinkClass = "flex size-11 items-center justify-center rounded-md text-chrome-silver";

const accountLinkClass = (active: boolean) =>
  cn(
    "flex h-11 items-center gap-2 rounded-md px-3 text-label",
    active ? "font-semibold text-chrome-accent" : "font-medium text-chrome-silver hover:text-on-chrome",
  );

const categoryLinkClass = (active: boolean) =>
  cn("shrink-0 rounded-sm", active ? "text-chrome-accent" : "text-chrome-silver hover:text-on-chrome");

export const SiteHeader = async ({
  leading = "menu",
  backHref = "/",
  backLabel = "Back",
  actions = ["account", "cart"],
  showSearch = false,
  searchQuery,
  showCategoryNav = true,
  current,
  activeCategory,
  mobile = true,
}: SiteHeaderProps) => {
  const categories = await getCategories();

  return (
    <header
      className={cn(
        "mz-chrome sticky top-0 z-40 border-b border-chrome-border bg-chrome lg:static",
        !mobile && "hidden lg:block",
      )}
    >
      {/* Mobile */}
      <div className={cn("flex flex-col lg:hidden", showSearch ? "gap-3 px-4 py-3" : "px-3 py-2.5")}>
        <div className="flex items-center gap-2">
          {leading === "menu" && <MobileMenu categories={categories} />}
          {leading === "back" && (
            <Link href={backHref} aria-label={backLabel} className={iconLinkClass}>
              <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
            </Link>
          )}
          <Logo eager className={leading === "menu" ? "h-8.5" : "h-8"} />
          <div className="ml-auto flex">
            {actions.map((action) => {
              if (action === "search") {
                return (
                  <Link key={action} href="/search" aria-label="Search" className={iconLinkClass}>
                    <Search aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
                  </Link>
                );
              }
              if (action === "account") {
                return <AccountLink key={action} variant="icon" current={current === "login"} />;
              }
              return <CartLink key={action} variant="icon" current={current === "cart"} />;
            })}
          </div>
        </div>
        {showSearch && <SearchForm variant="compact" defaultValue={searchQuery} />}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mx-auto flex max-w-content items-center gap-8 px-4 py-3.5 xl:px-0">
          <Logo eager className="h-11" />
          <SearchForm variant="wide" defaultValue={searchQuery} className="mx-auto max-w-155 flex-1" />
          <nav aria-label="Account" className="flex items-center gap-1">
            <Link
              href="/track"
              aria-current={current === "track" ? "page" : undefined}
              className={accountLinkClass(current === "track")}
            >
              <Truck aria-hidden="true" strokeWidth={1.5} className="size-5" />
              Track order
            </Link>
            <AccountLink variant="text" current={current === "login"} />
            <CartLink variant="text" current={current === "cart"} />
          </nav>
        </div>
        {showCategoryNav && (
          <nav aria-label="Categories" className="border-t border-chrome-border">
            <div className="mx-auto flex h-11 max-w-content items-center gap-7 overflow-x-auto px-4 text-label font-medium xl:px-0">
              <Link href="/shop" className={categoryLinkClass(activeCategory === "all")}>
                All products
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className={categoryLinkClass(activeCategory === category.slug)}
                >
                  {category.shortName}
                </Link>
              ))}
              <Link href="/shop?sale=1" className="ml-auto shrink-0 rounded-sm font-semibold text-offer-chrome">
                Offers
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
