"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

type BrandPanel = {
  slug: string;
  name: string;
  /** Server-rendered product grid for this brand. */
  content: React.ReactNode;
};

type BrandShelfProps = {
  title: string;
  href: string;
  panels: BrandPanel[];
};

const chipClass = (selected: boolean) =>
  cn(
    "inline-flex h-9 shrink-0 items-center rounded-full border px-4 font-heading text-[13px] font-semibold transition-colors duration-150",
    selected
      ? "border-brand-bright bg-brand-tint text-brand-bright"
      : "border-control bg-surface text-ink hover:bg-brand-tint",
  );

// "Shop by brand": chips switch between brand grids. All grids are in the HTML;
// only the selected one is shown.
export const BrandShelf = ({ title, href, panels }: BrandShelfProps) => {
  const [selected, setSelected] = useState(panels[0]?.slug);

  const chips = (
    <div className="flex gap-2 overflow-x-auto scrollbar-none" role="group" aria-label="Choose a brand">
      {panels.map((panel) => (
        <button
          key={panel.slug}
          type="button"
          aria-pressed={panel.slug === selected}
          onClick={() => setSelected(panel.slug)}
          className={chipClass(panel.slug === selected)}
        >
          {panel.name}
        </button>
      ))}
      <Link href={href} className={chipClass(false)}>
        More brands
      </Link>
    </div>
  );

  return (
    <section aria-labelledby="brands-title" className="flex flex-col gap-3.5 px-4 pt-5 pb-2 lg:gap-5 lg:px-0 lg:pt-12">
      <SectionHeader
        id="brands-title"
        title={title}
        href={href}
        actions={<div className="hidden lg:block">{chips}</div>}
      />
      <div className="lg:hidden">{chips}</div>
      {panels.map((panel) => (
        <div key={panel.slug} hidden={panel.slug !== selected}>
          {panel.content}
        </div>
      ))}
    </section>
  );
};
