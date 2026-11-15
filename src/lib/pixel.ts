/*
 * Facebook (Meta) Pixel events from the browser. Safe to call anywhere on the client:
 * it does nothing until the Pixel is loaded (production, NEXT_PUBLIC_FB_PIXEL_ID set).
 * Standard events: https://developers.facebook.com/docs/meta-pixel/reference
 */

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

type PixelEvent = "AddToCart" | "InitiateCheckout" | "Purchase";

type PixelParams = {
  value: number;
  currency: "BDT";
  content_ids?: string[];
  content_name?: string;
  content_type?: "product";
  num_items?: number;
};

/** `eventId` (e.g. the order number) lets Facebook drop duplicates of the same event. */
export const trackPixel = (event: PixelEvent, params: PixelParams, eventId?: string) => {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", event, params, eventId ? { eventID: eventId } : undefined);
  } catch {
    // Tracking must never break the shop.
  }
};
