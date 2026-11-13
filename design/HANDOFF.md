# Modz Tech — Design Handoff

This folder is the approved design for the Modz Tech online shop. Build the Next.js site to match it. The requirements doc (given separately) covers features, data and integrations; this folder covers how everything looks.

**Read in this order:** this file → `pages/mobile/home.html` → the other pages as you build them → `tokens.json` for exact colour values.

---

## 1. What's in here

```
design/
├── HANDOFF.md            ← this file (source of truth when anything disagrees)
├── tokens.json           ← colour tokens (light + dark themes), spacing, radii, shadows
├── design-system.md      ← brand book: voice, colour rules, imagery, logo rules
├── pages/
│   ├── mobile/           ← 375–390px designs, the primary target
│   └── desktop/          ← 1440px designs, content width 1200px
└── assets/
    ├── logos/            ← wordmark, circle logo, Facebook cover
    └── product-posts/    ← product photos (placeholders, see §9)
```

### How to read the page files
The pages were made in a design tool. They are HTML with **inline styles that carry every exact value** (colours, sizes, spacing, radii). Read them for layout, hierarchy, copy and values.

Ignore the design tool's template syntax — it is NOT something to reproduce:
- `<x-dc>`, `<helmet>`, `<sc-for list="{{...}}">`, `<sc-if value="{{...}}">` — tool templating. Repeated items (product cards, categories) are written once inside `<sc-for>`, with their data in the `<script type="text/x-dc">` block at the bottom of each file. Treat that data as sample content.
- `{{p.name}}`-style holes — filled from that sample data.
- Hex values written inline — in the real code these must come from theme tokens (§3), never hard-coded.

The files won't render perfectly if opened directly in a browser. That's expected.

---

## 2. Page → route map

| Mockup file | Route | Notes |
|---|---|---|
| `mobile/home.html`, `desktop/home.html` | `/` | |
| `mobile/shop.html`, `desktop/shop.html` | `/shop`, `/category/[slug]` | |
| `mobile/shop-filters-open.html` | (Sheet on `/shop`) | Mobile filter bottom sheet. Desktop uses the sidebar in `desktop/shop.html` |
| `mobile/search-no-results.html` | `/search?q=` | Empty state; results use the shop grid |
| `mobile/product.html`, `desktop/product.html` | `/product/[slug]` | |
| `mobile/cart.html`, `desktop/cart.html` | `/cart` | |
| `mobile/cart-empty.html` | `/cart` (empty) | |
| `mobile/checkout.html`, `desktop/checkout.html` | `/checkout` | Desktop uses a minimal header (no search/nav) |
| `mobile/order-confirmed.html` | `/order/[orderNumber]/confirmed` | |
| `mobile/track-order.html` | `/track` | |
| `mobile/login.html` | `/login` | |
| `mobile/signup.html` | `/signup` | |
| `mobile/contact.html` | `/contact` | |
| `mobile/not-found.html` | `not-found.tsx` | |

No desktop file for a page → use the mobile design centred in a max-width container (login/signup card ~440px wide, contact/track ~640px, 404 ~560px), with the desktop header and footer from `desktop/home.html`.

Admin panel (`/admin`) has no mockup: plain shadcn tables and forms using the same theme, mobile-friendly.

---

## 3. Theme tokens

Put these in `globals.css` as CSS variables and map them in the Tailwind theme / shadcn config. **Light is the only theme at launch.** (`tokens.json` also defines a dark theme — not needed now.)

### Page (light) tokens
| Token | Hex | Use |
|---|---|---|
| `bg` | `#f4f6f9` | Page background |
| `surface` | `#ffffff` | Cards, forms, panels, tab bars |
| `media-frame` | `#eef1f5` | Square background behind product photos; grey table headers |
| `ink` | `#0b0f16` | Headings, body, prices |
| `ink-muted` | `#4f5968` | Secondary text, product names on cards, captions, old prices |
| `silver` | `#5d6470` | Line icons on light page (category circles) |
| `border` | `#dde2e9` | Decorative hairlines, card outlines, dividers |
| `border-control` | `#848d9b` | Input, select, stepper and outline-button borders |
| `brand` | `#2563d0` | Primary button fill, badges "New", radio/checkbox accent |
| `on-brand` | `#ffffff` | Text on brand |
| `brand-bright` | `#1f5bc4` | Links, active tab, selected outline, focus ring |
| `brand-tint` | `#e8f0fd` | Trust strip, selected chips/radios, info notes, spec-group headers |
| `offer` | `#f07800` | Sale badge, countdown pill (light page) |
| `on-offer` | `#0b0b0b` | Text on offer — never white |
| `offer-ink` | `#a84a00` | "Save ৳71" text |
| `success` | `#0f7a4b` | "✓ In stock", completed timeline steps |
| `danger` | `#c62f35` | Remove, out of stock, errors |

