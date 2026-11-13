import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/components/shop/shop-page";
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

const CategoryRoute = async ({ params, searchParams }: PageProps<"/category/[slug]">) => {
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

export default CategoryRoute;
