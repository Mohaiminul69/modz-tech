"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { type CartLine, getCartLines } from "@/app/cart/actions";
import { type CartItem, removeFromCart, useCart } from "./store";

export type CartRow = { item: CartItem; line: CartLine };

/*
 * The browser cart joined with current server data (name, photo, price, stock).
 * Lines whose product disappeared are removed from the cart automatically.
 * `rows` is null until both the cart and the server data are ready.
 */
export const useCartLines = () => {
  const items = useCart();
  const [lines, setLines] = useState<Map<string, CartLine> | null>(null);
  const [, startTransition] = useTransition();

  // Refetch when the set of products changes (not on every quantity change).
  const key = items?.map((item) => item.variantId).join(",") ?? null;

  const refresh = useCallback(() => {
    if (!items) return;
    startTransition(async () => {
      const result = await getCartLines(items);
      const byVariant = new Map(result.map((line) => [line.variantId, line]));
      setLines(byVariant);
      const missing = items.filter((item) => !byVariant.has(item.variantId));
      for (const item of missing) removeFromCart(item.variantId);
      if (missing.length > 0) toast.info("Some items are no longer available and were removed from your cart.");
    });
    // `items` is read through `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (key !== null && key !== "") refresh();
  }, [key, refresh]);

  const ready = items !== null && (items.length === 0 || lines !== null);
  const rows: CartRow[] | null = ready
    ? items.flatMap((item) => {
        const line = lines?.get(item.variantId);
        return line ? [{ item, line }] : [];
      })
    : null;

  return { items, rows, refresh };
};

/** Totals over lines that can actually be ordered (in stock; quantity capped at stock). */
export const cartTotals = (rows: CartRow[]) => {
  const billable = rows.flatMap(({ item, line }) =>
    line.stock > 0 ? [{ line, quantity: Math.min(item.quantity, line.stock) }] : [],
  );
  return {
    billable,
    units: billable.reduce((sum, row) => sum + row.quantity, 0),
    subtotal: billable.reduce((sum, row) => sum + row.line.price * row.quantity, 0),
    savings: billable.reduce((sum, row) => sum + ((row.line.oldPrice ?? row.line.price) - row.line.price) * row.quantity, 0),
    /** Lines that are sold out or have fewer left than requested. */
    problems: rows.filter(({ item, line }) => line.stock === 0 || item.quantity > line.stock),
  };
};
