"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const CART_MAX_QTY = 9;

type CartLine = { id: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  addItem: (id: string, qty?: number) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// NOTE: lines only track id/qty for now. Once the shop's product data is
// migrated, join `lines` against it (see the old mockup's CartContext) to
// expose full cart `items`.
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>([]);

  const addItem = (id: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(CART_MAX_QTY, l.qty + qty) } : l
        );
      }
      return [...prev, { id, qty: Math.min(CART_MAX_QTY, qty) }];
    });
  };

  const incrementItem = (id: string) =>
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, qty: Math.min(CART_MAX_QTY, l.qty + 1) } : l
      )
    );

  const decrementItem = (id: string) =>
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
    );

  const removeItem = (id: string) =>
    setLines((prev) => prev.filter((l) => l.id !== id));

  const count = lines.reduce((sum, l) => sum + l.qty, 0);

  const value = { lines, count, addItem, incrementItem, decrementItem, removeItem };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
