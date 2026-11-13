import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";
import { Logo } from "./logo";

// Minimal header for checkout: no search, no nav.
export const CheckoutHeader = () => (
  <header className="mz-chrome border-b border-chrome-border bg-chrome">
    <div className="mx-auto flex max-w-content items-center gap-2 px-3 py-2.5 lg:gap-6 lg:px-4 lg:py-3.5 xl:px-0">
      <Link
        href="/cart"
        aria-label="Back to cart"
        className="flex size-11 items-center justify-center rounded-md text-chrome-silver lg:hidden"
      >
        <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
      </Link>
      <Logo eager className="h-8 lg:h-11" />
      <span className="ml-auto inline-flex items-center gap-1.5 pr-2 text-small text-on-chrome-muted lg:gap-2 lg:pr-0 lg:text-label">
        <Lock aria-hidden="true" strokeWidth={1.5} className="size-4" />
        Secure checkout
      </span>
      <Link
        href="/cart"
        className="hidden rounded-sm text-label font-medium text-chrome-silver hover:text-on-chrome lg:inline"
      >
        Back to cart
      </Link>
    </div>
  </header>
);
