import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CircleCheck } from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { getOrderWithKey } from "@/lib/data/orders";
import { getSettings } from "@/lib/data/settings";
import { formatPrice } from "@/lib/format";
import { formatBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order placed",
  robots: { index: false, follow: false },
};

const cardClass = "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 lg:p-6";

const Confirmation = async ({ params, searchParams }: PageProps<"/order/[orderNumber]/confirmed">) => {
  const [{ orderNumber }, query] = await Promise.all([params, searchParams]);
  const key = typeof query.key === "string" ? query.key : "";
  const [order, settings] = await Promise.all([getOrderWithKey(orderNumber, key), getSettings()]);
  if (!order) notFound();

  const deliveryTime = settings.delivery[order.delivery.area === "inside" ? "insideDhaka" : "outsideDhaka"].time;
  const areaLabel = order.delivery.area === "inside" ? "Inside Dhaka" : "Outside Dhaka";

  const steps = [
    { title: "We call to confirm", text: "Usually within a few hours." },
    { title: "We pack and ship", text: "You can follow it any time on Track order." },
    {
      title: "Pay cash on delivery",
      text: deliveryTime ? `${areaLabel} in ${deliveryTime}.` : "Pay the courier when it arrives.",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-160 flex-col pb-8 lg:pb-16">
      <section className="flex flex-col items-center gap-3 px-4 pt-8 pb-6 text-center lg:pt-12">
        <span className="flex size-18 items-center justify-center rounded-full bg-success/10">
          <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-10 text-success" />
        </span>
        <h1 className="mt-1 text-page-title text-ink">Thank you. Your order is placed.</h1>
        <p className="text-ink-muted">
          We&apos;ll call you at <span className="font-semibold text-ink">{formatBdPhone(order.customer.phone)}</span> to
          confirm before we send it.
        </p>
        <p className="mt-1 rounded-full border border-border bg-surface px-3.5 py-1.5 text-label text-ink">
          Order no. <span className="font-heading font-bold">#{order.orderNumber}</span>
        </p>
      </section>

      <div className="flex flex-col gap-3 px-4">
        <section aria-labelledby="next-title" className={cardClass}>
          <h2 id="next-title" className="text-panel-title text-ink">
            What happens next
          </h2>
          <ol className="flex flex-col gap-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3 text-label">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full font-heading text-[13px] font-bold",
                    index === 0 ? "bg-brand text-on-brand" : "bg-brand-tint text-brand-bright",
                  )}
                >
                  {index + 1}
                </span>
                <span>
                  <strong className="font-semibold text-ink">{step.title}</strong>
                  <br />
                  <span className="text-ink-muted">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="summary-title" className={cardClass}>
          <h2 id="summary-title" className="text-panel-title text-ink">
            Order summary
          </h2>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={`${item.name}-${item.variantName}`} className="flex items-center gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-media-frame">
                  {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
                </span>
                <span className="flex-1 text-label text-ink-muted">
                  {item.name}
                  {item.variantName && `, ${item.variantName}`}{" "}
                  <span className="font-semibold text-ink">× {item.quantity}</span>
                </span>
                <span className="font-heading text-[15px] font-semibold text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="flex flex-col gap-3 text-label">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className={order.deliveryFee !== null ? "font-heading font-semibold text-ink" : "text-ink-muted"}>
                {order.deliveryFee !== null ? formatPrice(order.deliveryFee) : "Confirmed on the call"}
              </dd>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-body font-semibold text-ink">Pay on delivery</dt>
              <dd className="font-heading text-section leading-6.5 font-bold tracking-[-0.02em] text-ink">
                {formatPrice(order.total)}
                {order.deliveryFee === null && <span className="text-label font-normal text-ink-muted"> + delivery</span>}
              </dd>
            </div>
          </dl>
          <p className="text-label text-ink-muted">
            <span className="font-semibold text-ink">Deliver to:</span> {order.customer.name}, {order.delivery.address},{" "}
            {order.delivery.district}
          </p>
        </section>
      </div>

      <section className="flex flex-col gap-2 px-4 pt-5">
        <Link href={`/track?order=${order.orderNumber}`} className={cn(buttonVariants(), "h-12")}>
          Track your order
        </Link>
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "h-12")}>
          Continue shopping
        </Link>
        {settings.messengerUrl && (
          <p className="mt-2 text-center text-label text-ink-muted">
            Questions?{" "}
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
      </section>
    </div>
  );
};

const ConfirmationSkeleton = () => (
  <div aria-busy="true" className="mx-auto flex w-full max-w-160 flex-col gap-3 px-4 pt-8 pb-16">
    <span className="sr-only">Loading your order…</span>
    <div className="mx-auto size-18 animate-pulse rounded-full bg-media-frame" />
    <div className="mx-auto h-8 w-3/4 animate-pulse rounded-md bg-media-frame" />
    <div className="h-40 animate-pulse rounded-lg border border-border bg-surface" />
    <div className="h-56 animate-pulse rounded-lg border border-border bg-surface" />
  </div>
);

// The order is personal data, so it renders per request inside Suspense (never prerendered or cached).
const OrderConfirmedRoute = (props: PageProps<"/order/[orderNumber]/confirmed">) => (
  <>
    <SiteHeader leading="none" actions={[]} showCategoryNav={false} />
    <main className="flex flex-1 flex-col">
      <Suspense fallback={<ConfirmationSkeleton />}>
        <Confirmation {...props} />
      </Suspense>
    </main>
    <SiteFooter variant="minimal" />
  </>
);

export default OrderConfirmedRoute;
