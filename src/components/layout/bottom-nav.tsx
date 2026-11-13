import Link from "next/link";
import { House, LayoutGrid, MessageCircle, ShoppingCart } from "lucide-react";
import { getSettings } from "@/lib/data/settings";
import { cn } from "@/lib/utils";

type BottomNavProps = {
  current?: "home" | "categories" | "cart";
};

const itemClass = (active: boolean) =>
  cn(
    "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md py-1 text-small font-medium",
    active ? "text-chrome-accent" : "text-chrome-silver",
  );

const iconProps = { "aria-hidden": true, strokeWidth: 1.5, className: "size-5.5" } as const;

// Mobile-only sticky bottom nav (home and shop pages). Put it last in the page.
export const BottomNav = async ({ current }: BottomNavProps) => {
  const { messengerUrl } = await getSettings();

  return (
    <nav
      aria-label="Main"
      className="mz-chrome sticky bottom-0 z-40 grid grid-cols-4 border-t border-chrome-border bg-chrome pt-1.5 pb-[max(10px,env(safe-area-inset-bottom))] lg:hidden"
    >
      <Link href="/" aria-current={current === "home" ? "page" : undefined} className={itemClass(current === "home")}>
        <House {...iconProps} />
        Home
      </Link>
      <Link
        href="/shop"
        aria-current={current === "categories" ? "page" : undefined}
        className={itemClass(current === "categories")}
      >
        <LayoutGrid {...iconProps} />
        Categories
      </Link>
      <Link
        href="/cart"
        aria-current={current === "cart" ? "page" : undefined}
        className={itemClass(current === "cart")}
      >
        <ShoppingCart {...iconProps} />
        Cart
      </Link>
      <a href={messengerUrl || "/contact"} target="_blank" rel="noopener noreferrer" className={itemClass(false)}>
        <MessageCircle {...iconProps} />
        Message us
      </a>
    </nav>
  );
};
