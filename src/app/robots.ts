import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

// Shop pages are open to search engines; private and per-customer pages are not.
const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: ["/admin", "/api/", "/account", "/cart", "/checkout", "/order/"],
  },
  sitemap: `${SITE_URL}/sitemap.xml`,
  host: SITE_URL,
});

export default robots;
