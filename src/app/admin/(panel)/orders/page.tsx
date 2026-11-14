import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdminPage } from "@/lib/admin-auth";
import { formatDhakaDateTime, listOrders } from "@/lib/admin/data";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";
import { formatBdPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

// Admin pages read the sign-in session on every request, so navigating to them may wait for
// the server (Next.js "instant navigation" check opts out; the loading skeleton still shows).
export const instant = false;

export const metadata: Metadata = { title: "Orders" };

const OrdersPage = async ({ searchParams }: PageProps<"/admin/orders">) => {
  await requireAdminPage();
  const params = await searchParams;
  const status = ORDER_STATUSES.find((value) => value === params.status) as OrderStatus | undefined;
  const page = Math.max(1, Number.parseInt(String(params.page ?? "1"), 10) || 1);
  const { rows, total, statusCounts, pageCount } = await listOrders(status, page);
  const all = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);

  const filterHref = (value?: OrderStatus) => (value ? `/admin/orders?status=${value}` : "/admin/orders");
  const pageHref = (number: number) => `${filterHref(status)}${status ? "&" : "?"}page=${number}`;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-page-title text-ink">Orders</h1>
        <span className="text-label text-ink-muted">{all} total</span>
      </div>

      <nav aria-label="Filter by status" className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[undefined, ...ORDER_STATUSES].map((value) => {
          const active = value === status;
          return (
            <Link
              key={value ?? "all"}
              href={filterHref(value)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-label font-semibold",
                active ? "border-brand-bright bg-brand-tint text-brand-bright" : "border-control bg-surface text-ink",
              )}
            >
              {value ? ORDER_STATUS_LABELS[value] : "All"}
              <span className="text-small font-normal text-ink-muted">{value ? statusCounts[value] : all}</span>
            </Link>
          );
        })}
      </nav>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-control bg-surface p-8 text-center text-ink-muted">
          No {status ? ORDER_STATUS_LABELS[status].toLowerCase() : ""} orders yet.
        </p>
      ) : (
        <>
          {/* Phones: cards */}
          <ul className="flex flex-col gap-2 lg:hidden">
            {rows.map((row) => (
              <li key={row.orderNumber}>
                <Link
                  href={`/admin/orders/${row.orderNumber}`}
                  className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-3 hover:border-brand-bright"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-heading font-bold text-ink">{row.orderNumber}</span>
                    <StatusBadge status={row.status} />
                  </span>
                  <span className="text-label text-ink">
                    {row.name} · {formatBdPhone(row.phone)}
                  </span>
                  <span className="flex justify-between text-small text-ink-muted">
                    <span>
                      {formatDhakaDateTime(row.createdAt)} · {row.district}
                    </span>
                    <span className="font-heading font-semibold text-ink">{formatPrice(row.total)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop: table */}
          <div className="hidden overflow-hidden rounded-lg border border-border bg-surface lg:block">
            <table className="w-full text-left text-label">
              <thead className="bg-media-frame text-small text-ink-muted">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Order</th>
                  <th className="px-4 py-2.5 font-semibold">Placed</th>
                  <th className="px-4 py-2.5 font-semibold">Customer</th>
                  <th className="px-4 py-2.5 font-semibold">Area</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Items</th>
                  <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.orderNumber} className="border-t border-border hover:bg-brand-tint/40">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${row.orderNumber}`} className="font-heading font-bold text-brand-bright hover:text-brand">
                        {row.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{formatDhakaDateTime(row.createdAt)}</td>
                    <td className="px-4 py-3">
                      {row.name}
                      <span className="block text-small text-ink-muted">{formatBdPhone(row.phone)}</span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {row.area === "inside" ? "Inside Dhaka" : row.district}
                    </td>
                    <td className="px-4 py-3 text-right">{row.units}</td>
                    <td className="px-4 py-3 text-right font-heading font-semibold">
                      {formatPrice(row.total)}
                      {row.deliveryFee === null && <span className="block text-small font-normal text-ink-muted">+ delivery</span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <nav aria-label="Pages" className="flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Newer
                </Link>
              )}
              <span className="text-label text-ink-muted">
                Page {page} of {pageCount} · {total} orders
              </span>
              {page < pageCount && (
                <Link href={pageHref(page + 1)} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Older
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersPage;
