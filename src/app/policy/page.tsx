import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck, RotateCcw, ShieldCheck, ShieldOff, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSettings } from "@/lib/data/settings";
import { formatPrice } from "@/lib/format";
import { formatBdPhone, normalizeBdPhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: "Return, warranty, delivery and privacy policy",
  description:
    "How returns, delivery and your personal information work at Modz Tech. Cash on delivery all over Bangladesh.",
  alternates: { canonical: "/policy" },
};

// Change this date whenever the policy text changes.
const LAST_UPDATED = "15 November 2026";

const sections = [
  { id: "returns", label: "Returns", icon: RotateCcw },
  { id: "warranty", label: "Warranty", icon: ShieldOff },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "privacy", label: "Privacy", icon: ShieldCheck },
] as const;

const Section = ({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: (typeof sections)[number]["icon"];
  children: React.ReactNode;
}) => (
  // scroll-mt: links like /policy#delivery stop below the sticky phone header.
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="flex scroll-mt-20 flex-col gap-3 rounded-lg border border-border bg-surface p-4 lg:scroll-mt-6 lg:p-6"
  >
    <h2 id={`${id}-title`} className="flex items-center gap-2.5 text-panel-title-lg text-ink">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-tint">
        <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
      </span>
      {title}
    </h2>
    <div className="flex flex-col gap-3 text-ink [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-5">
      {children}
    </div>
  </section>
);

const deliveryLine = (label: string, option: { fee?: number; time?: string }) => {
  const parts = [option.fee !== undefined ? formatPrice(option.fee) : null, option.time || null].filter(Boolean);
  return parts.length > 0 ? `${label}: ${parts.join(", ")}` : null;
};

const PolicyRoute = async () => {
  const settings = await getSettings();
  const phone = normalizeBdPhone(settings.phone);
  const contact = (
    <>
      {phone ? (
        <>
          call us on{" "}
          <a href={`tel:+880${phone.slice(1)}`} className="font-semibold whitespace-nowrap text-brand-bright">
            {formatBdPhone(phone)}
          </a>{" "}
          or{" "}
        </>
      ) : null}
      <Link href="/contact" className="font-semibold text-brand-bright">
        contact us
      </Link>
    </>
  );
  const deliveryLines = [
    deliveryLine("Inside Dhaka", settings.delivery.insideDhaka),
    deliveryLine("Outside Dhaka", settings.delivery.outsideDhaka),
  ].filter((line) => line !== null);

  return (
    <>
      <SiteHeader leading="back" backHref="/" actions={["cart"]} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-160 flex-col gap-4 px-4 pt-5 pb-10 lg:pt-8 lg:pb-16">
          <div className="flex flex-col gap-1.5">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Policy" }]} />
            <h1 className="mt-1 text-page-title text-ink lg:text-page-title-lg">Our policy</h1>
            <p className="text-ink-muted">Returns, warranty, delivery and your privacy. Last updated {LAST_UPDATED}.</p>
          </div>

          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-control bg-surface px-3.5 text-label font-medium text-ink hover:bg-brand-tint"
              >
                <section.icon aria-hidden="true" strokeWidth={1.5} className="size-4 text-brand-bright" />
                {section.label}
              </a>
            ))}
          </nav>

          <p className="flex items-start gap-2.5 rounded-md bg-brand-tint p-3 text-label text-ink">
            <PackageCheck aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-brand-bright" />
            <span>
              <span className="font-semibold">Check your product before the delivery person leaves.</span> Returns are
              only possible on the spot, not after they&apos;ve gone.
            </span>
          </p>

          <Section id="returns" title="Returns" icon={RotateCcw}>
            <p>
              If you don&apos;t like the product, or it&apos;s faulty, you can return it{" "}
              <strong>right away when you receive it</strong>.
            </p>
            <ul>
              <li>Check the product as soon as the delivery person hands it to you.</li>
              <li>If you don&apos;t want to keep it, give it back to the delivery person straight away.</li>
              <li>Please return it complete: with the box, accessories and anything else that came with it.</li>
              <li>
                If you return it, you still <strong>pay the delivery charge</strong>. You don&apos;t pay for the product.
              </li>
              <li>
                <strong>Returns are only accepted while the delivery person is there.</strong> Once they leave, we
                can&apos;t accept a return, even if you find a fault later.
              </li>
            </ul>
            <p>Questions about a return? Please {contact}.</p>
          </Section>

          <Section id="warranty" title="Warranty" icon={ShieldOff}>
            <p>
              Our products <strong>don&apos;t come with a warranty</strong> at the moment.
            </p>
            <p>
              That&apos;s why it matters to check your product while the delivery person is there: if it&apos;s
              faulty, return it right away (see{" "}
              <a href="#returns" className="font-semibold text-brand-bright">
                Returns
              </a>
              ).
            </p>
          </Section>

          <Section id="delivery" title="Delivery" icon={Truck}>
            <p>We deliver all over Bangladesh, and you pay cash on delivery.</p>
            <ul>
              <li>
                We send orders through delivery services, so <strong>delivery times depend on the delivery service</strong>.
              </li>
              <li>
                Deliveries usually arrive between <strong>10 am and 8 pm</strong>.
              </li>
              <li>We call you to confirm your order before we send it.</li>
              {deliveryLines.length > 0 && (
                <li>
                  Delivery charge and usual time:
                  <ul className="mt-1.5">
                    {deliveryLines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
            <p>
              More details on the{" "}
              <Link href="/delivery" className="font-semibold text-brand-bright">
                Delivery
              </Link>{" "}
              page. You can see where your order is on the{" "}
              <Link href="/track" className="font-semibold text-brand-bright">
                Track order
              </Link>{" "}
              page.
            </p>
          </Section>

          <Section id="privacy" title="Privacy" icon={ShieldCheck}>
            <p>We only collect what we need to deliver your order and to run the shop.</p>
            <h3 className="text-body font-semibold text-ink">What we collect</h3>
            <ul>
              <li>
                <strong>When you order:</strong> your name, phone number, delivery address, district, and your email and
                note if you add them.
              </li>
              <li>
                <strong>If you create an account:</strong> your name and phone number, or your name and email from
                Google if you sign in with Google. Passwords are stored encrypted; we can&apos;t see them.
              </li>
              <li>
                <strong>When you send us a message:</strong> your name, phone number and message.
              </li>
            </ul>
            <h3 className="text-body font-semibold text-ink">How we use it</h3>
            <ul>
              <li>To confirm, pack and deliver your order, and to call you about it.</li>
              <li>Our staff get new orders and messages in a private Telegram group, so we can reply quickly.</li>
              <li>We share your name, phone number and address with the delivery service, only to deliver your order.</li>
              <li>We never sell your information.</li>
            </ul>
            <h3 className="text-body font-semibold text-ink">Cookies and analytics</h3>
            <ul>
              <li>Your cart is saved in your own browser, and a cookie keeps you signed in.</li>
              <li>
                We use <strong>Microsoft Clarity</strong> to see how people use the site (for example, which buttons are
                hard to find) so we can improve it.
              </li>
              <li>
                We use the <strong>Facebook (Meta) Pixel</strong> to measure our Facebook ads, for example how many
                visitors place an order.
              </li>
              <li>These services use cookies. You can block or clear cookies in your browser settings.</li>
            </ul>
            <p>Want to see, change or delete your information? Please {contact} and we&apos;ll help.</p>
          </Section>
        </div>
      </main>
      <SiteFooter variant="minimal" />
    </>
  );
};

export default PolicyRoute;
