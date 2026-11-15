/*
 * The site's public address, with no trailing slash. Used for canonical URLs, share images,
 * robots.txt and the sitemap.
 * Order: NEXT_PUBLIC_SITE_URL (set it to the real domain), then Vercel's production domain,
 * then localhost.
 */
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
const isLocal = (url: string) => /localhost|127\.0\.0\.1/.test(url);

const pick = () => {
  // On Vercel, a leftover localhost value would put localhost links in the sitemap.
  if (fromEnv && !(vercelDomain && isLocal(fromEnv))) return fromEnv;
  if (vercelDomain) return `https://${vercelDomain}`;
  return fromEnv ?? "http://localhost:3000";
};

export const SITE_URL = pick().replace(/\/+$/, "");
