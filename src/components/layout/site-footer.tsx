import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getCurrentYear } from "@/lib/date";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

/**
 * full     – home: newsletter, brand, contact, links (desktop: 4 columns)
 * compact  – shop / product: brand, contact, links (desktop: one row)
 * minimal  – cart, contact, track, 404, ...: two short lines (desktop: one row)
 * checkout – checkout: help line (desktop: one short row)
 */
type FooterVariant = "full" | "compact" | "minimal" | "checkout";

type SiteFooterProps = {
  variant?: FooterVariant;
  className?: string;
};

// Policy pages are out of scope for launch; these links 404 until they exist.
const policyLinks = [
  { href: "/delivery-policy", label: "Delivery policy" },
  { href: "/return-policy", label: "Return policy" },
];

const helpLinks = [
  { href: "/track", label: "Track order" },
  ...policyLinks,
  { href: "/contact", label: "Contact us" },
];

const mobileFullLinks = [...policyLinks, { href: "/track", label: "Track order" }, { href: "/contact", label: "Contact us" }];

const shopLinks = [
  { href: "/shop", label: "All products" },
  { href: "/shop?sale=1", label: "Offers" },
  { href: "/shop?sort=newest", label: "New arrivals" },
];

const linkLight = "rounded-sm text-on-chrome hover:text-chrome-accent";
const linkMuted = "rounded-sm text-on-chrome-muted hover:text-on-chrome";
const linkAccent = "rounded-sm text-chrome-accent hover:text-on-chrome";

const FacebookLink = ({ className }: { className?: string }) => (
  <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className={className ?? linkAccent}>
    {siteConfig.facebookLabel}
  </a>
);

// Single-row desktop footer used by every variant except "full".
const DesktopRow = () => (
  <div className="mx-auto hidden max-w-content items-center gap-8 px-4 py-7 text-label text-on-chrome-muted lg:flex xl:px-0">
    <Logo className="h-10" />
    <span>Online only · Cash on delivery all over Bangladesh</span>
    <span className="ml-auto flex gap-5">
      <Link href="/track" className={linkLight}>
        Track order
      </Link>
      <Link href="/contact" className={linkLight}>
        Contact us
      </Link>
      <FacebookLink />
    </span>
  </div>
);

