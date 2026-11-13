import Link from "next/link";
import { Menu } from "lucide-react";
import type { CategoryItem } from "@/lib/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const helpLinks = [
  { href: "/track", label: "Track order" },
  { href: "/contact", label: "Contact us" },
  { href: "/login", label: "Log in" },
];

const MenuLink = ({ href, children, offer = false }: { href: string; children: React.ReactNode; offer?: boolean }) => (
  <SheetClose asChild>
    <Link
      href={href}
      className={
        offer
          ? "flex h-12 items-center rounded-md px-4 font-semibold text-offer-ink hover:bg-brand-tint"
          : "flex h-12 items-center rounded-md px-4 font-medium text-ink hover:bg-brand-tint"
      }
    >
      {children}
    </Link>
  </SheetClose>
);

// Mobile-only menu drawer (no mockup for its contents: plain list on a light sheet).
export const MobileMenu = ({ categories }: { categories: CategoryItem[] }) => (
  <Sheet>
    <SheetTrigger
      aria-label="Menu"
      className="flex size-11 items-center justify-center rounded-md text-chrome-silver"
    >
      <Menu aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
    </SheetTrigger>
    <SheetContent side="left" className="w-[85%] gap-0 overflow-y-auto bg-surface p-0">
      <SheetHeader className="border-b border-border px-4 py-4">
        <SheetTitle className="font-heading text-panel-title font-bold tracking-[-0.02em] text-ink">
          Menu
        </SheetTitle>
        <SheetDescription className="sr-only">Shop categories and help links</SheetDescription>
      </SheetHeader>
      <nav aria-label="Menu" className="flex flex-col gap-4 px-2 py-4">
        <div className="flex flex-col">
          <span className="eyebrow px-4 pb-2 text-silver">Shop</span>
          <MenuLink href="/shop">All products</MenuLink>
          {categories.map((category) => (
            <MenuLink key={category.slug} href={`/category/${category.slug}`}>
              {category.name}
            </MenuLink>
          ))}
          <MenuLink href="/shop?sale=1" offer>
            Offers
          </MenuLink>
        </div>
        <div className="flex flex-col border-t border-border pt-4">
          <span className="eyebrow px-4 pb-2 text-silver">Help</span>
          {helpLinks.map((link) => (
            <MenuLink key={link.href} href={link.href}>
              {link.label}
            </MenuLink>
          ))}
        </div>
      </nav>
    </SheetContent>
  </Sheet>
);
