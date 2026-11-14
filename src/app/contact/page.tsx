import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, Mail, Phone } from "lucide-react";
import { siMessenger, siWhatsapp } from "simple-icons";
import { ContactForm } from "@/components/contact/contact-form";
import { BrandIcon } from "@/components/icons/brand-icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSettings } from "@/lib/data/settings";
import { formatBdPhone, normalizeBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Call us, message us on Facebook or send us a message. Modz Tech delivers all over Bangladesh.",
  alternates: { canonical: "/contact" },
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const cardClass =
  "flex min-h-18 items-center gap-3.5 rounded-lg border border-border bg-surface px-4 py-3 text-ink transition-shadow duration-150";

// Online shop only: no address or map (requirements).
const ContactRoute = async () => {
  const settings = await getSettings();
  const phone = normalizeBdPhone(settings.phone);
  const email = EMAIL.test(settings.email) ? settings.email : null;

  // Placeholder values like "[YOUR PHONE NUMBER]" still show (as text) until the real ones are set.
  const phoneLabel = phone ? formatBdPhone(phone) : settings.phone;

  return (
    <>
      <SiteHeader leading="back" backHref="/" actions={["cart"]} />
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-160 flex-col pb-8 lg:pt-4 lg:pb-16">
          <section className="flex flex-col gap-1.5 px-4 pt-5 pb-2">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
            <h1 className="mt-1 text-page-title text-ink lg:text-page-title-lg">Contact us</h1>
            <p className="text-ink-muted">We&apos;re an online shop, delivering all over Bangladesh.</p>
          </section>

          <section aria-label="Ways to reach us" className="flex flex-col gap-2.5 px-4 pt-3">
            {phoneLabel &&
              (phone ? (
                <a href={`tel:+880${phone.slice(1)}`} className={cn(cardClass, "shadow-card hover:shadow-glow")}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Phone aria-hidden="true" strokeWidth={1.5} className="size-5 text-on-brand" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-heading text-base font-semibold">Call us</span>
                    <span className="font-heading text-[15px] leading-5.5 text-brand-bright">{phoneLabel}</span>
                  </span>
                  <span className="text-small text-ink-muted">Tap to call</span>
                </a>
              ) : (
                <div className={cn(cardClass, "shadow-card")}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand">
                    <Phone aria-hidden="true" strokeWidth={1.5} className="size-5 text-on-brand" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-heading text-base font-semibold">Call us</span>
                    <span className="font-heading text-[15px] leading-5.5 text-ink-muted">{phoneLabel}</span>
                  </span>
                </div>
              ))}

            {settings.messengerUrl && (
              <a
                href={settings.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(cardClass, "hover:shadow-glow")}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                  <BrandIcon icon={siMessenger} className="size-5.5" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-heading text-base font-semibold">Message us on Facebook</span>
                  <span className="text-label text-ink-muted">Fastest reply, via Messenger</span>
                </span>
                <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
              </a>
            )}

            {settings.whatsappUrl && (
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(cardClass, "hover:shadow-glow")}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                  <BrandIcon icon={siWhatsapp} className="size-5.5" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-heading text-base font-semibold">WhatsApp us</span>
                  <span className="text-label text-ink-muted">Chat with us on WhatsApp</span>
                </span>
                <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
              </a>
            )}

            {settings.email &&
              (email ? (
                <a href={`mailto:${email}`} className={cn(cardClass, "hover:shadow-glow")}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                    <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-heading text-base font-semibold">Email</span>
                    <span className="truncate text-label text-brand-bright">{email}</span>
                  </span>
                  <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
                </a>
              ) : (
                <div className={cardClass}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                    <Mail aria-hidden="true" strokeWidth={1.5} className="size-5 text-brand-bright" />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-heading text-base font-semibold">Email</span>
                    <span className="text-label text-ink-muted">{settings.email}</span>
                  </span>
                </div>
              ))}

            {settings.hours && (
              <p className="flex items-center gap-2.5 rounded-md bg-brand-tint p-3 text-label text-ink">
                <Clock aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-brand-bright" />
                <span>
                  <span className="font-semibold">Open every day,</span> {settings.hours}
                </span>
              </p>
            )}
          </section>

          <section
            aria-labelledby="message-title"
            className="mx-4 mt-6 flex flex-col gap-3.5 rounded-lg border border-border bg-surface p-4 lg:p-6"
          >
            <div className="flex flex-col gap-1">
              <h2 id="message-title" className="text-panel-title-lg text-ink">
                Send us a message
              </h2>
              <p className="text-label text-ink-muted">We&apos;ll get back to you by phone.</p>
            </div>
            <ContactForm />
          </section>

          <section aria-labelledby="help-title" className="flex flex-col gap-2.5 px-4 pt-6">
            <h2 id="help-title" className="text-panel-title text-ink">
              Quick help
            </h2>
            {/* Delivery and return policy pages are out of scope for launch; added here when they exist. */}
            <nav aria-labelledby="help-title" className="overflow-hidden rounded-lg border border-border bg-surface">
              {[
                { href: "/track", label: "Track your order" },
                { href: "/shop", label: "Browse all products" },
                { href: "/cart", label: "View your cart" },
              ].map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex min-h-13 items-center justify-between px-4 text-body text-ink hover:bg-brand-tint",
                    index > 0 && "border-t border-border",
                  )}
                >
                  {link.label}
                  <ChevronRight aria-hidden="true" strokeWidth={1.5} className="size-5 text-ink-muted" />
                </Link>
              ))}
            </nav>
          </section>
        </div>
      </main>
      <SiteFooter variant="minimal" />
    </>
  );
};

export default ContactRoute;
