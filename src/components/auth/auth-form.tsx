"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { toast } from "sonner";
import { PasswordInput } from "@/components/forms/password-input";
import { PhoneInput } from "@/components/forms/phone-input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PHONE_ERROR, normalizeBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";
import { GoogleButton } from "./google-button";

type Mode = "login" | "signup";
type Errors = Partial<Record<"name" | "phone" | "password" | "terms", string>>;

export const MIN_PASSWORD_LENGTH = 8;

const Divider = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 text-small text-ink-muted">
    <span className="h-px flex-1 bg-border" />
    {children}
    <span className="h-px flex-1 bg-border" />
  </div>
);

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <span id={id} className="text-small font-normal text-danger">
      {message}
    </span>
  ) : null;

/*
 * TODO(auth stage): sign in / sign up with Better Auth (Google + phone & password).
 * Until accounts exist, valid submissions explain that ordering works as a guest.
 */
const accountsSoon = () =>
  toast.info("Accounts open very soon.", {
    description: "You don't need an account to order. Continue as a guest.",
  });

export const AuthForm = ({ mode }: { mode: Mode }) => {
  const id = useId();
  const signup = mode === "signup";
  const [errors, setErrors] = useState<Errors>({});

  const validate = (data: FormData): Errors => {
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (signup && name.length < 2) next.name = "Enter your name.";
    if (!normalizeBdPhone(String(data.get("phone") ?? ""))) next.phone = PHONE_ERROR;
    if (!password) next.password = "Enter your password.";
    else if (signup && password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (signup && data.get("terms") !== "on") next.terms = "Please agree to continue.";
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(new FormData(event.currentTarget));
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    accountsSoon();
  };

  const labelClass = "flex flex-col gap-1.5 text-label font-semibold text-ink";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-section text-ink">{signup ? "Create your account." : "Welcome back."}</h1>
        <p className="text-label text-ink-muted">
          {signup ? "Track orders and check out faster next time." : "Log in to see your orders and save your address."}
        </p>
      </div>

      <GoogleButton onClick={accountsSoon} />
      <Divider>{signup ? "or sign up with your phone" : "or use your phone"}</Divider>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        {signup && (
          <div className={labelClass}>
            <label htmlFor={`${id}-name`}>Full name</label>
            <Input
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              placeholder="Your name"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
              className="font-normal"
            />
            <FieldError id={`${id}-name-error`} message={errors.name} />
          </div>
        )}

        <div className={labelClass}>
          <label htmlFor={`${id}-phone`}>Phone number</label>
          <PhoneInput
            id={`${id}-phone`}
            name="phone"
            invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
          />
          <FieldError id={`${id}-phone-error`} message={errors.phone} />
        </div>

        <div className={labelClass}>
          <label htmlFor={`${id}-password`}>Password</label>
          <PasswordInput
            id={`${id}-password`}
            name="password"
            autoComplete={signup ? "new-password" : "current-password"}
            placeholder={signup ? "Create a password" : undefined}
            invalid={Boolean(errors.password)}
            aria-describedby={cn(signup && `${id}-password-hint`, errors.password && `${id}-password-error`) || undefined}
          />
          {signup && !errors.password && (
            <span id={`${id}-password-hint`} className="text-small font-normal text-ink-muted">
              At least {MIN_PASSWORD_LENGTH} characters.
            </span>
          )}
          <FieldError id={`${id}-password-error`} message={errors.password} />
        </div>

        {signup ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2.5 text-label">
              <Checkbox
                id={`${id}-terms`}
                name="terms"
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? `${id}-terms-error` : undefined}
                className="mt-0.5"
              />
              <label htmlFor={`${id}-terms`} className="cursor-pointer text-ink">
                I agree to the terms and privacy policy.
              </label>
            </div>
            <FieldError id={`${id}-terms-error`} message={errors.terms} />
          </div>
        ) : (
          <div className="flex items-center justify-between text-label">
            <div className="flex items-center gap-2">
              <Checkbox id={`${id}-remember`} name="remember" defaultChecked className="size-4.5" />
              <label htmlFor={`${id}-remember`} className="cursor-pointer text-ink">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() =>
                toast.info("Forgot your password?", { description: "Message us on Messenger and we'll help you reset it." })
              }
              className="rounded-sm font-semibold text-brand-bright hover:text-brand"
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button type="submit" className="h-12">
          {signup ? "Create account" : "Log in"}
        </Button>
      </form>

      <Divider>or</Divider>
      <Link href="/cart" className={cn(buttonVariants({ variant: "outline" }), "h-12")}>
        Continue as guest
      </Link>
      <p className="text-center text-small text-ink-muted">
        You don&apos;t need an account to order. Cash on delivery all over Bangladesh.
      </p>
    </div>
  );
};
