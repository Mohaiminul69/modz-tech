"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// "Get offers first" sign-up from the footer mockup.
// TODO: not in the requirements yet: decide where emails go (DB / Resend audience) before wiring it up.
export const NewsletterForm = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info("Offer emails are coming soon. Follow us on Facebook for now.");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="Your email"
        aria-label="Your email"
        autoComplete="email"
        className="h-11 min-w-0 flex-1 rounded-md border border-chrome-border bg-chrome-surface px-3 text-body text-on-chrome placeholder:text-on-chrome-muted focus-visible:border-chrome-accent"
      />
      <Button type="submit" className="px-4 text-label">
        Subscribe
      </Button>
    </form>
  );
};
