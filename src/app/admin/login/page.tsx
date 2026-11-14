import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminSignIn } from "@/components/admin/admin-sign-in";
import { getSession } from "@/lib/admin-auth";
import { googleConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

const SignInPanel = async () => {
  const session = await getSession();
  if (session?.user.role === "admin") redirect("/admin/orders");
  return <AdminSignIn googleConfigured={googleConfigured} deniedEmail={session ? session.user.email : undefined} />;
};

const AdminLoginRoute = () => (
  <main className="flex flex-1 items-center justify-center bg-background px-4 py-16">
    <div className="flex w-full max-w-100 flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-card">
      <div className="flex flex-col gap-1">
        <h1 className="text-panel-title-lg text-ink">Modz Tech admin</h1>
        <p className="text-label text-ink-muted">Sign in with the Google account that has admin access.</p>
      </div>
      <Suspense fallback={<div className="h-12 animate-pulse rounded-md bg-media-frame" />}>
        <SignInPanel />
      </Suspense>
    </div>
  </main>
);

export default AdminLoginRoute;
