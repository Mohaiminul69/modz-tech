import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/order-status";

const tone: Record<OrderStatus, string> = {
  pending: "bg-offer/15 text-offer-ink",
  confirmed: "bg-brand-tint text-brand-bright",
  shipped: "bg-brand-tint text-brand-bright",
  delivered: "bg-success/10 text-success",
  not_reachable: "bg-danger/10 text-danger",
  cancelled: "bg-media-frame text-ink-muted",
  returned: "bg-danger/10 text-danger",
};

export const StatusBadge = ({ status, className }: { status: OrderStatus; className?: string }) => (
  <span
    className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-small font-semibold whitespace-nowrap", tone[status], className)}
  >
    {ORDER_STATUS_LABELS[status]}
  </span>
);
