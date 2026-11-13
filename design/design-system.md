Modz Tech is an online gadget and mobile-accessories shop in Bangladesh: earbuds, earbud covers, speakers, a karaoke device, microphones, smartwatches, smart trackers, adapters and chargers. The look is **light page, dark brand accents**: shopping happens on clean off-white pages, framed by a near-black header, hero, promo banners and footer in brushed silver and one electric blue, with orange saved for offers. Premium feel, budget-friendly prices, familiar and trustworthy to shop.

Design mobile-first. Most customers arrive from Facebook on a phone; desktop must look clean and work, but every screen is designed at 375px first.

## Voice and copy

- **Short, confident statements that end in a full stop.** Real examples from the brand's posts: "Tech that connects. Quality that lasts." · "Power without the wait." · "One smart watch. Eight strap styles." · "Clearer sound. Greater freedom."
- Lead with the benefit, then the spec: "Up to 32 hours total playtime", "45W USB-C fast charging".
- Speak to the customer as "you"; the shop is "we". No emoji in headings or buttons.
- English UI with Bangla where it helps trust (delivery notes, COD line). Both set in `body`; Hind Siliguri covers both scripts and the ৳ sign.
- Prices: the taka sign touching the number, no decimals: **৳729**, old price **৳800** struck through beside it. Discounts as "Save ৳71" in `offer-ink`.
- Trust lines appear near every buy button: "Cash on delivery", "100% authentic", "Delivery all over Bangladesh". Do not promise a warranty unless a product page states one.
- Buttons are verbs: "Order now", "Add to cart", "Confirm order". Primary checkout is cash on delivery; bKash and SSLCommerz come later, so leave room for a payment-method choice but show COD only.

## Colour

- Default theme is **Light**. Product grids, category and product pages, cart and checkout sit on `bg` (off-white); cards, forms and panels on `surface` (white); drawers, sticky bars and modals on `surface-raised`. **Dark** is an optional alternate theme; never mix the two on one screen.
- **Dark brand zones** stay near-black in every theme: the site header, the hero banner, promo banners and the footer. Wrap them in `mz-chrome` and use the chrome tokens only: ground `chrome-bg`, inner fields `chrome-surface`, hairlines `chrome-border`, text `on-chrome` / `on-chrome-muted`, eyebrows and icons `chrome-silver`, links and active states `chrome-accent`. Never use page tokens inside a dark zone or chrome tokens on the light page.
- Text on the page: `ink` for headings and body, `ink-muted` for secondary copy, `silver` (a steel grey in light) for eyebrow labels and line icons.
- **Blue is the brand.** `brand` fills the one primary button per view (with `on-brand` text). `brand-bright` is for links, the active tab and the focus ring on the light page. Keep blue to accents: pages read white and near-black, the dark zones black and silver.
- **Orange means offer, nothing else.** `offer` fills the ON SALE badge and countdown pill (text in `on-offer`, never white); `offer-ink` sets the discount amount. Never use orange for buttons, links or categories.
- `brand-tint` is the quiet blue ground for the COD/trust strip, selected filter chips and notes.
- `success` and `danger` always come with a word or icon ("In stock ✓", "Out of stock").
- Every text pair named in a token note holds 4.5:1 or better in both themes (light default: `ink` 17.7:1, `ink-muted` 6.6:1, `brand-bright` 5.8:1, `offer-ink` 5.3:1 on `bg`); control edges use `border-control` (3:1+). `border` is for decorative hairlines only.

## Type

- **Saira** (`display`) for headings, prices and eyebrows: geometric and technical, like the MODZ letterforms. **Hind Siliguri** (`body`) for everything you read, English and Bangla. Both are Google Fonts.
- Hero: `display-xl`; section titles: `heading-lg`; card product names: `heading-sm`, two lines max then ellipsis.
- `eyebrow` is the brand signature: uppercase, 0.24em tracking, like "TECH THAT CONNECTS" on the cover. Use it above section titles and on category tiles, in `silver` or `brand-bright`.
- Prices in `price-lg` (product page, sticky bar) or `price-sm` (cards, cart); old price in `price-was` + `ink-muted` + line-through.
- Bump `display-xl` to 56px and `heading-lg` to 32px from 1024px; everything else keeps its size.

## Layout

- Page side gutter `space-4` on phones; max content width 1200px on desktop.
- Product grid: 2 columns with `space-3` gap on phones, 3 at 768px, 4–5 at 1024px with `space-6` gap.
- Section rhythm: `space-8` between home sections on phones, `space-12` on desktop.
- Home page order (Gadget Breeze-style): dark sticky header with logo, search and cart → dark hero banner → light page: category row of tiles (horizontal scroll on phones) → trust strip → New arrivals → a dark promo banner for the current offer → each category's best sellers → dark footer with logo, contact, Facebook link and policies.
- The page alternates: dark top (header + hero), light body, at most one dark promo band in the middle, dark footer. Never two dark bands back to back in the body.
- On product pages, keep a sticky bottom bar on phones with `price-lg` and an "Order now" button.
- Touch targets at least 44px tall.

## Shape, depth and motion

- Corners stay tight; the brand is angular. `radius-sm` badges, `radius-md` buttons, inputs and tiles, `radius-lg` cards and drawers. `radius-pill` only for chips and the countdown.
- Product cards: white `surface`, light grey `border` hairline, soft `shadow-card`; on hover or press, swap to `shadow-glow`, a subtle blue rim. Only one glowing element per view.
- The diagonal blue light streaks from the cover are the decorative motif: one or two thin `chrome-accent` lines at about 60°, inside the dark hero or promo banners only, never over a product and never on the light page.
- Motion: 150–200ms ease-out for hover, drawers and the cart count. No parallax, no autoplay carousels faster than 5 seconds.
- Focus: 2px solid `focus-ring` outline, 2px offset, on every interactive element.

## Imagery

- Studio product photography: one hero product, dramatic side light, dark or tactile surfaces (stone, fabric, wood desk), soft reflections. See the posts in **Imagery**.
- Product images sit on a square `media-frame` (very light grey) so cut-outs and lifestyle shots line up. Use 1:1 on cards, 4:5 or 1:1 on the product page. The dark studio posts suit the hero and promo banners.
- **The logo images have a black background baked in: place them only on `chrome-bg` (header, hero, promo banners, footer), never on the light page.** On banners and social graphics, place **modz-tech-wordmark** (no circle) bottom-left. Use **modz-tech-logo-circle** only where a round mark is expected: favicon, Facebook avatar, footer badge.
- Never put text over a product. Headlines go top-left over empty background, as in the posts.

## Iconography

- Thin line icons, 1.5px stroke, rounded caps, 20–24px, in `silver` (or `brand-bright` when active), like the four pillar icons on the cover photo (badge, shield, chip, headset). Lucide matches this style; use it for cart, search, user, truck, cash, shield-check.
- No emoji as icons, no filled icon sets mixed in.

## Logos

- **modz-tech-wordmark**: MODZ in silver with the blue Z, TECH spaced below. The default logo for the header, banners and posts. It is a photo-real image on black, so place it only on `chrome-bg` or dark imagery, never on white.
- **modz-tech-logo-circle**: the same mark in a blue-rimmed circle. Favicon, social avatar, footer.
- **modz-tech-cover**: the Facebook cover; reuse its tagline and the four pillars (Premium Quality · Reliable Performance · Modern Technology · Built for Your Lifestyle) in the trust strip and footer.
- The logo is a raster image; ask for a vector version before printing large.
