import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, Phone } from "lucide-react";
import { siWhatsapp } from "simple-icons";
import { CourierForm, NotesForm, RestoreStockButton, StatusForm } from "@/components/admin/order-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { BrandIcon } from "@/components/icons/brand-icon";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/admin-auth";
import { formatDhakaDateTime, getOrderDetail } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { formatBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const generateMetadata = async ({ params }: PageProps<"/admin/orders/[orderNumber]">): Promise<Metadata> => ({
  title: (await params).orderNumber,
});

const cardClass = "flex flex-col gap-3 rounded-lg border border-border bg-surface p-4";

// Past outcomes worth warning about before shipping again.
const WARN: OrderStatus[] = ["returned", "cancelled", "not_reachable"];

const OrderDetailPage = async ({ params }: PageProps<"/admin/orders/[orderNumber]">) => {
  await requireAdminPage();
  const { orderNumber } = await params;
  const order = await getOrderDetail(decodeURIComponent(orderNumber));
  if (!order) notFound();

  const phoneIntl = `+880${order.customer.phone.slice(1)}`;
  const history = Object.entries(order.phoneHistory) as [OrderStatus, number][];
  const previous = history.reduce((sum, [, count]) => sum + count, 0);
  const warnings = history.filter(([status]) => WARN.includes(status));
  const canRestore = ["cancelled", "returned", "not_reachable"].includes(order.status) && !order.stockRestored;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 self-start text-label font-semibold text-brand-bright">
        <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-4" /> All orders
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-page-title text-ink">{order.orderNumber}</h1>
        <StatusBadge status={order.status} className="text-label" />
        <span className="text-label text-ink-muted">Placed {formatDhakaDateTime(order.createdAt)}</span>
      </div>

      {previous > 0 && (
        <p
          role="status"
          className={cn(
            "flex items-start gap-2.5 rounded-md border p-3 text-label",
            warnings.length > 0 ? "border-danger/40 bg-danger/5 text-ink" : "border-border bg-surface text-ink-muted",
          )}
        >
          <AlertTriangle
            aria-hidden="true"
            strokeWidth={1.5}
            className={cn("mt-0.5 size-5 shrink-0", warnings.length > 0 ? "text-danger" : "text-ink-muted")}
          />
          <span>
            This phone number has {previous} other {previous === 1 ? "order" : "orders"}:{" "}
            {history.map(([status, count]) => `${count} ${ORDER_STATUS_LABELS[status].toLowerCase()}`).join(", ")}.
          </span>
        </p>
      )}

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="flex flex-col gap-4">
          <section aria-labelledby="customer-title" className={cardClass}>
            <h2 id="customer-title" className="text-panel-title text-ink">
              Customer
            </h2>
            <dl className="grid grid-cols-[110px_minmax(0,1fr)] gap-x-3 gap-y-2 text-label">
              <dt className="text-ink-muted">Name</dt>
              <dd className="text-ink">{order.customer.name}</dd>
              <dt className="text-ink-muted">Phone</dt>
              <dd className="font-heading text-ink">{formatBdPhone(order.customer.phone)}</dd>
              {order.customer.email && (
                <>
                  <dt className="text-ink-muted">Email</dt>
                  <dd className="break-all text-ink">{order.customer.email}</dd>
                </>
              )}
              <dt className="text-ink-muted">Area</dt>
              <dd className="text-ink">
                {order.delivery.area === "inside" ? "Inside Dhaka" : "Outside Dhaka"} · {order.delivery.district}
              </dd>
              <dt className="text-ink-muted">Address</dt>
              <dd className="whitespace-pre-line text-ink">{order.delivery.address}</dd>
              {order.delivery.note && (
                <>
                  <dt className="text-ink-muted">Note</dt>
                  <dd className="whitespace-pre-line text-ink">{order.delivery.note}</dd>
                </>
              )}
            </dl>
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${phoneIntl}`} className={cn(buttonVariants(), "gap-2")}>
                <Phone aria-hidden="true" strokeWidth={1.5} /> Call
              </a>
              <a
                href={`https://wa.me/${phoneIntl.slice(1)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }), "gap-2")}
              >
                <BrandIcon icon={siWhatsapp} className="size-4.5" /> WhatsApp
              </a>
            </div>
          </section>

          <section aria-labelledby="items-title" className={cardClass}>
            <h2 id="items-title" className="text-panel-title text-ink">
              Items
            </h2>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={`${item.sku}-${item.name}`} className="flex items-center gap-3">
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-media-frame">
                    {item.image && <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />}
                  </span>
                  <span className="flex flex-1 flex-col text-label">
                    <Link href={`/admin/products/${item.productId}`} className="text-ink hover:text-brand-bright">
                      {item.name}
                      {item.variantName && `, ${item.variantName}`}
                    </Link>
                    <span className="text-small text-ink-muted">
                      {item.sku} · {formatPrice(item.price)} × {item.quantity}
                    </span>
                  </span>
                  <span className="font-heading font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="flex flex-col gap-2 border-t border-border pt-3 text-label">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="font-heading">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Delivery</dt>
                <dd className="font-heading">
                  {order.deliveryFee !== null ? formatPrice(order.deliveryFee) : "Not set (confirm on the call)"}
                </dd>
              </div>
              <div className="flex justify-between text-body font-semibold">
                <dt>Collect on delivery</dt>
                <dd className="font-heading">
                  {formatPrice(order.total)}
                  {order.deliveryFee === null && " + delivery"}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="history-title" className={cardClass}>
            <h2 id="history-title" className="text-panel-title text-ink">
              History
            </h2>
            <ol className="flex flex-col gap-2 text-label">
              {[...order.statusHistory].reverse().map((entry, index) => (
                <li key={`${entry.at}-${index}`} className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={entry.status} />
                  <span className="text-ink-muted">{formatDhakaDateTime(entry.at)}</span>
                  {entry.note && <span className="w-full text-ink">{entry.note}</span>}
                </li>
              ))}
            </ol>
            {order.stockRestored && <p className="text-small text-success">Items were put back in stock.</p>}
            {order.ip && <p className="text-small text-ink-muted">Placed from IP {order.ip}</p>}
          </section>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <StatusForm key={order.status} orderNumber={order.orderNumber} status={order.status} />
          <CourierForm orderNumber={order.orderNumber} courier={order.courier} />
          <NotesForm orderNumber={order.orderNumber} notes={order.adminNotes} />
          {canRestore && <RestoreStockButton orderNumber={order.orderNumber} />}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
