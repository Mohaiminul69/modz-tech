"use client";

import { Phone } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { setMessageStatus } from "@/app/admin/actions/misc";
import { BrandIcon } from "@/components/icons/brand-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";
import { useAdminAction } from "./use-admin-action";

type Message = { id: string; name: string; phone: string; message: string; status: "new" | "read"; createdAt: string; when: string };

export const MessageList = ({ messages }: { messages: Message[] }) => {
  const { pending, run } = useAdminAction();

  if (messages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-control bg-surface p-8 text-center text-ink-muted">No messages yet.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {messages.map((message) => {
        const intl = `+880${message.phone.slice(1)}`;
        return (
          <li
            key={message.id}
            className={cn(
              "flex flex-col gap-2 rounded-lg border bg-surface p-4",
              message.status === "new" ? "border-brand-bright/50" : "border-border",
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              {message.status === "new" && (
                <span className="rounded-sm bg-brand px-1.5 py-0.5 text-small font-semibold text-on-brand">New</span>
              )}
              <span className="font-semibold text-ink">{message.name}</span>
              <span className="font-heading text-label text-ink-muted">{formatBdPhone(message.phone)}</span>
              <span className="ml-auto text-small text-ink-muted">{message.when}</span>
            </div>
            <p className="whitespace-pre-line text-ink">{message.message}</p>
            <div className="flex flex-wrap gap-2">
              <a href={`tel:${intl}`} className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}>
                <Phone aria-hidden="true" strokeWidth={1.5} /> Call
              </a>
              <a
                href={`https://wa.me/${intl.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                <BrandIcon icon={siWhatsapp} className="size-4" /> WhatsApp
              </a>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => run(() => setMessageStatus(message.id, message.status === "new" ? "read" : "new"))}
              >
                {message.status === "new" ? "Mark as handled" : "Mark as new"}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
