"use client";

import { useState } from "react";
import { toast } from "sonner";
import { SignOutButton } from "@/components/admin/admin-nav";
import { GoogleButton } from "@/components/auth/google-button";
import { authClient } from "@/lib/auth-client";

type AdminSignInProps = {
  googleConfigured: boolean;
  /** Signed in, but the account isn't an admin. */
  deniedEmail?: string;
};

export const AdminSignIn = ({ googleConfigured, deniedEmail }: AdminSignInProps) => {
  const [busy, setBusy] = useState(false);

  if (deniedEmail) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert" className="rounded-md border border-danger/40 p-3 text-label text-ink">
          <strong>{deniedEmail}</strong> doesn&apos;t have admin access. Ask the shop owner to give it admin rights, or
          sign out and use another account.
        </p>
        <SignOutButton />
      </div>
    );
  }

  if (!googleConfigured) {
    return (
      <p role="alert" className="rounded-md border border-danger/40 p-3 text-label text-ink">
        Google sign-in isn&apos;t set up yet. Add <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> to
        the environment variables, then restart the site.
      </p>
    );
  }

  return (
    <GoogleButton
      onClick={async () => {
        if (busy) return;
        setBusy(true);
        const { error } = await authClient.signIn.social({ provider: "google", callbackURL: "/admin/orders" });
        if (error) {
          toast.error(error.message ?? "Couldn't start Google sign-in.");
          setBusy(false);
        }
      }}
    />
  );
};
