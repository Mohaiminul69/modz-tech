import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getListingItems } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Your cart",
  robots: { index: false },
};

// The page shell is static; the cart itself lives in the browser (CartView).
const CartRoute = async () => {
  const items = await getListingItems();
  const popular = [...items]
    .filter((item) => item.card.inStock)
    .sort((a, b) => b.soldCount - a.soldCount || b.createdAt - a.createdAt)
    .slice(0, 8)
    .map((item) => item.card);

  return (
    <>
      <SiteHeader leading="back" backHref="/shop" actions={["search"]} current="cart" showCategoryNav={false} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-content flex-col lg:px-4 lg:pt-6 lg:pb-16 xl:px-0">
          <CartView popular={popular} />
        </div>
      </main>
      <SiteFooter variant="minimal" />
      {/* Room for the fixed mobile checkout bar */}
      <div aria-hidden="true" className="h-18 bg-chrome lg:hidden" />
    </>
  );
};

export default CartRoute;
