"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NotFound = () => {
  const pathname = usePathname();
  const label = pathname.replace("/", "") || "page";

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-[clamp(20px,4vw,64px)] py-[clamp(80px,10vw,140px)] text-center">
      <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent-tint">
        Coming soon
      </span>
      <h1
        className="mt-4 font-heading text-[clamp(30px,4vw,48px)] font-bold uppercase leading-[1.05] tracking-[-0.03em]"
        style={{
          background: "linear-gradient(180deg,#fff 30%,#a8b4c4 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {label}
      </h1>
      <p className="mt-4 max-w-sm font-body text-[14.5px] leading-relaxed text-snow/60">
        We&apos;re still building this page. Check back soon, or head back to the homepage.
      </p>
      <Link
        href="/"
        className="bg-brand-gradient mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-[13.5px] font-bold text-white shadow-[0_10px_28px_rgba(47,127,212,.3)] transition-[filter] hover:brightness-[1.08]"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;
