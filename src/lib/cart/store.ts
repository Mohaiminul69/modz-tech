"use client";

import { useSyncExternalStore } from "react";

/*
 * Guest cart, saved in localStorage (requirements: "Cart saved in localStorage
 * for guests"). Only IDs and quantities are stored; prices and stock are always
 * read fresh from the server when the cart is shown.
 * TODO(auth stage): sync to the account when the shopper is logged in.
 */

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  quantity: number;
};

const STORAGE_KEY = "modz-cart-v1";
const CHANGE_EVENT = "modz-cart-change";
export const MAX_LINE_QUANTITY = 10;

const EMPTY: CartItem[] = [];
let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = EMPTY;

const isCartItem = (value: unknown): value is CartItem => {
  const item = value as CartItem;
  return (
    typeof item?.productId === "string" &&
    typeof item.variantId === "string" &&
    typeof item.slug === "string" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
};

const read = (): CartItem[] => {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.): behave like an empty cart.
  }
  // Same string → same array, so useSyncExternalStore doesn't loop.
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedItems = Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
};

const write = (items: CartItem[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or blocked: the change lives until the page reloads.
    cachedRaw = JSON.stringify(items);
    cachedItems = items;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (onChange: () => void) => {
  // "storage" keeps other open tabs in sync.
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

/** Cart items, or null while the page is still hydrating (server render). */
export const useCart = (): CartItem[] | null => useSyncExternalStore(subscribe, read, () => null);

/** Total units in the cart (0 during the server render). */
export const useCartCount = () => {
  const items = useCart();
  return items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;
};

export const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1, maxQuantity = MAX_LINE_QUANTITY) => {
  const items = read();
  const existing = items.find((line) => line.variantId === item.variantId);
  const limit = Math.min(maxQuantity, MAX_LINE_QUANTITY);
  write(
    existing
      ? items.map((line) =>
          line.variantId === item.variantId ? { ...line, quantity: Math.min(limit, line.quantity + quantity) } : line,
        )
      : [...items, { ...item, quantity: Math.min(limit, quantity) }],
  );
};

export const setCartQuantity = (variantId: string, quantity: number) =>
  write(
    read().map((line) =>
      line.variantId === variantId
        ? { ...line, quantity: Math.max(1, Math.min(MAX_LINE_QUANTITY, Math.round(quantity))) }
        : line,
    ),
  );

export const removeFromCart = (variantId: string) => write(read().filter((line) => line.variantId !== variantId));

export const clearCart = () => write([]);
