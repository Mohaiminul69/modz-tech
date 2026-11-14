import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopPage, ShopPageSkeleton } from "@/components/shop/shop-page";
import { getCategories } from "@/lib/data/catalog";

// Prerender every category at build time (Cache Components needs at least one).
export const generateStaticParams = async () => {
  const categories = await getCategories();
  return categories.length > 0 ? categories.map((category) => ({ slug: category.slug })) : [{ slug: "__none__" }];
};

export const generateMetadata = async ({ params }: PageProps<"/category/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} price in Bangladesh`,
    description: `Shop ${category.name.toLowerCase()} at Modz Tech. 100% authentic, cash on delivery all over Bangladesh.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
};

type CategoryRouteProps = PageProps<"/category/[slug]">;

// Reads the slug from the URL, so it sits inside <Suspense>: a click on a category that wasn't
// prerendered shows the skeleton straight away.
const CategoryContent = async ({ params, searchParams }: CategoryRouteProps) => {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <ShopPage
      title={category.name}
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: category.name }]}
      searchParams={searchParams}
      category={category.slug}
    />
  );
};

const CategoryRoute = ({ params, searchParams }: CategoryRouteProps) => (
  <Suspense fallback={<ShopPageSkeleton />}>
    <CategoryContent params={params} searchParams={searchParams} />
  </Suspense>
);

export default CategoryRoute;
