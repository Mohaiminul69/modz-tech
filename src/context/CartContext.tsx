"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import { shopProducts, type ShopProduct } from "@data/shopProducts";

const CART_MAX_QTY = 9;

type CartLine = { id: string; qty: number };
export type CartItem = { id: string; qty: number; product: ShopProduct };

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (id: string, qty?: number) => void;
  incrementItem: (id: string) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

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

    const product = shopProducts.find((p) => p.id === id);
    toast.success(`Added ${product?.name ?? "item"} to cart`);
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

  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const product = shopProducts.find((p) => p.id === l.id);
          return product ? { id: l.id, qty: l.qty, product } : null;
        })
        .filter((i): i is CartItem => i !== null),
    [lines]
  );

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  const value = { items, count, addItem, incrementItem, decrementItem, removeItem };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
