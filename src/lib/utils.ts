import { createCn } from "cn/config";

/*
 * Class merger that knows the Modz Tech theme tokens (src/app/globals.css).
 * Without this, custom sizes like `text-small` are mistaken for colours and get
 * dropped when merged with `text-ink-muted` etc.
 * Keep these lists in sync with the @theme block in globals.css.
 * Always import `cn` from "@/lib/utils", never from "cn" directly
 * (fix the import in any component added later with `shadcn add`).
 */
export const cn = createCn({
  extend: {
    theme: {
      text: [
        "hero",
        "hero-lg",
        "page-title",
        "page-title-lg",
        "section",
        "section-lg",
        "promo-lg",
        "panel-title",
        "panel-title-lg",
        "card-name",
        "card-name-lg",
        "card-price",
        "card-price-lg",
        "price",
        "price-lg",
        "body",
        "lead",
        "label",
        "small",
        "small-lg",
        "eyebrow",
        "eyebrow-lg",
      ],
      shadow: ["card", "glow"],
      container: ["content"],
      font: ["heading", "eyebrow"],
    },
  },
});