### Dark brand zone ("chrome") tokens — same in every theme
Used only for: header, category nav bar, hero, promo/sale banners, footer, mobile bottom nav, login/signup top band.

| Token | Hex | Use |
|---|---|---|
| `chrome-bg` | `#05060a` | Ground of every dark zone |
| `chrome-surface` | `#141922` | Search field, countdown pill, inputs inside dark zones |
| `chrome-border` | `#2c3440` | Hairlines inside dark zones |
| `on-chrome` | `#eef1f5` | Text in dark zones |
| `on-chrome-muted` | `#9aa3b0` | Secondary text in dark zones |
| `chrome-silver` | `#d9dade` | Icons, eyebrow labels in dark zones |
| `chrome-accent` | `#66aae7` | Active nav item, cart count bubble, diagonal light streaks |
| `offer` (dark) | `#fc7b03` | Sale badge inside dark zones |

### Rules
- One solid blue primary button per view region. Secondary = white with `border-control` outline.
- Orange means offer, nothing else. Never orange buttons or links.
- `brand-bright` is the focus ring: 2px solid, 2px offset, on every interactive element.
- The logo images have a **black background baked in**: only ever place them on `chrome-bg`.

---

## 4. Typography

**This section overrides the fonts listed in `tokens.json` / `design-system.md`** (those predate the final type pass).

Load with `next/font/google`:
- **Sora** (400, 600, 700) — all headings, all prices and numbers, badges, chip labels
- **Hind Siliguri** (400, 500, 600) — body text, labels, buttons, inputs (also covers Bangla and ৳)
- **Saira** (600) — only the small uppercase "eyebrow" labels (`letter-spacing: 0.24em`, 11–12px). Used on the hero, Exclusive / Top selling / New arrivals sections, product brand label, login band. Nowhere else.

| Role | Mobile | Desktop | Font / weight |
|---|---|---|---|
| Hero headline | 34/38 | 56/60 | Sora 700, `-0.02em` (desktop `-0.03em`) |
| Page title (h1) | 26/32 | 32/38 | Sora 700, `-0.02em` |
| Section title | 22/28 | 28/34 | Sora 700, `-0.02em` |
| Card/panel title | 18/24 | 20/26 | Sora 700, `-0.02em` |
| Product name on card | 14/20, 2-line clamp, `ink-muted`, weight 400 | 15/22 | Hind Siliguri |
| Card price | 18/22 bold | 20/26 | Sora 700, `ink` |
| Product page price | 30/34 | 36/40 | Sora 700 |
| Old price | 12–15px, line-through, `ink-muted` | | Sora 400 |
| Body | 15/24 | 15/24 | Hind Siliguri 400 |
| Label / button | 14–15px, 600 | | Hind Siliguri |
| Small / caption | 12/16 | 13/18 | Hind Siliguri |
| Eyebrow | 11/16 | 12/16 | Saira 600, uppercase, `0.24em` |

Buttons and badges are sentence case ("Order now", "Sale", "New") — no all-caps buttons.

Prices: `৳` touching the number, thousands commas, no decimals → `৳729`, `৳1,458`. Write a single `formatPrice()` helper.

---

## 5. Spacing, radii, shadows, layout

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64.
- Mobile page gutter 16px. Product grid gap 12px mobile, 20–24px desktop.
- Desktop: header/footer full-bleed, content `max-width: 1200px; margin: 0 auto`.
- Grids: home product rows 2 cols mobile / 5 cols desktop; shop grid 2 / 4 (with 264px sidebar).
- Radii: badges 4px, buttons/inputs/tiles 8px, cards/panels/images 12px, chips and countdown pills fully round, bottom sheet top corners 16px.
- `shadow-card`: `0 1px 2px rgba(11,15,22,.06), 0 6px 18px rgba(11,15,22,.08)` on product cards and summary panels.
- `shadow-glow` (card hover): `0 0 0 1px rgba(31,91,196,.35), 0 8px 24px rgba(31,91,196,.18)`.
- Touch targets ≥ 44px (buttons 44–52px tall).
- Sticky elements: mobile header, mobile bottom nav (home/shop), mobile bottom order bar (product/cart/checkout), desktop shop sidebar and cart/checkout summary.

---

## 6. Components → shadcn/ui

Build with shadcn components restyled to the tokens above. Make these shared components:

