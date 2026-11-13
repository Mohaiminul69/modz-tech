import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { SaleBanner as SaleBannerData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Countdown } from "./countdown";

// Dark promo band: full-bleed on phones, rounded card inside the content width on desktop.
export const SaleBanner = ({ badge, title, description, cta, endsAt, image }: SaleBannerData) => (
  <section
    aria-labelledby="sale-title"
    className="mz-chrome relative my-4 flex items-center gap-4 overflow-hidden bg-chrome px-4 py-6 text-on-chrome lg:my-0 lg:mt-12 lg:gap-10 lg:rounded-2xl lg:px-12 lg:py-10"
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 260"
      preserveAspectRatio="xMinYMin slice"
      className="pointer-events-none absolute inset-0 hidden size-full text-chrome-accent lg:block"
    >
      <line x1="640" y1="260" x2="790" y2="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    </svg>
    <svg
      aria-hidden="true"
      width="390"
      height="220"
      viewBox="0 0 390 220"
      className="pointer-events-none absolute top-0 left-0 text-chrome-accent lg:hidden"
    >
      <line x1="200" y1="220" x2="327" y2="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>

    <div className="relative flex flex-1 flex-col gap-2 lg:gap-3">
      <span className="self-start rounded-sm bg-offer-chrome px-2 py-0.5 font-heading text-[11px] leading-4 font-semibold text-on-offer lg:px-2.5 lg:py-0.75 lg:text-small">
        {badge}
      </span>
      <h2 id="sale-title" className="text-section text-on-chrome lg:text-promo-lg">
        {/* On phones the whole banner is the link (the mockup has no button there). */}
        <Link href={cta.href} className="rounded-sm after:absolute after:inset-0 after:content-[''] lg:after:hidden">
          {title}
        </Link>
      </h2>
      <p className="text-on-chrome-muted lg:text-lead">{description}</p>
      <div className="flex items-center gap-3 lg:mt-2">
        <Link href={cta.href} className={cn(buttonVariants(), "hidden h-12 px-6 lg:inline-flex")}>
          {cta.label}
        </Link>
        {endsAt && <Countdown endsAt={endsAt} className="self-start lg:self-center" />}
      </div>
    </div>

    <div className="relative size-35 shrink-0 overflow-hidden rounded-lg lg:h-55 lg:w-95">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 380px, 140px"
        className="object-cover"
        style={{ objectPosition: image.position ?? "center" }}
      />
    </div>
  </section>
);
