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
3. Copy `.env.example` to `.env.local` and fill in the values (see below).
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

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

Creating the admin user, seeding the database and deploying are added as those parts are built.
