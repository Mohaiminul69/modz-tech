"use client";

import { CircleCheck, Loader2 } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { sendContactMessage } from "@/app/contact/actions";
import { PhoneInput } from "@/components/forms/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type ContactErrors, type ContactField, contactSchema, toContactErrors } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const labelClass = "text-label font-semibold text-ink";

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <span id={id} role="alert" className="text-small text-danger">
      {message}
    </span>
  ) : null;

export const ContactForm = () => {
  const id = useId();
  const [errors, setErrors] = useState<ContactErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, startSending] = useTransition();

  const fieldId = (field: ContactField) => `${id}-${field}`;
  const errorId = (field: ContactField) => `${id}-${field}-error`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    const check = contactSchema.safeParse(input);
    if (!check.success) {
      const next = toContactErrors(check.error);
      setErrors(next);
      const first = (["name", "phone", "message"] as const).find((field) => next[field]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }
    setErrors({});

    startSending(async () => {
      const result = await sendContactMessage(input);
      if (result.ok) {
        setSent(true);
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.message);
    });
  };

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-2 py-6 text-center">
        <CircleCheck aria-hidden="true" strokeWidth={1.5} className="size-10 text-success" />
        <p className="text-panel-title font-heading font-bold text-ink">Message sent.</p>
        <p className="text-ink-muted">Thanks. We&apos;ll call you back soon.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      {formError && (
        <p role="alert" className="rounded-md border border-danger/40 p-3 text-label text-ink">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId("name")} className={labelClass}>
          Name
        </label>
        <Input
          id={fieldId("name")}
          name="name"
          autoComplete="name"
          placeholder="Your name"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? errorId("name") : undefined}
        />
        <FieldError id={errorId("name")} message={errors.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId("phone")} className={labelClass}>
          Phone number
        </label>
        <PhoneInput
          id={fieldId("phone")}
          name="phone"
          invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? errorId("phone") : undefined}
        />
        <FieldError id={errorId("phone")} message={errors.phone} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId("message")} className={labelClass}>
          Message
        </label>
        <Textarea
          id={fieldId("message")}
          name="message"
          rows={4}
          placeholder="How can we help?"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className="min-h-28"
        />
        <FieldError id={errorId("message")} message={errors.message} />
      </div>

      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Button type="submit" disabled={sending} className={cn("h-12")}>
        {sending ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin" /> Sending…
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
};
