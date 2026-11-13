"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Banknote, Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { placeOrder } from "@/app/checkout/actions";
import { GoogleButton } from "@/components/auth/google-button";
import { PhoneInput } from "@/components/forms/phone-input";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { clearCart } from "@/lib/cart/store";
import { cartTotals, useCartLines } from "@/lib/cart/use-cart-lines";
import {
  AREA_LABELS,
  type CheckoutField,
  type DeliveryArea,
  type FieldErrors,
  checkoutSchema,
  toFieldErrors,
} from "@/lib/checkout-schema";
import { DISTRICTS } from "@/lib/districts";
import { formatPrice } from "@/lib/format";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

type CheckoutViewProps = {
  delivery: SiteSettings["delivery"];
  phone: string;
};

const cardClass = "flex flex-col rounded-lg border border-border bg-surface p-4 lg:p-6";
const labelClass = "text-label font-semibold text-ink";

const optionClass =
  "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-control bg-surface px-3 transition-colors duration-150 has-data-checked:border-brand-bright has-data-checked:bg-brand-tint has-data-checked:ring-1 has-data-checked:ring-brand-bright lg:min-h-14 lg:px-3.5";

const StepTitle = ({ step, children, id }: { step: number; children: React.ReactNode; id: string }) => (
  <h2 id={id} className="flex items-center text-panel-title text-ink lg:text-panel-title-lg">
    <span
      aria-hidden="true"
      className="mr-2.5 hidden size-7 items-center justify-center rounded-full bg-brand font-heading text-label font-bold text-on-brand lg:inline-flex"
    >
      {step}
    </span>
    {children}
  </h2>
);

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <span id={id} role="alert" className="text-small text-danger lg:text-small-lg">
      {message}
    </span>
  ) : null;

const accountsSoon = () =>
  toast.info("Accounts open very soon.", { description: "You can order as a guest. Just fill in the form." });

