"use client";

import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@context/CartContext";
import { siteConfig } from "@data/siteConfig";
import { computeCartTotals, fmt } from "@utils/cartPricing";

const DISTRICTS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

type PaymentMethodId = "cod" | "bkash" | "nagad" | "ssl";

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  name: string;
  tag: string;
  note: string;
  fee: string;
}[] = [
  {
    id: "cod",
    name: "Cash on delivery",
    tag: "MOST USED",
    note: "Pay the courier when the parcel reaches you. Check it before you pay.",
    fee: "No fee",
  },
  {
    id: "bkash",
    name: "bKash",
    tag: "",
    note: "Pay now from your bKash account. Order is confirmed instantly.",
    fee: "No fee",
  },
  {
    id: "nagad",
    name: "Nagad",
    tag: "",
    note: "Pay now from your Nagad account. Order is confirmed instantly.",
    fee: "No fee",
  },
  {
    id: "ssl",
    name: "SSLCommerz",
    tag: "Secure",
    note: "Card, net banking or mobile wallet through the SSLCommerz gateway.",
    fee: "Secure",
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(\+?880|0)1[0-9]{9}$/;
const POSTAL_RE = /^\d{4}$/;

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  deliveryNote: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const StepChip = ({ n }: { n: string }) => (
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[rgba(106,169,233,.45)] bg-[rgba(47,127,212,.18)] font-mono text-[10px] text-[#cfe3f8]">
    {n}
  </span>
);

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) => (
  <label className="flex flex-col gap-2">
    <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/55">
      {label}
    </span>
    {children}
    {error && <span className="font-body text-[11.5px] text-[#ff9494]">{error}</span>}
  </label>
);

const inputClass = (hasError: boolean) =>
  `rounded-[14px] border px-4.5 py-3.5 font-body text-[14px] text-white outline-none transition-colors placeholder:text-snow/38 focus:border-[rgba(106,169,233,.6)] ${
    hasError ? "border-[rgba(255,148,148,.6)]" : "border-white/14"
  } bg-white/4`;

const FormCard = ({ n, title, children }: { n: string; title: string; children: ReactNode }) => (
  <div
    className="rounded-[20px] border border-white/8 p-6.5"
    style={{
      backgroundImage: "linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))",
    }}
  >
    <div className="mb-5.5 flex items-center gap-3">
      <StepChip n={n} />
      <h2 className="font-heading text-[18px] font-semibold tracking-[-0.014em] text-snow">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

const Checkout = () => {
  const router = useRouter();
  const { items, count } = useCart();
  const totals = computeCartTotals(items);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "Dhaka",
    postalCode: "",
    deliveryNote: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [method, setMethod] = useState<PaymentMethodId>("cod");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    if (count === 0) router.replace("/cart");
  }, [count, router]);

  if (count === 0) return null;

  const setField =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = () => {
    const next: FormErrors = {};
    if (!form.firstName.trim()) next.firstName = "Required.";
    if (!form.lastName.trim()) next.lastName = "Required.";
    if (!PHONE_RE.test(form.phone.replace(/\s+/g, "")))
      next.phone = "Enter a valid BD mobile number.";
    if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.address.trim()) next.address = "Required.";
    if (!form.city.trim()) next.city = "Required.";
    if (!POSTAL_RE.test(form.postalCode)) next.postalCode = "4-digit postal code.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const payLabel = method === "cod" ? "Payable on delivery" : "Payable now";

  const cta: Record<PaymentMethodId, string> = {
    cod: `Place order — pay ${fmt(totals.total)} on delivery`,
    bkash: `Pay ${fmt(totals.total)} with bKash`,
    nagad: `Pay ${fmt(totals.total)} with Nagad`,
    ssl: `Pay ${fmt(totals.total)} securely`,
  };

  const hint: Record<PaymentMethodId, string> = {
    cod: `Keep ${fmt(totals.total)} ready for the courier. You can open the parcel and check it before paying.`,
    bkash:
      "You will be sent to bKash to confirm the payment, then returned here with your order number.",
    nagad:
      "You will be sent to Nagad to confirm the payment, then returned here with your order number.",
    ssl: "You will be redirected to the SSLCommerz secure page. We never see or store your card details.",
  };

  const handlePlaceOrder = () => {
    if (validate()) setPlaced(true);
  };

  const whatsappOrderLink = () => {
    const lines = [
      `Order request — ${form.firstName} ${form.lastName}`.trim(),
      form.phone && `Phone: ${form.phone}`,
      form.address && `Address: ${form.address}, ${form.city}, ${form.district} ${form.postalCode}`,
      "",
      ...items.map((l) => `${l.qty}× ${l.product.name} — ${fmt(l.product.price * l.qty)}`),
      "",
      `Total: ${fmt(totals.total)} (${payLabel})`,
    ].filter(Boolean);

    return `${siteConfig.whatsappLink}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <>
      {/* Breadcrumb / progress trail */}
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-2 px-[clamp(20px,4vw,64px)] pt-[clamp(24px,3vw,40px)] font-mono text-[10.5px] uppercase tracking-[0.16em]">
        <Link href="/cart" className="text-snow/45 transition-colors hover:text-[#9ac8f5]">
          Cart
        </Link>
        <span className="text-snow/45">/</span>
        <span className="text-[#7fb0e4]">Checkout</span>
        <span className="text-snow/45">/</span>
        <span className="text-snow/45">Confirmation</span>
      </div>

      {/* Head */}
      <section className="px-[clamp(20px,4vw,64px)] pb-[clamp(28px,3vw,40px)] pt-[clamp(20px,2.5vw,32px)]">
        <h1
          className="mb-3.5 font-heading text-[clamp(32px,4vw,54px)] font-bold leading-[1.02] tracking-[-0.034em]"
          style={{
            background: "linear-gradient(180deg,#ffffff 30%,#a8b4c4 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Checkout.
        </h1>
        <p className="max-w-[480px] font-body text-[15px] leading-relaxed text-snow/60">
          Where should we send it, and how would you like to pay? Takes about a minute.
        </p>
      </section>

      {/* Body */}
      <section className="mx-auto flex max-w-[1680px] flex-wrap items-start gap-[clamp(20px,2.5vw,36px)] px-[clamp(20px,4vw,64px)] pb-[clamp(56px,6vw,96px)]">
        <div className="flex min-w-[min(100%,300px)] flex-[2_1_480px] flex-col gap-3.5">
          <FormCard n="1" title="Contact details">
            <div
              className="grid gap-3.5"
              style={{ gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}
            >
              <Field label="First name" error={errors.firstName}>
                <input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={setField("firstName")}
                  className={inputClass(Boolean(errors.firstName))}
                />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={setField("lastName")}
                  className={inputClass(Boolean(errors.lastName))}
                />
              </Field>
              <Field label="Phone number" error={errors.phone}>
                <input
                  placeholder="+880 1XXX XXXXXX"
                  value={form.phone}
                  onChange={setField("phone")}
                  className={inputClass(Boolean(errors.phone))}
                />
              </Field>
              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={setField("email")}
                  className={inputClass(Boolean(errors.email))}
                />
              </Field>
            </div>
            <p className="mt-3.5 font-body text-[12px] leading-relaxed text-snow/48">
              The courier calls this number before delivery, so please use one that is switched
              on.
            </p>
          </FormCard>

          <FormCard n="2" title="Delivery address">
            <div className="grid gap-3.5">
              <Field label="Address" error={errors.address}>
                <input
                  placeholder="House / road / area"
                  value={form.address}
                  onChange={setField("address")}
                  className={inputClass(Boolean(errors.address))}
                />
              </Field>
              <div
                className="grid gap-3.5"
                style={{ gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))" }}
              >
                <Field label="City" error={errors.city}>
                  <input
                    placeholder="Dhaka"
                    value={form.city}
                    onChange={setField("city")}
                    className={inputClass(Boolean(errors.city))}
                  />
                </Field>
                <Field label="District">
                  <select
                    value={form.district}
                    onChange={setField("district")}
                    className={`${inputClass(false)} cursor-pointer`}
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-surface">
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Postal code" error={errors.postalCode}>
                  <input
                    placeholder="1216"
                    value={form.postalCode}
                    onChange={setField("postalCode")}
                    className={inputClass(Boolean(errors.postalCode))}
                  />
                </Field>
              </div>
              <Field label="Delivery note — optional">
                <input
                  placeholder="Landmark, floor, or a time that suits you"
                  value={form.deliveryNote}
                  onChange={setField("deliveryNote")}
                  className={inputClass(false)}
                />
              </Field>
            </div>
          </FormCard>

          <FormCard n="3" title="Payment">
            <div className="grid gap-3">
              {PAYMENT_METHODS.map((m) => {
                const selected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex w-full items-start gap-3.5 rounded-2xl border px-5 py-4.5 text-left transition-colors hover:border-[rgba(106,169,233,.5)] ${
                      selected ? "border-[rgba(106,169,233,.55)]" : "border-white/10"
                    }`}
                    style={{
                      background: selected
                        ? "radial-gradient(ellipse at 0% 0%, rgba(47,127,212,.16), transparent 70%), rgba(255,255,255,.03)"
                        : "rgba(255,255,255,.02)",
                    }}
                  >
                    <span
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border ${
                        selected ? "border-accent" : "border-white/30"
                      }`}
                    >
                      {selected && <span className="h-2.25 w-2.25 rounded-full bg-accent" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2.5">
                        <span className="font-heading text-[15.5px] font-semibold text-snow">
                          {m.name}
                        </span>
                        {m.tag && (
                          <span className="rounded-full border border-[rgba(106,169,233,.35)] bg-[rgba(47,127,212,.16)] px-2.25 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#cfe3f8]">
                            {m.tag}
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block font-body text-[12.5px] leading-relaxed text-snow/58">
                        {m.note}
                      </span>
                    </span>
                    <span className="mt-1 shrink-0 font-mono text-[10px] tracking-[0.12em] text-snow/50">
                      {m.fee}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 rounded-[14px] border border-[rgba(106,169,233,.25)] bg-[rgba(47,127,212,.08)] px-4.5 py-4 font-body text-[12.5px] leading-relaxed text-snow/72">
              {hint[method]}
            </div>
          </FormCard>
        </div>

        {/* Summary aside */}
        <aside className="flex min-w-[min(100%,280px)] max-w-[420px] flex-1 basis-80 flex-col gap-3.5 lg:sticky lg:top-24">
          <div
            className="rounded-[20px] border border-white/8 p-6"
            style={{
              backgroundImage: "linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))",
            }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-snow/55">
                Order summary
              </span>
              <Link href="/cart" className="font-body text-[12px] font-semibold text-[#7fb0e4]">
                Edit cart
              </Link>
            </div>

            <div className="mb-4.5 grid gap-3.5 border-b border-white/8 pb-4.5">
              {items.map((line) => (
                <div key={line.id} className="flex items-center gap-3.25">
                  <div
                    className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border border-white/9 bg-surface-media"
                    style={{
                      backgroundImage: !line.product.image
                        ? "radial-gradient(circle at 50% 35%, rgba(47,127,212,.16), transparent 70%)"
                        : undefined,
                    }}
                  >
                    {line.product.image && (
                      <Image
                        src={line.product.image}
                        alt={line.product.name}
                        fill
                        sizes="52px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-body text-[13.5px] font-semibold leading-tight text-snow">
                      {line.product.name}
                    </div>
                    <div className="mt-1 font-mono text-[9.5px] tracking-[0.12em] text-snow/50">
                      QTY {line.qty}
                    </div>
                  </div>
                  <div className="font-heading text-[14.5px] font-semibold text-snow">
                    {fmt(line.product.price * line.qty)}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3.25 font-body text-[13.5px]">
              <div className="flex justify-between gap-3">
                <span className="text-snow/68">Subtotal ({totals.count} items)</span>
                <span className="font-semibold text-snow">{fmt(totals.listTotal)}</span>
              </div>
              {totals.offerSavings > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-snow/68">Offer savings</span>
                  <span className="font-semibold text-[#8fc4fb]">
                    −{fmt(totals.offerSavings)}
                  </span>
                </div>
              )}
              {totals.bundleDiscount > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-snow/68">Bundle discount</span>
                  <span className="font-semibold text-[#8fc4fb]">
                    −{fmt(totals.bundleDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-snow/68">Delivery to {form.district}</span>
                <span className="font-semibold text-snow">
                  {totals.deliveryCost === 0 ? "Free" : fmt(totals.deliveryCost)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-baseline justify-between gap-3 border-t border-white/10 pt-4.5">
              <span className="font-heading text-[16px] font-semibold text-snow">Total</span>
              <span
                className="font-heading text-[30px] font-bold tracking-[-0.02em]"
                style={{
                  background: "linear-gradient(180deg,#8fc4fb 10%,#2a6fbf 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {fmt(totals.total)}
              </span>
            </div>
            <div className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-snow/50">
              {payLabel}
            </div>

            {placed ? (
              <div className="mt-5.5 rounded-2xl border border-[rgba(106,169,233,.35)] bg-[rgba(47,127,212,.1)] px-4.5 py-4 text-center">
                <p className="font-heading text-[14.5px] font-semibold text-snow">
                  Thanks, {form.firstName || "there"} — order details ready.
                </p>
                <p className="mt-1.5 font-body text-[12.5px] leading-relaxed text-snow/62">
                  Send it to us on WhatsApp to confirm, or we&apos;ll follow up on {form.phone}.
                </p>
              </div>
            ) : (
              <div className="mt-5.5 grid gap-2.5">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="bg-brand-gradient rounded-full px-6 py-3.75 text-center font-body text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(47,127,212,.35)] transition-[filter] hover:brightness-[1.08]"
                >
                  {cta[method]}
                </button>
                <a
                  href={whatsappOrderLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/16 px-6 py-3.5 text-center font-body text-[13.5px] font-semibold text-snow transition-colors hover:bg-white/6"
                >
                  Send this order on WhatsApp
                </a>
              </div>
            )}

            <p className="mt-3.5 text-center font-body text-[11.5px] leading-relaxed text-snow/45">
              By placing the order you agree to our terms and return policy.
            </p>
          </div>

          <div className="grid gap-0.5 overflow-hidden rounded-[20px] border border-white/8 bg-white/6">
            {[
              "24–48 hr nationwide delivery",
              "Check the parcel before you pay",
              `Questions? WhatsApp ${siteConfig.whatsappDisplay}`,
            ].map((line) => (
              <div
                key={line}
                className="flex items-center gap-3 bg-surface px-4.5 py-3.5 font-body text-[12.5px] text-snow/70"
              >
                <span className="text-accent">•</span> {line}
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Reduced footer — nothing competes with the form */}
      <footer className="border-t border-white/7 px-[clamp(20px,4vw,64px)] py-[clamp(28px,3vw,40px)]">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-center justify-between gap-3.5 font-body text-[11.5px] text-snow/42">
          <Link href="/" className="flex items-center gap-2.75">
            <span className="font-heading text-[12.5px] font-bold tracking-[0.14em] text-[#e9eef5]">
              MODZ<span className="text-accent">TECH</span>
            </span>
          </Link>
          <span>© 2026 Modz Tech · Cash on delivery · 24–48 hr nationwide delivery</span>
        </div>
      </footer>
    </>
  );
};

export default Checkout;
