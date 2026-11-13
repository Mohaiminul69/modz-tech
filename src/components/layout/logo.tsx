import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Wrap in a link to the home page. */
  link?: boolean;
  /** Load immediately (above the fold). */
  eager?: boolean;
};

// Transparent PNG with silver letters: only readable inside dark brand zones.
// Source is 1914×822; width/height here set the aspect ratio and keep the served file small.
export const Logo = ({ className, link = true, eager = false }: LogoProps) => {
  const image = (
    <Image
      src="/brand/modz-tech-logo.png"
      alt="Modz Tech"
      width={160}
      height={69}
      loading={eager ? "eager" : undefined}
      className={cn("block h-8 w-auto", className)}
    />
  );

  if (!link) return image;

  return (
    <Link href="/" aria-label="Modz Tech home" className="shrink-0 rounded-sm">
      {image}
    </Link>
  );
};
