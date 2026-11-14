"use client";

import Image from "next/image";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { type TrackedOrder, trackOrder } from "@/app/track/actions";
import { PhoneInput } from "@/components/forms/phone-input";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import type { OrderStatus } from "@/lib/order-status";
import { cn } from "@/lib/utils";

const when = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(iso))
    : "";

const PILL: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Waiting for confirmation", className: "bg-brand-tint text-brand-bright" },
  confirmed: { label: "Confirmed", className: "bg-brand-tint text-brand-bright" },
  shipped: { label: "On the way", className: "bg-brand-tint text-brand-bright" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success" },
  not_reachable: { label: "Couldn't reach you", className: "bg-danger/10 text-danger" },
  cancelled: { label: "Cancelled", className: "bg-media-frame text-ink-muted" },
  returned: { label: "Returned", className: "bg-danger/10 text-danger" },
};

// Orders that left the normal path get a message instead of the timeline.
const STOPPED: Partial<Record<OrderStatus, string>> = {
  not_reachable: "We tried to call you to confirm this order but couldn't reach you. Call us or message us on Facebook to confirm it.",
  cancelled: "This order was cancelled. If that's a mistake, message us and we'll help.",
  returned: "This order was returned to us.",
};

type Step = { title: string; detail: string; state: "done" | "now" | "todo" };

/*
 * Timeline (as in the mockup): done = green ✓, now = blue dot, todo = hollow.
 *   pending   → placed ✓, confirm (now), shipped, delivered
 *   confirmed → placed ✓, confirmed ✓, shipped (now: packing), delivered
 *   shipped   → placed ✓, confirmed ✓, shipped (now: with courier), delivered
 *   delivered → all ✓
 */
const timeline = (order: TrackedOrder): Step[] => {
  const courier = order.courier.name ?? "the courier";
  const confirmed = order.status !== "pending";
  const delivered = order.status === "delivered";

  return [
    { title: "Order placed", detail: when(order.placedAt), state: "done" },
    {
      title: "Confirmed by phone",
      // A step can be done without its own timestamp (the admin may skip straight to a later status).
      detail: order.reachedAt.confirmed ? when(order.reachedAt.confirmed) : confirmed ? "Confirmed" : "We'll call you to confirm",
      state: confirmed ? "done" : "now",
    },
    {
      title: "Shipped",
      detail: order.reachedAt.shipped
        ? `With ${courier} · ${when(order.reachedAt.shipped)}`
        : delivered
          ? order.courier.name
            ? `With ${courier}`
            : "Shipped"
          : confirmed
            ? "We're packing your order"
            : "After we confirm",
      state: delivered ? "done" : confirmed ? "now" : "todo",
    },
    {
      title: "Delivered",
      detail: order.reachedAt.delivered ? when(order.reachedAt.delivered) : "Pay cash when it arrives",
      state: delivered ? "done" : "todo",
    },
  ];
};

