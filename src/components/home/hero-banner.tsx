import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { HeroSlide } from "@/config/hero";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { HeroCarousel } from "./hero-carousel";

type HeroBannerProps = {
  slides: HeroSlide[];
};

// Diagonal chrome-accent light streaks (the brand motif), positioned as in the mockups.
const Streaks = () => (
  <>
    <svg
      aria-hidden="true"
      width="390"
      height="460"
      viewBox="0 0 390 460"
      className="pointer-events-none absolute top-0 left-0 text-chrome-accent lg:hidden"
    >
      <line x1="250" y1="0" x2="120" y2="225" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="390" y1="40" x2="300" y2="196" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 460"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 hidden size-full text-chrome-accent lg:block"
    >
      <line x1="760" y1="0" x2="494" y2="460" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <line x1="1440" y1="60" x2="1210" y2="460" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  </>
);

const Slide = ({ slide, isFirst }: { slide: HeroSlide; isFirst: boolean }) => {
  // Only the first slide carries the page's h1.
  const Heading = isFirst ? "h1" : "h2";

  return (
    <div className="flex flex-col gap-3 px-4 pt-7 pb-3 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-4 lg:py-14 xl:px-0">
      <div className="flex flex-col gap-3 lg:gap-4">
        <div className="flex items-center gap-2.5 lg:gap-3">
          <span className="eyebrow text-chrome-silver">{slide.eyebrow}</span>
          {slide.badge && (
            <span className="rounded-full bg-offer-chrome px-2.5 py-0.75 font-heading text-small font-semibold text-on-offer lg:px-3 lg:py-1">
              {slide.badge}
            </span>
          )}
        </div>

        <Heading className="text-hero text-on-chrome lg:text-hero-lg lg:tracking-[-0.03em]">
          {slide.headline.map((line, index) => (
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </Heading>

        <p className="text-on-chrome-muted lg:text-lead">
          <span className="lg:hidden">{slide.description}</span>
          <span className="hidden lg:inline">{slide.descriptionLong ?? slide.description}</span>
          {slide.price !== undefined && (
            <>
              {" "}
              Now <span className="font-heading font-bold text-on-chrome">{formatPrice(slide.price)}</span>
              {slide.oldPrice !== undefined && (
                <>
                  , was <s className="font-heading">{formatPrice(slide.oldPrice)}</s>
                </>
              )}
              .
            </>
          )}
        </p>

        <div className="flex gap-3 lg:mt-2">
          <Link href={slide.cta.href} className={cn(buttonVariants(), "lg:h-12 lg:px-7")}>
            {slide.cta.label}
          </Link>
          <Link
            href="/shop?sale=1"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden h-12 border-chrome-control bg-transparent px-6 text-on-chrome hover:bg-chrome-surface lg:inline-flex",
            )}
          >
            See all offers
          </Link>
        </div>
      </div>

      <div className="relative mt-2 h-60 w-full overflow-hidden rounded-lg lg:mt-0 lg:h-90">
        <Image
          src={slide.image.src}
          alt={slide.image.alt}
          fill
          preload={isFirst}
          sizes="(min-width: 1200px) 576px, (min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: slide.image.position ?? "center" }}
        />
      </div>
    </div>
  );
};

export const HeroBanner = ({ slides }: HeroBannerProps) => {
  if (slides.length === 0) return null;

  return (
    <section className="mz-chrome relative overflow-hidden bg-chrome text-on-chrome">
      <Streaks />
      <div className="relative mx-auto max-w-content">
        <HeroCarousel label="Featured offers">
          {slides.map((slide, index) => (
            <Slide key={slide.id} slide={slide} isFirst={index === 0} />
          ))}
        </HeroCarousel>
      </div>
    </section>
  );
};
