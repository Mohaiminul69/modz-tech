import Script from "next/script";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();

/*
 * Microsoft Clarity (session recordings + heatmaps).
 * Production builds only, so local testing doesn't fill the dashboard with dev sessions.
 * The ID check keeps anything odd in the env var out of the inline script.
 */
export const Clarity = () => {
  if (process.env.NODE_ENV !== "production" || !CLARITY_ID || !/^[a-z0-9]+$/i.test(CLARITY_ID)) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  );
};