const FullFooter = ({ year }: { year: number }) => (
  <>
    {/* Mobile */}
    <div className="flex flex-col gap-5 px-4 pt-8 pb-6 lg:hidden">
      <div className="flex flex-col gap-2.5">
        <h2 className="text-panel-title font-semibold tracking-[-0.01em] text-on-chrome">Get offers first</h2>
        <NewsletterForm />
      </div>
      <Logo className="h-12 self-start" />
      <p className="text-chrome-silver">{siteConfig.tagline}</p>
      <div className="flex flex-col gap-1 text-label leading-5.5 text-on-chrome-muted">
        <span>Phone: {siteConfig.phone}</span>
        <span>Dhaka, Bangladesh</span>
        <FacebookLink className={cn(linkAccent, "self-start")} />
      </div>
      <nav
        aria-label="Footer"
        className="grid grid-cols-2 gap-2 border-t border-chrome-border pt-4 text-label leading-5.5"
      >
        {mobileFullLinks.map((link) => (
          <Link key={link.href} href={link.href} className={cn(linkLight, "py-1.5")}>
            {link.label}
          </Link>
        ))}
      </nav>
      <span className="text-small text-on-chrome-muted">Cash on delivery available · © {year} Modz Tech</span>
    </div>

    {/* Desktop */}
    <div className="hidden lg:block">
      <div className="mx-auto grid max-w-content grid-cols-[2fr_1fr_1fr_1.4fr] gap-10 px-4 pt-12 pb-8 xl:px-0">
        <div className="flex flex-col gap-3.5">
          <Logo className="h-13 self-start" />
          <p className="text-chrome-silver">{siteConfig.tagline}</p>
          <p className="text-label leading-5.5 text-on-chrome-muted">
            Online only. Cash on delivery all over Bangladesh.
          </p>
        </div>
        <nav aria-label="Shop" className="flex flex-col gap-2.5 text-label">
          <h2 className="text-body font-semibold tracking-normal text-on-chrome">Shop</h2>
          {shopLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn(linkMuted, "self-start")}>
              {link.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Help" className="flex flex-col gap-2.5 text-label">
          <h2 className="text-body font-semibold tracking-normal text-on-chrome">Help</h2>
          {helpLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn(linkMuted, "self-start")}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5 text-label">
          <h2 className="text-body font-semibold tracking-normal text-on-chrome">Get offers first</h2>
          <NewsletterForm />
          <span className="text-on-chrome-muted">Phone: {siteConfig.phone}</span>
          <FacebookLink className={cn(linkAccent, "self-start")} />
        </div>
      </div>
      <div className="border-t border-chrome-border">
        <div className="mx-auto max-w-content px-4 py-4 text-small-lg text-on-chrome-muted xl:px-0">
          © {year} Modz Tech
        </div>
      </div>
    </div>
  </>
);

const CompactFooter = ({ year }: { year: number }) => (
  <>
    <div className="flex flex-col gap-4 px-4 pt-7 pb-6 lg:hidden">
      <Logo className="h-11 self-start" />
      <p className="text-chrome-silver">{siteConfig.tagline}</p>
      <div className="flex flex-col gap-1 text-label leading-5.5 text-on-chrome-muted">
        <span>Phone: {siteConfig.phone}</span>
        <FacebookLink className={cn(linkAccent, "self-start")} />
      </div>
      <nav
        aria-label="Footer"
        className="flex flex-wrap gap-x-4 gap-y-2 border-t border-chrome-border pt-4 text-label leading-5.5"
      >
        {helpLinks.map((link) => (
          <Link key={link.href} href={link.href} className={cn(linkLight, "py-1.5")}>
            {link.label}
          </Link>
        ))}
      </nav>
      <span className="text-small text-on-chrome-muted">Cash on delivery available · © {year} Modz Tech</span>
    </div>
    <DesktopRow />
  </>
);

const MinimalFooter = ({ year }: { year: number }) => (
  <>
    <div className="flex flex-col gap-2 px-4 pt-6 pb-5 text-small text-on-chrome-muted lg:hidden">
      <span>
        Phone: {siteConfig.phone} · <FacebookLink />
      </span>
      <span>
        <Link href="/contact" className={linkAccent}>
          Contact us
        </Link>{" "}
        · © {year} Modz Tech
      </span>
    </div>
    <DesktopRow />
  </>
);

const CheckoutFooter = ({ year }: { year: number }) => (
  <>
    <div className="flex flex-col gap-2 px-4 pt-6 pb-5 text-small text-on-chrome-muted lg:hidden">
      <span>Need help? Call {siteConfig.phone} or message us on Facebook.</span>
      <span>
        <Link href="/contact" className={linkAccent}>
          Contact us
        </Link>{" "}
        · © {year} Modz Tech
      </span>
    </div>
    <div className="mx-auto hidden max-w-content items-center gap-6 px-4 py-5 text-small-lg text-on-chrome-muted lg:flex xl:px-0">
      <span>© {year} Modz Tech · Online only · Cash on delivery all over Bangladesh</span>
      <Link href="/contact" className={cn(linkAccent, "ml-auto")}>
        Contact us
      </Link>
    </div>
  </>
);

const variants = {
  full: FullFooter,
  compact: CompactFooter,
  minimal: MinimalFooter,
  checkout: CheckoutFooter,
} satisfies Record<FooterVariant, (props: { year: number }) => React.ReactNode>;

export const SiteFooter = async ({ variant = "minimal", className }: SiteFooterProps) => {
  const year = await getCurrentYear();
  const Variant = variants[variant];

  return (
    <footer className={cn("mz-chrome bg-chrome text-on-chrome", className)}>
      <Variant year={year} />
    </footer>
  );
};
