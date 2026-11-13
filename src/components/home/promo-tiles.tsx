import Image from "next/image";
import Link from "next/link";

type PromoTile = { href: string; src: string; alt: string };

// Marketing posters, 2 × 2 on phones, 4 across on desktop.
export const PromoTiles = ({ tiles }: { tiles: PromoTile[] }) => (
  <section aria-label="Featured products" className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4 lg:gap-6 lg:px-0 lg:pt-12 lg:pb-2">
    {tiles.map((tile) => (
      <Link
        key={tile.href}
        href={tile.href}
        className="relative block aspect-4/5 overflow-hidden rounded-lg transition-shadow duration-150 hover:shadow-glow"
      >
        <Image
          src={tile.src}
          alt={tile.alt}
          fill
          sizes="(min-width: 1200px) 282px, (min-width: 1024px) 24vw, 50vw"
          className="object-cover"
        />
      </Link>
    ))}
  </section>
);
