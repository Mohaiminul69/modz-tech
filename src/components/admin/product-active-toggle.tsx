"use client";

import { setProductActive } from "@/app/admin/actions/products";
import { cn } from "@/lib/utils";
import { useAdminAction } from "./use-admin-action";

// Show/hide a product on the shop without deleting it.
export const ProductActiveToggle = ({ id, active }: { id: string; active: boolean }) => {
  const { pending, run } = useAdminAction();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={active ? "Shown on the shop (click to hide)" : "Hidden from the shop (click to show)"}
      disabled={pending}
      onClick={() => run(() => setProductActive(id, !active))}
      className={cn(
        "flex h-9 shrink-0 items-center rounded-full border px-3 text-small font-semibold",
        active ? "border-success/40 bg-success/10 text-success" : "border-control bg-surface text-ink-muted",
      )}
    >
      {active ? "Shown" : "Hidden"}
    </button>
  );
};
