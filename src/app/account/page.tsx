import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AccountSignOut } from "@/components/account/account-sign-out";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/admin-auth";
import { formatBdPhone } from "@/lib/phone";
import { isPhoneEmail } from "@/lib/phone-account";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

// Reads the sign-in session per request (allowed to wait for the server).
export const instant = false;

const cardClass = "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 lg:p-5";

const AccountDetails = async () => {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");
  const { user } = session;
  const phoneAccount = isPhoneEmail(user.email);
  const phone = user.phone ? formatBdPhone(user.phone) : null;
  const hasAddress = Boolean(user.deliveryAddress);

  return (
    <>
      <h1 className="text-page-title text-ink lg:text-page-title-lg">Hi, {user.name.split(" ")[0]}.</h1>

      <section aria-labelledby="details-title" className={cardClass}>
        <h2 id="details-title" className="text-panel-title text-ink">
          Your details
        </h2>
        <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2 text-label">
          <dt className="text-ink-muted">Name</dt>
          <dd className="text-ink">{user.name}</dd>
          {phone && (
            <>
              <dt className="text-ink-muted">Phone</dt>
              <dd className="font-heading text-ink">{phone}</dd>
            </>
          )}
          {!phoneAccount && (
            <>
              <dt className="text-ink-muted">Email</dt>
              <dd className="break-all text-ink">{user.email}</dd>
            </>
          )}
          <dt className="text-ink-muted">Signed in with</dt>
          <dd className="text-ink">{phoneAccount ? "Phone number and password" : "Google"}</dd>
        </dl>
      </section>

      <section aria-labelledby="address-title" className={cardClass}>
        <h2 id="address-title" className="text-panel-title text-ink">
          Saved delivery address
        </h2>
        {hasAddress ? (
          <p className="text-label text-ink">
            {user.deliveryAddress}
            <br />
            <span className="text-ink-muted">
              {user.deliveryDistrict}
              {user.deliveryArea === "inside" ? " (inside Dhaka)" : user.deliveryArea === "outside" ? " (outside Dhaka)" : ""}
            </span>
          </p>
        ) : (
          <p className="text-label text-ink-muted">
            Your address is saved when you place an order, so checkout is quicker next time.
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-2">
        <Link href="/shop" className={buttonVariants()}>
          Continue shopping
        </Link>
        {user.role === "admin" && (
          <Link href="/admin/orders" className={buttonVariants({ variant: "outline" })}>
            Admin panel
          </Link>
        )}
        <AccountSignOut />
      </div>
    </>
  );
};

const AccountRoute = () => (
  <>
    <SiteHeader leading="back" backHref="/" actions={["cart"]} current="login" />
    <main className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-160 flex-col gap-4 px-4 pt-5 pb-12 lg:pt-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
        <Suspense
          fallback={
            <div aria-busy="true" className={cn("flex flex-col gap-3")}>
              <span className="sr-only">Loading your account…</span>
              <div className="h-9 w-56 animate-pulse rounded-md bg-media-frame" />
              <div className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
            </div>
          }
        >
          <AccountDetails />
        </Suspense>
      </div>
    </main>
    <SiteFooter variant="minimal" />
  </>
);

export default AccountRoute;