| Component | Seen in | Notes |
|---|---|---|
| `SiteHeader` (mobile + desktop) | all pages | Dark. Mobile: menu/back, wordmark, account, cart w/ count; search field on home/shop. Desktop: logo, centred search with button, Track order / Log in / Cart; category nav row under it with "Offers" right-aligned in orange |
| `CheckoutHeader` | desktop checkout | Logo, "Secure checkout", back to cart |
| `BottomNav` | mobile home/shop | Home, Categories, Cart, Message us (Messenger) |
| `SiteFooter` | all | Desktop: 4 columns (brand, Shop, Help, newsletter+contact). Mobile: stacked; short version on secondary pages |
| `ProductCard` | grids | 1:1 image on `media-frame`, optional Sale/New badge top-left, name (2 lines), price + old price, spec line, button |
| `PriceTag` | everywhere | now / was / save |
| `Badge` | Sale (orange), New (blue), stock (text) |
| `CategoryTile` | home | Round icon tile + label (mobile 5×2 grid, desktop 10 in a row) |
| `TrustStrip` | home, product, cart | `brand-tint` box, 4 items with line icons |
| `SectionHeader` | home | optional eyebrow, title, "Show all" link |
| `HeroBanner`, `PromoBanner` | home | Dark, 1–2 diagonal `chrome-accent` lines (SVG), countdown pill |
| `FilterPanel` | shop | shadcn `Sheet` (mobile, bottom) / sticky sidebar (desktop), same fields |
| `QuantityStepper` | product, cart | − value + |
| `PhoneInput` | checkout, login, signup, track, contact | Fixed "+880" prefix box + input |
| `OptionCard` (radio) | checkout delivery area + payment | Selected = 2px `brand-bright` border + `brand-tint` fill; disabled = muted with "Coming soon" |
| `GoogleButton` | login, signup, checkout | White, `border-control` outline, official Google "G" |
| `OrderTimeline` | track order | Done = green ✓, current = blue dot, upcoming = hollow |
| `EmptyState` | cart empty, no results, 404 | Icon in `brand-tint` circle, heading, text, CTA, "Popular right now" row |

shadcn primitives in use: Button, Input, Textarea, Select, Checkbox, RadioGroup, Tabs, Sheet, Dialog, Table, Badge, Toast/Sonner, Separator.

---

## 7. Icons

- **Lucide** (`lucide-react`), `strokeWidth={1.5}`, 18–24px, rounded caps. Colour: `chrome-silver` in dark zones, `silver`/`ink` on the page, `brand-bright` for active/accent.
- Common: ShoppingCart, Search, User, Menu, ChevronLeft/Right/Down, Truck, ShieldCheck, Banknote (COD), Headphones, Phone, Mail, MessageCircle, Share2, Trash2, Eye, Lock, Clock, X, Check, LayoutGrid, Home.
- Category icons: closest Lucide match (Headphones/Earbuds, Speaker, Mic, Mic2/karaoke, Watch, MapPin/tracker, Plug, Zap/charger, Tag/offers, Box/covers) or small custom SVGs in the same line style.
- Brand logos (Google, Facebook/Messenger): official SVGs or Simple Icons. No emoji anywhere.

---

## 8. Copy & voice

- Short confident sentences ending in a full stop: "Premium sound. Budget price.", "Tech that connects. Quality that lasts.", "Your cart is empty.", "Signal lost."
- Speak to the customer as "you"; the shop is "we".
- Trust lines near buy buttons: Cash on delivery · 100% authentic · Delivery all over Bangladesh.
- Never promise a warranty unless the product data says so.
- Keep the mockup's microcopy unless a requirement changes it.

---

## 9. Assets

| File | Use |
|---|---|
| `assets/logos/modz-tech-wordmark.webp` | Header, footer, login band. Dark zones only. (Raster on black — ask for a transparent/SVG version later.) |
| `assets/logos/modz-tech-logo-circle.webp` / `-original.png` | Favicon, app icons, social/OG fallback |
| `assets/logos/modz-tech-cover.webp` | Brand reference (Facebook cover); not used on the site |
| `assets/product-posts/*.webp` | **Placeholders only.** These are Facebook marketing posts with text baked in. Use them in the seed data so pages aren't empty; real products will use clean photos uploaded to Cloudinary from the admin panel. Hero/promo banners can keep using them. |

---

## 10. Placeholders in the mockup

Anything in square brackets is unknown and must come from the database or admin settings, not be hard-coded: `৳[price]`, `৳[fee]`, `৳[total]`, `[X] working days`, `[YOUR PHONE NUMBER]`, `[YOUR EMAIL]`, `[10am–10pm]`, `[SKU]`, `[VERSION]`, `[PORT]`, `[WEIGHT]`, `[date]`, `#MZ-[0000]`, `[N] products`, `[courier]`.

Also mockup-only: the countdown values, cart count "2", the sample cart (EQ34 Plus × 2 = ৳1,458), "Photo 2/3/4" thumbnail boxes, and the static filter selections.

Known real data: **Hoco EQ34 Plus** — ৳729 (regular ৳800), ANC + ENC, up to 32h total playtime, IPX5, black.