const Result = ({ order }: { order: TrackedOrder }) => {
  const pill = PILL[order.status];
  const stopped = STOPPED[order.status];
  const steps = timeline(order);

  return (
    <section aria-label={`Order ${order.orderNumber}`} className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-small text-ink-muted">Order</span>
          <span className="font-heading text-[17px] leading-5.5 font-bold text-ink">#{order.orderNumber}</span>
        </div>
        <span className={cn("rounded-full px-3 py-1 font-heading text-small font-semibold", pill.className)}>{pill.label}</span>
      </div>

      {stopped ? (
        <p role="status" className="rounded-md bg-media-frame p-3 text-label text-ink">
          {stopped}
        </p>
      ) : (
        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const last = index === steps.length - 1;
            return (
              <li key={step.title} className="flex gap-3" aria-current={step.state === "now" ? "step" : undefined}>
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                      step.state === "done" && "border-success bg-success text-on-brand",
                      step.state === "now" && "border-brand bg-brand",
                      step.state === "todo" && "border-control bg-surface",
                    )}
                  >
                    {step.state === "done" && <Check aria-hidden="true" strokeWidth={3} className="size-3.5" />}
                  </span>
                  {!last && (
                    <span aria-hidden="true" className={cn("h-10 w-0.5", step.state === "done" ? "bg-success" : "bg-border")} />
                  )}
                </div>
                <div className="flex flex-col pb-3">
                  <span
                    className={cn(
                      "text-body leading-5.5 font-semibold",
                      step.state === "now" ? "text-brand-bright" : step.state === "todo" ? "text-ink-muted" : "text-ink",
                    )}
                  >
                    {step.title}
                    <span className="sr-only">
                      {step.state === "done" ? " (done)" : step.state === "now" ? " (in progress)" : " (coming up)"}
                    </span>
                  </span>
                  <span className="text-small text-ink-muted">{step.detail}</span>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {(order.courier.name || order.courier.trackingId) && (
        <div className="flex flex-col gap-2 rounded-md bg-brand-tint p-3 text-label text-ink">
          <span>
            {order.courier.name && (
              <>
                Courier: <strong className="font-semibold">{order.courier.name}</strong>
              </>
            )}
            {order.courier.name && order.courier.trackingId && " · "}
            {order.courier.trackingId && (
              <>
                Tracking ID: <strong className="font-heading font-semibold">{order.courier.trackingId}</strong>
              </>
            )}
          </span>
          {order.courier.trackingUrl && (
            <a
              href={order.courier.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 self-start")}
            >
              Track with the courier <ExternalLink aria-hidden="true" strokeWidth={1.5} className="size-4" />
            </a>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-border pt-3">
        <ul className="flex flex-1 flex-col gap-2">
          {order.items.map((item) => (
            <li key={`${item.name}-${item.variantName}`} className="flex items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-media-frame">
                {item.image && <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />}
              </span>
              <span className="text-label text-ink-muted">
                {item.name}
                {item.variantName && `, ${item.variantName}`} × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <span className="flex shrink-0 flex-col items-end self-end">
          <span className="text-small text-ink-muted">Pay on delivery</span>
          <span className="font-heading text-card-price font-bold text-ink">
            {formatPrice(order.total)}
            {!order.deliveryFeeKnown && <span className="block text-small font-normal text-ink-muted">+ delivery</span>}
          </span>
        </span>
      </div>
    </section>
  );
};

export const TrackForm = () => {
  const id = useId();
  const params = useSearchParams();
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<{ message: string; field?: "orderNumber" | "phone" } | null>(null);
  const [searching, startSearching] = useTransition();

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searching) return;
    const data = new FormData(event.currentTarget);
    const input = { orderNumber: String(data.get("orderNumber") ?? ""), phone: String(data.get("phone") ?? "") };
    startSearching(async () => {
      const response = await trackOrder(input);
      if (response.ok) {
        setError(null);
        setResult(response.order);
      } else {
        setResult(null);
        setError({ message: response.message, field: response.field });
        if (response.field) document.getElementById(`${id}-${response.field}`)?.focus();
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <form noValidate onSubmit={submit} className="flex flex-col gap-3.5 rounded-lg border border-border bg-surface p-4 lg:p-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-orderNumber`} className="text-label font-semibold text-ink">
            Order number
          </label>
          <Input
            id={`${id}-orderNumber`}
            name="orderNumber"
            defaultValue={params.get("order") ?? ""}
            placeholder="MZ-1001"
            autoCapitalize="characters"
            aria-invalid={error?.field === "orderNumber" ? true : undefined}
            className="font-heading font-semibold"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-phone`} className="text-label font-semibold text-ink">
            Phone number
          </label>
          <PhoneInput id={`${id}-phone`} name="phone" invalid={error?.field === "phone"} />
        </div>
        {error && (
          <p role="alert" className="text-label text-danger">
            {error.message}
          </p>
        )}
        <Button type="submit" className="h-12" disabled={searching}>
          {searching && <Loader2 aria-hidden="true" className="animate-spin" />}
          Track order
        </Button>
      </form>
      {result && <Result order={result} />}
    </div>
  );
};
