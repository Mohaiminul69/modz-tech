import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { TrackForm } from "@/components/track/track-form";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Check your Modz Tech order status with your order number and phone number.",
  alternates: { canonical: "/track" },
};

const TrackRoute = async () => {
  const settings = await getSettings();

  return (
    <>
      <SiteHeader leading="back" backHref="/" actions={["cart"]} current="track" />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-160 flex-col gap-4 px-4 pt-5 pb-8 lg:pt-8 lg:pb-16">
          <div className="flex flex-col gap-1.5">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track order" }]} />
            <h1 className="mt-1 text-page-title text-ink lg:text-page-title-lg">Track your order</h1>
            <p className="text-ink-muted">
              Enter the order number from your order confirmation and the phone number you ordered with.
            </p>
          </div>
          {/* The form reads ?order= from the link, so it renders in the browser. */}
          <Suspense fallback={<div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />}>
            <TrackForm />
          </Suspense>
          {settings.messengerUrl && (
            <p className="pt-2 text-center text-label text-ink-muted">
              Can&apos;t find your order?{" "}
              <a
                href={settings.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm font-semibold text-brand-bright hover:text-brand"
              >
                Message us on Facebook
              </a>
            </p>
          )}
        </div>
      </main>
      <SiteFooter variant="minimal" />
    </>
  );
};

export default TrackRoute;
