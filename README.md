# Modz Tech

Mobile-first online shop for gadgets and mobile accessories in Bangladesh, at https://modz-tech.vercel.app.
Customers order without an account and pay cash on delivery. Staff manage products, orders and shop settings in the admin panel at `/admin`.

## Stack

- **Next.js 16** (App Router, TypeScript, Cache Components): server components, server actions and route handlers. There is no separate backend.
- **MongoDB Atlas** with Mongoose (one cached connection, `src/lib/db.ts`)
- **Better Auth**: Google sign-in and phone + password, roles `customer` and `admin`
- **Cloudinary** for product images (signed uploads from the admin)
- **Tailwind CSS v4** + shadcn/ui (Radix), Lucide icons
- **Vercel** hosting. Every push to `main` deploys.

> This Next.js version differs from older guides. Read the docs in `node_modules/next/dist/docs/` before changing framework-level code (see `AGENTS.md`).

## Local setup

1. Install Node.js 20.9 or newer.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in the values (see [Environment variables](#environment-variables)). `MONGODB_URI` is required, also for `npm run build`, because pages read products and settings from MongoDB.
4. Seed the database with categories, brands, sample products and shop settings:
   ```bash
   npm run seed
   ```
5. Start the dev server and open http://localhost:3000:
   ```bash
   npm run dev
   ```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build (needs `MONGODB_URI`) |
| `npm run start` | Serves the production build, e.g. `npm run start -- -p 3123` |
| `npm run lint` | ESLint |
| `npm run seed` | Creates missing categories, brands, sample products and settings. Safe to re-run: it never overwrites edits. |
| `npm run make-admin -- you@example.com` | Gives a user the admin role (add `--remove` to take it away) |

Type check with `npx tsc --noEmit`.

## Admin access

1. Sign in once at `/admin/login` (Google) so the user exists.
2. Run `npm run make-admin -- you@gmail.com`. It uses the `MONGODB_URI` in `.env.local`, so point that at the production database to make a production admin.
3. Sign in again at `/admin`.

In the admin panel:
- **Orders:** change status (pending → confirmed → shipped → delivered, or not reachable / cancelled / returned). Customers see this on `/track`.
- **Products, categories:** images upload to Cloudinary.
- **Settings:** phone, email, opening hours, social links, delivery fees and times, home page banners. The contact, checkout and policy pages read these, so there is no code change needed.
- **Messages:** contact form messages.

## Environment variables

Set these in `.env.local` locally and in **Vercel → Settings → Environment Variables** for the live site. Variables starting with `NEXT_PUBLIC_` are built into the page, so changing one on Vercel needs a redeploy.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site address (canonical links, sitemap, share images). On Vercel it falls back to the production domain if unset. |
| `MONGODB_URI` | MongoDB Atlas connection string. Use `modz-tech-dev` locally and `modz-tech` in production. |
| `BETTER_AUTH_SECRET` | Signs sessions. Generate with `npx @better-auth/cli secret`. |
| `BETTER_AUTH_URL` | Site address Better Auth runs on |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in. Redirect URI: `<site>/api/auth/callback/google` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Product image uploads and delivery |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | New order and contact message alerts in the staff Telegram group |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity recordings and heatmaps (production builds only) |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook (Meta) Pixel (production builds only) |
| `RESEND_API_KEY`, `EMAIL_FROM` | Reserved for order emails (not built yet) |

## How things work

### Data and caching
- Models live in `src/models`: Category, Brand, Product (with variants), Order, Settings, ContactMessage, Counter (order numbers from MZ-1001), RateLimitHit.
- Pages read data through cached functions in `src/lib/data` (`"use cache"` with cache tags `catalog`, `products`, `settings`). Admin actions refresh those tags with `updateTag`, so changes show right away. A change made directly in MongoDB shows within an hour, or after restarting `npm run dev`.

### Orders
- `src/app/checkout/actions.ts` (`placeOrder`) re-checks everything on the server: prices come from the database, stock is reserved atomically, and there are daily limits per phone number and per IP against fake orders.
- After an order, the staff Telegram group gets an alert (`src/lib/telegram.ts`). A failed alert never fails the order. If the Telegram group is ever upgraded to a supergroup, its chat ID changes and the server log prints the new one to put in `TELEGRAM_CHAT_ID`.
- Customers track orders on `/track` with their order number and phone number.

### Cart
- Stored in the browser (`localStorage`, `src/lib/cart`). Prices and stock always come fresh from the server.

### Accounts
- Optional for customers. Phone accounts use an internal email `01XXXXXXXXX@phone.modztech.invalid`, because Better Auth's password login is email-based. Phone numbers are not verified yet.

### SEO and sharing
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- Product pages include structured data for Google (price, stock, photos, breadcrumbs): `src/lib/structured-data.ts`.
- `src/app/opengraph-image.tsx` is the default share picture. Product pages use the product photo instead.

### Analytics
- Microsoft Clarity: `src/components/analytics/clarity.tsx` and `clarity-loader.tsx`. It is not loaded on localhost (even for a production build), on admin pages, or for signed-in admins anywhere on the site.
- Facebook Pixel: `src/components/analytics/facebook-pixel.tsx` loads it. Events are sent from `src/lib/pixel.ts`: `PageView`, `AddToCart` (product page and product cards), `InitiateCheckout` (checkout page), `Purchase` (after an order, with the order number as the event ID).
- Both only load in production builds, once their ID is set.

### Delivery and policy pages
- `/delivery` (`src/app/delivery/page.tsx`): delivery charges and times, how delivery works, checking the parcel before paying.
- `/policy` (`src/app/policy/page.tsx`): returns, warranty, a short delivery summary and privacy. Update `LAST_UPDATED` in that file when the text changes.
- Both read delivery fees, times and the phone number from Admin → Settings.
- The old `/delivery-policy` address redirects to `/delivery`, and `/return-policy` to `/policy#returns`.

## Project layout

```
src/
  app/            Routes (pages, server actions, sitemap, robots, share image)
    admin/        Admin panel (login + (panel) pages, each guarded on the server)
  components/     UI by area (layout, shop, product, cart, checkout, admin, ui = shadcn)
  lib/            Helpers: data access, auth, pricing, search, Telegram, Pixel
  models/         Mongoose models
scripts/          seed, make-admin, set-contact (one-off contact details update)
design/           Design handoff files
```

## Design

Design handoff files are in `/design`. Brand colours, fonts, radii and shadows are tokens in `src/app/globals.css`. Components use the token utilities (`bg-brand`, `text-ink-muted`, `bg-chrome`, ...), never raw hex values. Import `cn` from `@/lib/utils`: it knows the custom text sizes and shadows.

## Code conventions

- Arrow functions for components and helpers.
- Anything reading request data (`params`, `searchParams`, cookies) sits inside `<Suspense>`. Cache Components requires it, and the build fails otherwise.
- Validation schemas are shared by the browser and the server (`src/lib/*-schema.ts`). Server actions never trust browser input.

## Deploying

1. Push to `main`. Vercel builds and deploys automatically.
2. New environment variables: add them on Vercel, then redeploy.
3. Google sign-in: the live site address must be in the Google Cloud Console OAuth client (authorized JavaScript origin and redirect URI).
4. After the first deploy, submit `https://<site>/sitemap.xml` in Google Search Console.

### Windows note
If `npm run dev` fails with `EPERM` while renaming files in `.next`, Windows Defender is scanning the folder. Add the project folder as a Defender exclusion, delete `.next\dev`, and restart.
