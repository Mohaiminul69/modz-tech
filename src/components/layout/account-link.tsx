"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AccountLinkProps = {
  /** "icon" = mobile header icon, "text" = desktop "Log in" / name link. */
  variant: "icon" | "text";
  current?: boolean;
};

// Signed out: "Log in" → /login. Signed in: first name → /account.
// The session loads in the browser, so it starts as "Log in" and updates after hydration.
export const AccountLink = ({ variant, current = false }: AccountLinkProps) => {
  const { data: session } = authClient.useSession();
  const signedIn = Boolean(session);
  const firstName = session?.user.name?.split(" ")[0] || "Account";
  const href = signedIn ? "/account" : "/login";

  if (variant === "icon") {
    return (
      <Link
        href={href}
        aria-label={signedIn ? `Your account (${firstName})` : "Log in"}
        aria-current={current ? "page" : undefined}
        className={cn(
          "relative flex size-11 items-center justify-center rounded-md",
          current ? "text-chrome-accent" : "text-chrome-silver",
        )}
      >
        <User aria-hidden="true" strokeWidth={1.5} className="size-5.5" />
        {signedIn && (
          <span aria-hidden="true" className="absolute right-2.5 bottom-2.5 size-2 rounded-full bg-chrome-accent" />
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "flex h-11 items-center gap-2 rounded-md px-3 text-label",
        current ? "font-semibold text-chrome-accent" : "font-medium text-chrome-silver hover:text-on-chrome",
      )}
    >
      <User aria-hidden="true" strokeWidth={1.5} className="size-5" />
      <span className="max-w-28 truncate">{signedIn ? firstName : "Log in"}</span>
    </Link>
  );
};
