import { AREA_LABELS, type DeliveryArea } from "./checkout-schema";
import { formatPrice } from "./format";
import { SITE_URL } from "./site-url";

/*
 * Staff alerts in the "Modz Tech Order Alerts" Telegram group.
 * Server only. An alert must never break an order or a contact message, so every failure
 * here is logged and swallowed.
 */

const API = "https://api.telegram.org";

/** Text inside Telegram HTML messages: only <, > and & need escaping. */
const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Telegram refuses localhost links, so links are added only on the live site.
const adminLink = (path: string, label: string) =>
  SITE_URL.startsWith("https://") ? `\n<a href="${SITE_URL}${path}">${label}</a>` : "";

type TelegramResponse = {
  ok: boolean;
  description?: string;
  parameters?: { migrate_to_chat_id?: number };
};

const send = async (token: string, chatId: string, text: string): Promise<TelegramResponse> => {
  const response = await fetch(`${API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
    signal: AbortSignal.timeout(8000),
  });
  return (await response.json()) as TelegramResponse;
};

export const sendTelegramAlert = async (text: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return; // Not set up (e.g. a fresh local copy): skip quietly.

  try {
    const result = await send(token, chatId, text);
    if (result.ok) return;

    // The group became a "supergroup" and got a new ID: deliver this alert there anyway.
    const newId = result.parameters?.migrate_to_chat_id;
    if (newId) {
      console.error(
        `Telegram group was upgraded to a supergroup. Set TELEGRAM_CHAT_ID=${newId} in .env.local and on Vercel.`,
      );
      const retry = await send(token, String(newId), text);
      if (!retry.ok) console.error("Telegram alert failed after migration:", retry.description);
      return;
    }
    console.error("Telegram alert failed:", result.description);
  } catch (error) {
    console.error("Telegram alert failed:", error);
  }
};

type OrderAlert = {
  orderNumber: string;
  customer: { name: string; phone: string; email?: string };
  delivery: { area: DeliveryArea; district: string; address: string; note?: string };
  items: { name: string; variantName?: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number | null;
  total: number;
};

export const orderAlertText = (order: OrderAlert) => {
  const lines = order.items.map(
    (item) =>
      `${item.quantity}× ${escape(item.name)}${item.variantName ? ` (${escape(item.variantName)})` : ""}: ${formatPrice(item.price * item.quantity)}`,
  );
  const fee = order.deliveryFee === null ? "to be confirmed" : formatPrice(order.deliveryFee);

  return [
    `🛒 <b>New order ${order.orderNumber}</b>`,
    "",
    `👤 ${escape(order.customer.name)} · <code>${order.customer.phone}</code>`,
    `📍 ${AREA_LABELS[order.delivery.area]}, ${escape(order.delivery.district)}`,
    escape(order.delivery.address),
    order.delivery.note ? `📝 ${escape(order.delivery.note)}` : null,
    "",
    ...lines,
    `Delivery: ${fee}`,
    `<b>Total: ${formatPrice(order.total)}</b> (cash on delivery)`,
  ]
    .filter((line) => line !== null)
    .join("\n")
    .concat(adminLink(`/admin/orders/${order.orderNumber}`, "Open in admin →"));
};

export const contactAlertText = (message: { name: string; phone: string; message: string }) =>
  [
    `✉️ <b>New contact message</b>`,
    "",
    `👤 ${escape(message.name)} · <code>${message.phone}</code>`,
    "",
    escape(message.message),
  ]
    .join("\n")
    .concat(adminLink("/admin/messages", "Open messages →"));