export const CheckoutView = ({ delivery, phone: shopPhone }: CheckoutViewProps) => {
  const id = useId();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const { items, rows, refresh } = useCartLines();
  const [area, setArea] = useState<DeliveryArea>("inside");
  const [district, setDistrict] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [discountNote, setDiscountNote] = useState<string | null>(null);
  const [placing, startPlacing] = useTransition();
  const [placed, setPlaced] = useState(false);

  const fieldId = (field: CheckoutField) => `${id}-${field}`;
  const errorId = (field: CheckoutField) => `${id}-${field}-error`;
  const describedBy = (field: CheckoutField, hint?: string) =>
    cn(hint, errors[field] && errorId(field)) || undefined;

  if (placed) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 px-4 py-20 text-center">
        <Loader2 aria-hidden="true" strokeWidth={1.5} className="size-10 animate-spin text-brand-bright" />
        <p className="text-panel-title font-heading font-bold text-ink">Order placed. One moment…</p>
      </div>
    );
  }

  if (items === null || rows === null) {
    return (
      <div aria-busy="true" className="flex flex-col gap-3 px-4 py-6 lg:px-0">
        <span className="sr-only">Loading your order…</span>
        <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-32 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex size-24 items-center justify-center rounded-full bg-brand-tint">
          <ShoppingCart aria-hidden="true" strokeWidth={1.5} className="size-10 text-brand-bright" />
        </span>
        <h1 className="mt-2 text-[24px] leading-7.5 text-ink">Your cart is empty.</h1>
        <p className="text-ink-muted">Add something to your cart first, then come back to check out.</p>
        <Link href="/shop" className={cn(buttonVariants(), "mt-2 h-12 px-8")}>
          Start shopping
        </Link>
      </div>
    );
  }

  const { billable, units, subtotal, problems } = cartTotals(rows);
  const option = delivery[area === "inside" ? "insideDhaka" : "outsideDhaka"];
  const fee = option.fee;
  const total = subtotal + (fee ?? 0);
  const blocked = problems.length > 0 || units === 0;

  const focusField = (field: CheckoutField) => {
    const target =
      field === "area"
        ? formRef.current?.querySelector<HTMLElement>('[role="radiogroup"] button')
        : document.getElementById(fieldId(field));
    target?.focus();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (placing || blocked) return;
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      area,
      district,
      address: String(data.get("address") ?? ""),
      note: String(data.get("note") ?? ""),
      terms,
      items: billable.map(({ line, quantity }) => ({ productId: line.productId, variantId: line.variantId, quantity })),
    };

    const check = checkoutSchema.safeParse(input);
    if (!check.success) {
      const next = toFieldErrors(check.error);
      setErrors(next);
      const first = (["name", "phone", "email", "area", "district", "address", "note", "terms"] as const).find(
        (field) => next[field],
      );
      if (first) focusField(first);
      return;
    }
    setErrors({});

    startPlacing(async () => {
      const result = await placeOrder(input);
      if (result.ok) {
        setPlaced(true);
        clearCart();
        router.replace(`/order/${result.orderNumber}/confirmed?key=${result.accessKey}`);
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setFormError(result.message);
      toast.error(result.message);
      if (result.unavailable) refresh();
    });
  };

  return (
    <>
      <div className="flex flex-col gap-1 px-4 pt-4 pb-1 lg:gap-1.5 lg:px-0 lg:pt-0 lg:pb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
        <h1 className="mt-1 text-page-title text-ink lg:mt-0 lg:text-page-title-lg">Checkout</h1>
        <div className="flex flex-col gap-1.5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
          <p className="text-label text-ink-muted">
            No account needed. <span className="lg:hidden">Just fill in the form below.</span>
            <span className="hidden lg:inline">Optional: sign in with Google to save your address.</span>
          </p>
          <div className="mt-2 flex flex-col gap-1.5 rounded-lg border border-border bg-surface p-3 lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0">
            <GoogleButton onClick={accountsSoon} />
            <span className="text-center text-small text-ink-muted lg:hidden">
              Optional: sign in with Google to save your address.
            </span>
          </div>
        </div>
      </div>

      <form ref={formRef} id="checkout-form" noValidate onSubmit={handleSubmit}>
        {(formError || problems.length > 0) && (
          <div
            role="alert"
            className="mx-4 mt-3 flex items-start gap-2.5 rounded-md border border-danger/40 bg-surface p-3 text-label text-ink lg:mx-0 lg:mt-0 lg:mb-5"
          >
            <AlertTriangle aria-hidden="true" strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-danger" />
            <span>
              {problems.length > 0 ? (
                <>
                  Some items are sold out or have fewer left than you chose.{" "}
                  <Link href="/cart" className="font-semibold text-brand-bright underline underline-offset-2">
                    Review your cart
                  </Link>{" "}
                  to continue.
                </>
              ) : (
                formError
              )}
            </span>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
          <div className="flex flex-col gap-3 px-4 pt-3 lg:gap-5 lg:px-0 lg:pt-0">
            {/* Delivery details */}
            <section aria-labelledby={`${id}-delivery-title`} className={cn(cardClass, "gap-3.5 lg:gap-4.5")}>
              <StepTitle step={1} id={`${id}-delivery-title`}>
                Delivery details
              </StepTitle>

              <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-2 lg:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={fieldId("name")} className={labelClass}>
                    Full name
                  </label>
                  <Input
                    id={fieldId("name")}
                    name="name"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy("name")}
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
                    aria-describedby={describedBy("phone", `${id}-phone-hint`)}
                  />
                  <span id={`${id}-phone-hint`} className="text-small text-ink-muted lg:hidden">
                    We&apos;ll call this number to confirm your order.
                  </span>
                  <FieldError id={errorId("phone")} message={errors.phone} />
                </div>
              </div>
              <p className="-mt-2.5 hidden text-small-lg text-ink-muted lg:block">
                We&apos;ll call this number to confirm your order.
              </p>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={fieldId("email")} className={labelClass}>
                  Email <span className="font-normal text-ink-muted">(optional)</span>
                </label>
                <Input
                  id={fieldId("email")}
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="For your order confirmation"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={describedBy("email")}
                />
                <FieldError id={errorId("email")} message={errors.email} />
              </div>

              <fieldset className="flex flex-col gap-2">
                <legend className={cn(labelClass, "pb-1.5")}>Delivery area</legend>
                <RadioGroup
                  value={area}
                  onValueChange={(value) => setArea(value as DeliveryArea)}
                  aria-label="Delivery area"
                  className="gap-2 lg:grid-cols-2 lg:gap-3"
                >
                  {(["inside", "outside"] as const).map((value) => {
                    const details = delivery[value === "inside" ? "insideDhaka" : "outsideDhaka"];
                    return (
                      <label key={value} htmlFor={`${id}-area-${value}`} className={optionClass}>
                        <RadioGroupItem id={`${id}-area-${value}`} value={value} />
                        <span className="flex-1 text-body text-ink">
                          {AREA_LABELS[value]}
                          {details.time && <span className="block text-small text-ink-muted">{details.time}</span>}
                        </span>
                        <span className="font-heading text-label font-semibold text-ink">
                          {details.fee !== undefined ? formatPrice(details.fee) : ""}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </fieldset>

              <div className="flex flex-col gap-3.5 lg:grid lg:grid-cols-[1fr_2fr] lg:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={fieldId("district")} className={labelClass}>
                    District
                  </label>
                  <Select
                    value={area === "inside" ? "Dhaka" : district}
                    onValueChange={setDistrict}
                    disabled={area === "inside"}
                  >
                    <SelectTrigger
                      id={fieldId("district")}
                      aria-invalid={errors.district ? true : undefined}
                      aria-describedby={describedBy("district")}
                      className="h-11! w-full text-body font-normal"
                    >
                      <SelectValue placeholder="Select your district" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-72 bg-surface">
                      {DISTRICTS.map((name) => (
                        <SelectItem key={name} value={name} className="min-h-10 text-body">
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError id={errorId("district")} message={errors.district} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={fieldId("address")} className={labelClass}>
                    Full address
                  </label>
                  <Textarea
                    id={fieldId("address")}
                    name="address"
                    rows={3}
                    autoComplete="street-address"
                    placeholder="House, road, area, landmark"
                    aria-invalid={errors.address ? true : undefined}
                    aria-describedby={describedBy("address")}
                    className="min-h-24 lg:min-h-11"
                  />
                  <FieldError id={errorId("address")} message={errors.address} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={fieldId("note")} className={labelClass}>
                  Order note <span className="font-normal text-ink-muted">(optional)</span>
                </label>
                <Textarea
                  id={fieldId("note")}
                  name="note"
                  rows={2}
                  placeholder="Anything we should know?"
                  aria-invalid={errors.note ? true : undefined}
                  aria-describedby={describedBy("note")}
                />
                <FieldError id={errorId("note")} message={errors.note} />
              </div>
            </section>

            {/* Payment */}
            <section aria-labelledby={`${id}-payment-title`} className={cn(cardClass, "gap-2.5 lg:gap-3")}>
              <StepTitle step={2} id={`${id}-payment-title`}>
                Payment
              </StepTitle>
              <RadioGroup value="cod" aria-label="Payment method" className="gap-2.5 lg:grid-cols-3 lg:gap-3">
                <label htmlFor={`${id}-pay-cod`} className={cn(optionClass, "min-h-14 lg:min-h-16")}>
                  <RadioGroupItem id={`${id}-pay-cod`} value="cod" />
                  <span className="flex-1 text-body font-semibold text-ink">
                    Cash on delivery
                    <span className="block text-small font-normal text-ink-muted">Pay when your order arrives</span>
                  </span>
                </label>
                {["bKash", "Card / mobile banking"].map((label) => (
                  <label
                    key={label}
                    className="flex min-h-12 items-center gap-3 rounded-md border border-border px-3 text-ink-muted lg:min-h-16 lg:px-3.5"
                  >
                    <RadioGroupItem value={label} disabled aria-label={`${label}, coming soon`} />
                    <span className="flex-1 text-body">{label}</span>
                    <span className="text-small">Coming soon</span>
                  </label>
                ))}
              </RadioGroup>
            </section>
          </div>

          {/* Summary */}
          <aside
            aria-labelledby={`${id}-summary-title`}
            className="mx-4 mt-3 flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 lg:sticky lg:top-6 lg:mx-0 lg:mt-0 lg:gap-3.5 lg:p-6 lg:shadow-card"
          >
            <h2 id={`${id}-summary-title`} className="text-panel-title text-ink lg:text-panel-title-lg">
              Order summary
            </h2>
            <ul className="flex flex-col gap-3">
              {billable.map(({ line, quantity }) => (
                <li key={line.variantId} className="flex items-center gap-3">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-media-frame lg:size-16">
                    {line.image && (
                      <Image
                        src={line.image.src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                        style={{ objectPosition: line.image.position ?? "center" }}
                      />
                    )}
                  </span>
                  <span className="flex-1 text-label text-ink-muted">
                    {line.name}
                    {line.variantName && `, ${line.variantName}`}{" "}
                    <span className="font-semibold text-ink">× {quantity}</span>
                  </span>
                  <span className="font-heading text-[15px] font-semibold text-ink lg:text-base">
                    {formatPrice(line.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Discount codes: shown per the design, not active at launch. */}
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <Input aria-label="Discount code" placeholder="Discount code" name="discount" className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  className="border-brand-bright px-4 text-label text-brand-bright"
                  onClick={() => setDiscountNote("Discount codes aren't available yet.")}
                >
                  Apply
                </Button>
              </div>
              {discountNote && (
                <span role="status" className="text-small text-ink-muted">
                  {discountNote}
                </span>
              )}
            </div>

            <dl className="flex flex-col gap-3 text-label lg:text-body">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="font-heading font-semibold text-ink">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">Delivery ({AREA_LABELS[area]})</dt>
                <dd className={fee !== undefined ? "font-heading font-semibold text-ink" : "text-right text-ink-muted"}>
                  {fee !== undefined ? formatPrice(fee) : "Confirmed on the call"}
                </dd>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-body font-semibold text-ink lg:text-base">
                  <span className="lg:hidden">Total to pay on delivery</span>
                  <span className="hidden lg:inline">Pay on delivery</span>
                </dt>
                <dd className="font-heading text-section leading-6.5 font-bold tracking-[-0.02em] whitespace-nowrap text-ink lg:text-[28px] lg:leading-8">
                  {formatPrice(total)}
                  {fee === undefined && <span className="text-label font-normal text-ink-muted"> + delivery</span>}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-start gap-2.5 text-label">
                <Checkbox
                  id={fieldId("terms")}
                  checked={terms}
                  onCheckedChange={(value) => setTerms(value === true)}
                  aria-invalid={errors.terms ? true : undefined}
                  aria-describedby={describedBy("terms")}
                  className="mt-0.5"
                />
                <label htmlFor={fieldId("terms")} className="cursor-pointer text-ink">
                  I agree to the terms and return policy.
                </label>
              </div>
              <FieldError id={errorId("terms")} message={errors.terms} />
            </div>

            <Button type="submit" disabled={placing || blocked} className="mt-1 hidden h-13 text-base lg:flex">
              {placing ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" /> Placing your order…
                </>
              ) : (
                "Confirm order"
              )}
            </Button>
            {shopPhone && (
              <p className="hidden text-center text-small-lg text-ink-muted lg:block">Need help? Call {shopPhone}</p>
            )}
          </aside>
        </div>

        <p className="mx-4 mt-3 mb-6 flex items-center gap-2.5 rounded-md bg-brand-tint p-3 text-label text-ink lg:hidden">
          <Banknote aria-hidden="true" strokeWidth={1.5} className="size-5.5 shrink-0 text-brand-bright" />
          Pay cash when your order arrives. We&apos;ll call to confirm first.
        </p>

        {/* Phones: sticky confirm bar */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-border bg-surface px-4 pt-2.5 pb-[max(10px,env(safe-area-inset-bottom))] shadow-[0_-6px_18px_rgb(11_15_22/0.08)] lg:hidden">
          <div className="flex flex-col">
            <span className="text-small text-ink-muted">Pay on delivery</span>
            <span className="font-heading text-section leading-6.5 font-bold tracking-[-0.02em] text-ink">
              {formatPrice(total)}
            </span>
          </div>
          <Button type="submit" disabled={placing || blocked} className="ml-auto h-12 flex-1">
            {placing ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin" /> Placing…
              </>
            ) : (
              "Confirm order"
            )}
          </Button>
        </div>
      </form>
    </>
  );
};
