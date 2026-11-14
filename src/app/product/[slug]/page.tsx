import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ProductInfo } from "@/components/product/product-info";
import { ProductView } from "@/components/product/product-view";
import { SimilarProducts } from "@/components/product/similar-products";
import { getProduct, getProductSlugs, getSimilarProducts } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";
import { formatPrice } from "@/lib/format";
import { cardPricing } from "@/lib/pricing";

// Prerender every product at build time (Cache Components needs at least one).
export const generateStaticParams = async () => {
  const slugs = await getProductSlugs();
  return slugs.length > 0 ? slugs.map((slug) => ({ slug })) : [{ slug: "__none__" }];
};

export const generateMetadata = async ({ params }: PageProps<"/product/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  const { price } = cardPricing(product.variants);
  const image = product.images[0] ?? product.variants[0]?.images[0];
  return {
    title: `${product.name} price in Bangladesh`,
    description: `${product.name} at ${formatPrice(price)}. ${product.shortSpec ? `${product.shortSpec}. ` : ""}100% authentic, cash on delivery all over Bangladesh.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: image ? { images: [{ url: image.src, alt: image.alt }] } : undefined,
  };
};

// "30 Nov", in Bangladesh time. Formatted on the server so it can't differ in the browser.
const offerDate = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "Asia/Dhaka" }).format(new Date(iso))
    : undefined;

// Reads the slug from the URL, so it sits inside <Suspense>: a click on a product that wasn't
// prerendered shows the skeleton straight away. Prerendered products arrive fully rendered.
const ProductContent = async ({ params }: { params: PageProps<"/product/[slug]">["params"] }) => {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [similar, settings] = await Promise.all([
    getSimilarProducts(product.slug, product.category.slug),
    getSettings(),
  ]);
  const categoryHref = `/category/${product.category.slug}`;

  return (
    <>
      <SiteHeader leading="back" backHref={categoryHref} actions={["search", "cart"]} activeCategory={product.category.slug} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-content flex-col lg:gap-5 lg:px-4 lg:pt-5 xl:px-0">
          <Breadcrumbs
            className="px-4 py-3 lg:p-0"
            items={[
              { label: "Home", href: "/" },
              { label: product.category.name, href: categoryHref },
              { label: product.name },
            ]}
          />
          <ProductView
            product={product}
            offerEndsLabel={offerDate(product.offerEndsAt)}
            messengerUrl={settings.messengerUrl}
          />
          <ProductInfo product={product} messengerUrl={settings.messengerUrl} />
          <SimilarProducts products={similar} />
        </div>
      </main>
    </>
  );
};

const ProductSkeleton = () => (
  <>
    <SiteHeader leading="back" backHref="/shop" actions={["search", "cart"]} />
    <main aria-busy="true" className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-content flex-col lg:gap-5 lg:px-4 lg:pt-5 xl:px-0">
        <div className="mx-4 my-3 h-4 w-48 animate-pulse rounded-sm bg-media-frame lg:m-0" />
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="aspect-square animate-pulse bg-media-frame lg:rounded-lg" />
          <div className="flex flex-col gap-3 px-4 lg:px-0">
            <div className="h-7 w-4/5 animate-pulse rounded-sm bg-media-frame" />
            <div className="h-4 w-1/2 animate-pulse rounded-sm bg-media-frame" />
            <div className="h-8 w-1/3 animate-pulse rounded-sm bg-media-frame" />
            <div className="mt-4 h-12 animate-pulse rounded-md bg-media-frame" />
            <div className="h-12 animate-pulse rounded-md bg-media-frame" />
          </div>
        </div>
      </div>
    </main>
  </>
);

const ProductRoute = ({ params }: PageProps<"/product/[slug]">) => (
  <>
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
    <SiteFooter variant="compact" />
    {/* Room for the fixed mobile order bar */}
    <div aria-hidden="true" className="h-18 bg-chrome lg:hidden" />
  </>
);

export default ProductRoute;
