import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminNav, AdminNavLinks, SignOutButton } from "@/components/admin/admin-nav";
import { requireAdminPage } from "@/lib/admin-auth";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Modz Tech admin" },
  robots: { index: false, follow: false },
};

// Checks the session before rendering anything below it (each page checks again too).
const AdminGate = async ({ children }: { children: React.ReactNode }) => {
  const session = await requireAdminPage();
  return (
    <>
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface px-4 py-1 lg:px-6">
        <span className="truncate text-small text-ink-muted">Signed in as {session.user.email}</span>
        <SignOutButton />
      </div>
      {children}
    </>
  );
};

const Loading = () => (
  <div aria-busy="true" className="flex flex-col gap-3 p-4 lg:p-6">
    <span className="sr-only">Loading…</span>
    <div className="h-8 w-48 animate-pulse rounded-md bg-media-frame" />
    <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
  </div>
);

// Plain admin shell: light, no dark brand zones, works on phones.
const AdminLayout = ({ children }: LayoutProps<"/admin">) => (
  <div className="flex min-h-full flex-1 flex-col bg-background">
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-content flex-col gap-1 px-4 py-2 lg:flex-row lg:items-center lg:gap-6 lg:px-6">
        <Link href="/admin/orders" className="flex h-10 items-center gap-2 font-heading text-base font-bold text-ink">
          Modz Tech <span className="rounded-sm bg-brand px-1.5 py-0.5 text-small font-semibold text-on-brand">Admin</span>
        </Link>
        <Suspense fallback={<AdminNavLinks pathname="" />}>
          <AdminNav />
        </Suspense>
        <Link href="/" className="hidden text-label font-semibold text-brand-bright hover:text-brand lg:ml-auto lg:block">
          View shop
        </Link>
      </div>
    </header>
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col">
      <Suspense fallback={<Loading />}>
        <AdminGate>{children}</AdminGate>
      </Suspense>
    </main>
  </div>
);

export default AdminLayout;
