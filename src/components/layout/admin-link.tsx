"use client";

import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

/*
 * "Admin" link in the site header, shown only to signed-in admins.
 * (Convenience only: the admin pages and actions check the role on the server.)
 */
export const AdminLink = ({ variant }: { variant: "icon" | "text" }) => {
  const { data: session } = authClient.useSession();
  if (session?.user.role !== "admin") return null;

  if (variant === "icon") {
    return (
      <Link
        href="/admin/orders"
        aria-label="Admin panel"
        className="flex size-11 items-center justify-center rounded-md text-chrome-accent"
      >
        <LayoutDashboard aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
      </Link>
    );
  }

  return (
    <Link
      href="/admin/orders"
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-md border border-chrome-accent/60 px-3 text-label font-semibold text-chrome-accent hover:bg-chrome-surface",
      )}
    >
      <LayoutDashboard aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
      Admin
    </Link>
  );
};
