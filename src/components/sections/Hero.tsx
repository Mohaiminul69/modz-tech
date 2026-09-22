import Image from "next/image";
import Link from "next/link";
import { PiArrowRight } from "react-icons/pi";
import heroProduct from "@public/products/hero-section-product.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-bg md:flex md:min-h-[calc(100vh-4rem)] md:items-center">
      <div
        className="pointer-events-none absolute left-1/2 top-[-180px] h-[520px] w-[900px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(47,127,212,.22), transparent 68%)",
        }}
      />

      <div
        className="relative mx-auto grid w-full max-w-[1680px] items-center gap-[clamp(32px,5vw,72px)] px-[clamp(20px,4vw,64px)] py-[clamp(40px,6vh,96px)]"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))" }}
      >
        {/* Left column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(106,169,233,.3)] bg-[rgba(47,127,212,.08)] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(47,127,212,.8)]" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-tint">
              Autumn Collection · 2026
            </span>
          </span>

          <h1
            className="mt-6 max-w-xl font-heading text-[clamp(40px,5.4vw,74px)] font-bold leading-[1.02] tracking-[-0.035em]"
            style={{
              background: "linear-gradient(180deg,#fff 30%,#a8b4c4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Technology that
            <br />
            fits your lifestyle.
          </h1>

          <p className="mt-5 max-w-[480px] font-body text-[16px] leading-relaxed text-snow/62">
            Audio, power, and everyday-carry pieces we&apos;d use ourselves —
            tested for weeks before they ship, never restocked with filler.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="bg-brand-gradient inline-flex w-65 items-center justify-center gap-2 rounded-xl px-7 py-3.75 font-body text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(47,127,212,.35)] transition-[filter] hover:brightness-[1.08]"
            >
              Shop the collection
              <PiArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop/hoco-eq-34-plus"
              className="inline-flex w-65 items-center justify-center rounded-xl border border-white/16 px-7 py-3.75 font-body text-[14px] font-bold text-snow transition-colors hover:bg-white/6"
            >
              See the new Hoco EQ 34 Plus
            </Link>
          </div>
        </div>

        {/* Right column: media well (capped on desktop so it can never push the
            hero taller than the viewport below the navbar) */}
        <div
          className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/9 md:aspect-auto md:ml-auto md:h-[min(64vh,620px)] md:w-[min(64vh,620px)]"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(47,127,212,.18), rgba(255,255,255,.02) 60%), #0b0e13",
          }}
        >
          <Image
            src={heroProduct}
            alt="Hoco EQ 34 Plus — ANC+ENC TWS earbuds with charging case"
            fill
            sizes="(min-width: 768px) 620px, 100vw"
            className="object-cover"
            priority
          />

          <div className="absolute bottom-[22px] left-[22px] flex items-center gap-3 rounded-2xl border border-white/10 bg-[rgba(9,11,15,.78)] px-4 py-3 backdrop-blur-[14px]">
            <div>
              <div className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-accent-tint">
                New
              </div>
              <div className="font-heading text-[15px] font-semibold text-snow">
                Hoco EQ 34 Plus
              </div>
            </div>
            <span className="h-8 w-px bg-white/12" />
            <div className="font-heading text-[15px] font-semibold text-accent">
              ৳729
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
