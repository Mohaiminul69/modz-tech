import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdminPage } from "@/lib/admin-auth";
import { getProductForEdit, listBrandsAdmin, listCategoriesAdmin } from "@/lib/admin/data";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = { title: "Edit product" };

const EditProductPage = async ({ params }: PageProps<"/admin/products/[id]">) => {
  await requireAdminPage();
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([getProductForEdit(id), listCategoriesAdmin(), listBrandsAdmin()]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 self-start text-label font-semibold text-brand-bright">
        <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" /> All products
      </Link>
      <h1 className="text-page-title text-ink">{product.name}</h1>
      {/* key: reset the form state after saving (fresh data from the server) */}
      <ProductForm key={JSON.stringify(product)} product={product} categories={categories} brands={brands} />
    </div>
  );
};

export default EditProductPage;
