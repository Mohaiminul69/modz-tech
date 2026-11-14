import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductActiveToggle } from "@/components/admin/product-active-toggle";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/admin-auth";
import { listProductsAdmin } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = { title: "Products" };

const priceRange = (min: number, max: number) => (min === max ? formatPrice(min) : `${formatPrice(min)}–${formatPrice(max)}`);

const ProductsPage = async () => {
  await requireAdminPage();
  const products = await listProductsAdmin();

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-page-title text-ink">Products</h1>
        <Link href="/admin/products/new" className={cn(buttonVariants(), "gap-1.5")}>
          <Plus aria-hidden="true" strokeWidth={1.5} /> Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed border-control bg-surface p-8 text-center text-ink-muted">
          No products yet. Add your first one.
        </p>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
          {products.map((product, index) => (
            <li
              key={product.id}
              className={cn("flex items-center gap-3 p-3 lg:px-4", index > 0 && "border-t border-border", !product.active && "opacity-60")}
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-media-frame">
                {product.image && <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <Link href={`/admin/products/${product.id}`} className="truncate text-label font-semibold text-ink hover:text-brand-bright">
                  {product.name}
                </Link>
                <span className="text-small text-ink-muted">
                  {product.category} · {priceRange(product.minPrice, product.maxPrice)} ·{" "}
                  {product.variants > 1 ? `${product.variants} variants · ` : ""}
                  <span className={product.stock === 0 ? "font-semibold text-danger" : undefined}>{product.stock} in stock</span>
                  {product.outOfStock > 0 && product.stock > 0 && (
                    <span className="text-danger"> ({product.outOfStock} sold out)</span>
                  )}
                  {" · "}
                  {product.soldCount} sold
                </span>
              </span>
              <ProductActiveToggle id={product.id} active={product.active} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;
