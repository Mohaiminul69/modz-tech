import Script from "next/script";
import { Suspense } from "react";
import { PixelPageViews } from "./pixel-page-views";

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID?.trim();

/*
 * Facebook (Meta) Pixel: measures visits, add to cart, checkout and purchases for Facebook ads.
 * Production builds only, and only once NEXT_PUBLIC_FB_PIXEL_ID is set (digits only, so nothing
 * odd can end up in the inline script). Events: src/lib/pixel.ts.
 */
export const FacebookPixel = () => {
  if (process.env.NODE_ENV !== "production" || !PIXEL_ID || !/^\d+$/.test(PIXEL_ID)) return null;

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');if(!location.pathname.startsWith('/admin'))fbq('track','PageView');`}
      </Script>
      {/* usePathname needs a Suspense boundary under Cache Components. */}
      <Suspense fallback={null}>
        <PixelPageViews />
      </Suspense>
    </>
  );
};
