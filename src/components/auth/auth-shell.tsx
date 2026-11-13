import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";
import { AuthForm } from "./auth-form";

type AuthShellProps = {
  mode: "login" | "signup";
};

const tabClass = (active: boolean) =>
  cn(
    "flex h-10 items-center justify-center rounded-[6px] text-label font-semibold",
    active ? "bg-surface text-ink shadow-[0_1px_2px_rgb(11_15_22/0.08)]" : "text-ink-muted hover:text-ink",
  );

/*
 * Log in / sign up layout: dark brand band with the logo, then a white card that
 * overlaps it. Phones get no site header (the band has its own back button);
 * desktop uses the normal header and footer with the card centred (~440px).
 */
export const AuthShell = ({ mode }: AuthShellProps) => (
  <>
    <SiteHeader mobile={false} leading="none" current="login" showCategoryNav={false} />
    <main className="flex flex-1 flex-col">
      <section className="mz-chrome relative overflow-hidden bg-chrome px-3 pt-3 pb-18 text-on-chrome lg:pt-10 lg:pb-22">
        <svg
          aria-hidden="true"
          viewBox="0 0 390 240"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute inset-0 size-full text-chrome-accent"
        >
          <line x1="390" y1="10" x2="300" y2="240" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
        </svg>
        <Link
          href={mode === "signup" ? "/login" : "/"}
          aria-label="Back"
          className="relative flex size-11 items-center justify-center rounded-md text-chrome-silver lg:hidden"
        >
          <ChevronLeft aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
        </Link>
        <div className="relative mt-5 flex flex-col items-center gap-2.5 lg:mt-0">
          <Logo eager className="h-14" />
          <p className="eyebrow text-chrome-silver">Tech that connects</p>
        </div>
      </section>

      <div className="relative mx-4 -mt-12 flex flex-col sm:mx-auto sm:w-110">
        <section className="flex flex-col gap-4 rounded-lg border border-border bg-surface px-4 py-5 shadow-card lg:px-6 lg:py-6">
          <nav aria-label="Account" className="grid grid-cols-2 rounded-md bg-media-frame p-1">
            <Link href="/login" aria-current={mode === "login" ? "page" : undefined} className={tabClass(mode === "login")}>
              Log in
            </Link>
            <Link href="/signup" aria-current={mode === "signup" ? "page" : undefined} className={tabClass(mode === "signup")}>
              Sign up
            </Link>
          </nav>
          <AuthForm mode={mode} />
        </section>
        <p className="px-4 pt-6 pb-10 text-center text-label text-ink-muted lg:pb-16">
          {mode === "login" ? "New here? " : "Already have an account? "}
          <Link
            href={mode === "login" ? "/signup" : "/login"}
            className="rounded-sm font-semibold text-brand-bright hover:text-brand"
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </Link>
        </p>
      </div>
    </main>
    <SiteFooter variant="minimal" className="hidden lg:block" />
  </>
);
