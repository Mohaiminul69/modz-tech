# Modz Tech

Mobile-first online shop for gadgets and mobile accessories in Bangladesh. Cash on delivery at launch.

## Stack

- Next.js (App Router, TypeScript): server components, server actions and route handlers. No separate backend.
- MongoDB Atlas with Mongoose (one cached connection, see `src/lib/db.ts`)
- Better Auth: Google sign-in, phone + password, roles `customer` and `admin`
- Cloudinary for product images
- Tailwind CSS v4 + shadcn/ui (Radix), Lucide icons
- Hosted on Vercel

## Local setup

1. Install Node.js 20.9 or newer.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and fill in the values (see below). `MONGODB_URI` is required: the site reads products, categories and settings from MongoDB, including during `npm run build`.
4. Seed the database (categories, brands, sample products, shop settings):
   ```bash
   npm run seed
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Database

- Models live in `src/models` (Category, Brand, Product with variants, Settings).
- Pages read data through cached functions in `src/lib/data` (`"use cache"` + cache tags `catalog`, `products`, `settings`). After changing data, those tags must be refreshed (the admin panel will do this); in development, restarting `npm run dev` also works.
- `npm run seed` only creates records that are missing, so it is safe to re-run and never overwrites edits.
- Only the Hoco EQ34 Plus price in the seed is real; the other prices are samples. Use a separate database name for development (e.g. `modz-tech-dev`) and keep sample data out of production.

## Environment variables

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical links, sitemap, Open Graph) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `BETTER_AUTH_URL` | Site URL Better Auth runs on |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads and delivery |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Order and contact form alerts |
| `RESEND_API_KEY`, `EMAIL_FROM` | Order confirmation and shipped emails |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Facebook Pixel |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity |

## Design

Design handoff files live in `/design`. Brand colours, fonts, radii and shadows are tokens in `src/app/globals.css`. Components use the token utilities (`bg-brand`, `text-ink-muted`, `bg-chrome`, ...), never raw hex values.

## Still to document

Creating the admin user and deploying are added as those parts are built.
