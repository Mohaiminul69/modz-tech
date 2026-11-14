"use client";

import { authClient } from "@/lib/auth-client";
import type { DeliveryArea } from "@/lib/checkout-schema";
import { isPhoneEmail } from "@/lib/phone-account";
import type { SiteSettings } from "@/lib/types";
import { type CheckoutUser, CheckoutView } from "./checkout-view";

type CheckoutWithAccountProps = {
  delivery: SiteSettings["delivery"];
  phone: string;
};

// Loads the session in the browser, then shows checkout prefilled for signed-in customers.
export const CheckoutWithAccount = ({ delivery, phone }: CheckoutWithAccountProps) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div aria-busy="true" className="flex flex-col gap-3 px-4 py-6 lg:px-0">
        <span className="sr-only">Loading checkout…</span>
        <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-32 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    );
  }

  const user = session?.user;
  const saved: CheckoutUser = user
    ? {
        name: user.name,
        // The phone field already shows "+880", so drop the leading 0.
        phone: user.phone ? user.phone.replace(/^0/, "") : "",
        // Phone accounts have an internal sign-in address; never show it as their email.
        email: isPhoneEmail(user.email) ? "" : user.email,
        area: user.deliveryArea === "inside" || user.deliveryArea === "outside" ? (user.deliveryArea as DeliveryArea) : null,
        district: user.deliveryDistrict ?? "",
        address: user.deliveryAddress ?? "",
      }
    : null;

  // key: a fresh form when someone signs in or out.
  return <CheckoutView key={user?.id ?? "guest"} delivery={delivery} phone={phone} user={saved} />;
};
