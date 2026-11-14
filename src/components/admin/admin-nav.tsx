"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Mail, Package, Settings, ShoppingBag } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: LayoutGrid },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

// Scrolls sideways on phones; a row of tabs on desktop. `pathname` "" = nothing highlighted.
export const AdminNavLinks = ({ pathname }: { pathname: string }) => {
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto scrollbar-none">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname !== "" && (pathname === href || pathname.startsWith(`${href}/`));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-11 shrink-0 items-center gap-2 rounded-md px-3 text-label font-semibold",
              active ? "bg-brand-tint text-brand-bright" : "text-ink-muted hover:bg-media-frame hover:text-ink",
            )}
          >
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

// Reads the URL, so the layout renders it inside <Suspense> (fallback: AdminNavLinks without highlight).
export const AdminNav = () => <AdminNavLinks pathname={usePathname()} />;

export const SignOutButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.replace("/admin/login");
        router.refresh();
      }}
      className="flex h-10 items-center gap-1.5 rounded-md px-2 text-label font-semibold text-ink-muted hover:text-ink"
    >
      <LogOut aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
      Sign out
    </button>
  );
};
