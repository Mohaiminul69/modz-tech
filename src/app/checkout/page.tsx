import type { Metadata } from "next";
import { CheckoutWithAccount } from "@/components/checkout/checkout-with-account";
import { CheckoutHeader } from "@/components/layout/checkout-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

// Static shell; the order itself is built from the browser cart (CheckoutView).
const CheckoutRoute = async () => {
  const settings = await getSettings();

  return (
    <>
      <CheckoutHeader />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-content flex-col lg:px-4 lg:pt-6 lg:pb-16 xl:px-0">
          <CheckoutWithAccount delivery={settings.delivery} phone={settings.phone} />
        </div>
      </main>
      <SiteFooter variant="checkout" />
      {/* Room for the fixed mobile confirm bar */}
      <div aria-hidden="true" className="h-18 bg-chrome lg:hidden" />
    </>
  );
};

export default CheckoutRoute;
