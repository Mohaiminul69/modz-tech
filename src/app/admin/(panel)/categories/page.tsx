import type { Metadata } from "next";
import { BrandManager, CategoryManager } from "@/components/admin/catalog-manager";
import { requireAdminPage } from "@/lib/admin-auth";
import { listBrandsAdmin, listCategoriesAdmin } from "@/lib/admin/data";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = { title: "Categories" };

const CategoriesPage = async () => {
  await requireAdminPage();
  const [categories, brands] = await Promise.all([listCategoriesAdmin(), listBrandsAdmin()]);

  return (
    <div className="flex flex-col gap-8 p-4 lg:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-page-title text-ink">Categories & brands</h1>
        <p className="text-label text-ink-muted">The order here is the order on the shop (menus, category tiles).</p>
      </div>
      <CategoryManager categories={categories} />
      <BrandManager brands={brands} />
    </div>
  );
};

export default CategoriesPage;
