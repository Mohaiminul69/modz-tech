import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MiniProductCard } from "@/components/product/mini-product-card";
import { buttonVariants } from "@/components/ui/button";
import { getListingItems } from "@/lib/data/products";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const NotFound = async () => {
  const popular = (await getListingItems())
    .filter((item) => item.card.inStock)
    .sort((a, b) => b.soldCount - a.soldCount || b.createdAt - a.createdAt)
    .slice(0, 4)
    .map((item) => item.card);

  return (
    <>
      <SiteHeader leading="none" actions={["cart"]} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-140 flex-col lg:max-w-content lg:px-4 lg:pb-16 xl:px-0">
          <section className="mx-auto flex w-full max-w-140 flex-col items-center gap-3 px-4 pt-12 pb-8 text-center lg:pt-16">
            <p className="eyebrow text-brand-bright">Error 404</p>
            <p aria-hidden="true" className="font-heading text-[112px] leading-26 font-bold tracking-[-0.06em] text-ink">
              4<span className="text-brand">0</span>4
            </p>
            <h1 className="mt-2 text-[24px] leading-7.5 text-ink">Signal lost.</h1>
            <p className="max-w-75 text-ink-muted">
              This page moved or never existed. Try a search, or head back to the shop.
            </p>
            <Form
              action="/search"
              role="search"
              className="mt-2 flex h-12 w-full items-center gap-2 rounded-md border border-control bg-surface px-3 text-ink-muted focus-within:border-brand-bright"
            >
              <Search aria-hidden="true" strokeWidth={1.5} className="size-5" />
              <input
                type="search"
                name="q"
                placeholder="Search products"
                aria-label="Search products"
                enterKeyHint="search"
                className="h-full min-w-0 flex-1 bg-transparent text-body text-ink placeholder:text-ink-muted focus-visible:outline-none"
              />
            </Form>
            <div className="grid w-full grid-cols-2 gap-2">
              <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12")}>
                Go home
              </Link>
              <Link href="/shop" className={cn(buttonVariants(), "h-12")}>
                Browse shop
              </Link>
            </div>
          </section>

          {popular.length > 0 && (
            <section aria-labelledby="popular-title" className="flex flex-col gap-3 px-4 pt-2 pb-8 lg:gap-5 lg:px-0">
              <h2 id="popular-title" className="text-panel-title text-ink lg:text-section">
                Popular right now
              </h2>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
                {popular.map((product, index) => (
                  <li key={product.id} className={cn("flex", index > 1 && "hidden lg:flex")}>
                    <MiniProductCard product={product} className="w-full" />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <SiteFooter variant="minimal" />
    </>
  );
};

export default NotFound;
