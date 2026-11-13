import Link from "next/link";
import type { CategoryItem } from "@/lib/types";
import { SectionHeader } from "./section-header";

// Small custom line icons from the mockup (Lucide has no close match for most of these).
// Keys match Category.icon in the database; unknown keys fall back to "box".
const icons: Record<string, string> = {
  box: "M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8",
  earbuds: "M7 4a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3V4zM7 14v5M17 4a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3V4zM17 14v5",
  "earbud-covers": "M6 8a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4zM6 11h12",
  speakers: "M3 11a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM8 7V5h8v2M9 13h.01M15 13h.01",
  karaoke: "M14 4a5 5 0 1 1 6 6M14 4l-9.5 11.5 4 4L20 10M7 17l-3 3",
  microphones: "M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0zM5 10a7 7 0 0 0 14 0M12 17v5",
  "smart-watches":
    "M6 9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3zM9 6V2h6v4M9 18v4h6v-4M12 10v2l1.5 1.5",
  trackers: "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 2v2",
  adapters: "M8 3v4M16 3v4M6 7h12v4a6 6 0 0 1-12 0zM12 17v4",
  chargers: "M13 2 4 14h7l-1 8 9-12h-7z",
  offers: "M20 12 12 20 4 12V4h8zM8 8h.01",
};

const CategoryIcon = ({ path, className }: { path: string; className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
);

// Phones: round icons in a 5 × 2 grid. Desktop: 10 white tiles in a row.
export const CategoryGrid = ({ categories }: { categories: CategoryItem[] }) => {
  const tiles = [
    ...categories.map((category) => ({
      key: category.slug,
      icon: category.icon,
      label: category.shortName,
      href: `/category/${category.slug}`,
    })),
    { key: "offers", icon: "offers", label: "Offers", href: "/shop?sale=1" },
  ];

  return (
    <section aria-labelledby="categories-title" className="flex flex-col gap-4 pt-7 pb-2 lg:gap-5 lg:pt-12">
      <div className="px-4 lg:px-0">
        <SectionHeader id="categories-title" title="Shop by category" href="/shop" />
      </div>
      <ul className="grid grid-cols-5 gap-x-1 gap-y-4 px-3 lg:grid-cols-10 lg:gap-3 lg:px-0">
        {tiles.map((tile) => (
          <li key={tile.key}>
            <Link
              href={tile.href}
              className="group flex flex-col items-center gap-1.5 rounded-md text-ink lg:gap-2.5 lg:rounded-lg lg:border lg:border-border lg:bg-surface lg:px-1 lg:py-4 lg:transition-shadow lg:duration-150 lg:hover:shadow-glow"
            >
              <span className="flex size-14 items-center justify-center rounded-full border border-border bg-surface text-silver transition-colors duration-150 group-hover:text-brand-bright lg:border-0 lg:bg-media-frame">
                <CategoryIcon path={icons[tile.icon] ?? icons.box} className="size-6.5 lg:size-7" />
              </span>
              <span className="text-small font-medium whitespace-nowrap lg:text-small-lg">{tile.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
