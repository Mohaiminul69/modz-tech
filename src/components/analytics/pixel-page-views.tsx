"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/*
 * The Pixel script counts the first page view itself. Moving between pages doesn't reload
 * the site, so this sends a PageView for each later page. Admin pages are skipped.
 */
export const PixelPageViews = () => {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (pathname.startsWith("/admin")) return;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
};
