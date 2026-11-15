import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Clock, MapPin, PackageCheck, PhoneCall, ShoppingBag, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { getSettings } from "@/lib/data/settings";
import { formatPrice } from "@/lib/format";
import { formatBdPhone, normalizeBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Delivery information",
  description:
    "Cash on delivery all over Bangladesh. Delivery charges, delivery times and how your order reaches you.",
  alternates: { canonical: "/delivery" },
};

const steps = [
  {
    icon: ShoppingBag,
    title: "You place your order",
    text: "No advance payment and no account needed.",
  },
  {
    icon: PhoneCall,
    title: "We call you to confirm",
    text: "We confirm your order and address by phone before sending it.",
  },
  {
    icon: Truck,
    title: "We send it with a delivery service",
    text: "Your parcel is handed to a delivery service for your area.",
  },
  {
    icon: Banknote,
    title: "Check it, then pay cash",
    text: "Open the parcel and check the product, then pay the delivery person.",
  },
];

const cardClass = "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 lg:p-6";

const AreaCard = ({ title, option }: { title: string; option: { fee?: number; time?: string } }) => (
  <div className="flex flex-1 flex-col gap-1 rounded-md border border-border bg-page p-4">
    <span className="flex items-center gap-1.5 text-label font-semibold text-ink">
      <MapPin aria-hidden="true" strokeWidth={1.5} className="size-4 text-brand-bright" />
      {title}
    </span>
    <span className="font-heading text-price text-ink">
      {option.fee !== undefined ? formatPrice(option.fee) : "Confirmed by phone"}
    </span>
    <span className="text-label text-ink-muted">{option.time || "Time confirmed by phone"}</span>
  </div>
);

const DeliveryRoute = async () => {
  const settings = await getSettings();
  const phone = normalizeBdPhone(settings.phone);

  return (
    <>
      <SiteHeader leading="back" backHref="/" actions={["cart"]} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-160 flex-col gap-4 px-4 pt-5 pb-10 lg:pt-8 lg:pb-16">
          <div className="flex flex-col gap-1.5">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Delivery" }]} />
            <h1 className="mt-1 text-page-title text-ink lg:text-page-title-lg">Delivery</h1>
            <p className="text-ink-muted">We deliver all over Bangladesh. You pay cash when your order arrives.</p>
          </div>

          <section aria-labelledby="charges-title" className={cardClass}>
            <h2 id="charges-title" className="text-panel-title-lg text-ink">
              Delivery charge and time
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AreaCard title="Inside Dhaka" option={settings.delivery.insideDhaka} />
              <AreaCard title="Outside Dhaka" option={settings.delivery.outsideDhaka} />
            </div>
            <p className="text-label text-ink-muted">
              The delivery charge is added at checkout and paid together with your order, in cash.
            </p>
          </section>

          <section aria-labelledby="how-title" className={cardClass}>
            <h2 id="how-title" className="text-panel-title-lg text-ink">
              How delivery works
            </h2>
            <ol className="flex flex-col gap-4">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                    <step.icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold text-ink">
                      {index + 1}. {step.title}
                    </span>
                    <span className="text-label text-ink-muted">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="times-title" className={cardClass}>
            <h2 id="times-title" className="flex items-center gap-2 text-panel-title-lg text-ink">
              <Clock aria-hidden="true" strokeWidth={1.5} className="size-5.5 text-brand-bright" />
              When it arrives
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink">
              <li>
                Deliveries usually arrive between <strong>10 am and 8 pm</strong>.
              </li>
              <li>
                Delivery times depend on the <strong>delivery service</strong>, so the exact day and time can vary.
              </li>
              <li>Keep your phone nearby: the delivery person may call you when they arrive.</li>
              <li>
                If we can&apos;t reach you to confirm your order, we can&apos;t send it, so please answer our call.
              </li>
            </ul>
          </section>

          <section aria-labelledby="check-title" className={cardClass}>
            <h2 id="check-title" className="flex items-center gap-2 text-panel-title-lg text-ink">
              <PackageCheck aria-hidden="true" strokeWidth={1.5} className="size-5.5 text-brand-bright" />
              Check before you pay
            </h2>
            <p className="text-ink">
              Open the parcel and check your product while the delivery person is there. If you don&apos;t like it or
              it&apos;s faulty, give it back right away. See our{" "}
              <Link href="/policy#returns" className="font-semibold text-brand-bright">
                return policy
              </Link>
              .
            </p>
          </section>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Link href="/track" className={cn(buttonVariants(), "h-12 sm:flex-1")}>
              Track your order
            </Link>
            {phone ? (
              <a href={`tel:+880${phone.slice(1)}`} className={cn(buttonVariants({ variant: "outline" }), "h-12 sm:flex-1")}>
                Call {formatBdPhone(phone)}
              </a>
            ) : (
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }), "h-12 sm:flex-1")}>
                Contact us
              </Link>
            )}
          </div>
        </div>
      </main>
      <SiteFooter variant="minimal" />
    </>
  );
};

export default DeliveryRoute;
