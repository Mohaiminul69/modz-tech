import type { SimpleIcon } from "simple-icons";
import { cn } from "@/lib/utils";

/*
 * Official brand mark from Simple Icons (Lucide has no brand logos).
 * Brand logos keep their own colours by design; they are not theme tokens.
 */
export const BrandIcon = ({
  icon,
  className,
  colored = true,
}: {
  icon: SimpleIcon;
  className?: string;
  /** false = use the current text colour instead of the brand colour. */
  colored?: boolean;
}) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className={cn("size-5", className)}
    fill={colored ? `#${icon.hex}` : "currentColor"}
  >
    <path d={icon.path} />
  </svg>
);
