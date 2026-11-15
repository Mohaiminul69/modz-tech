import { Suspense } from "react";
import { ClarityLoader } from "./clarity-loader";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();

/*
 * Microsoft Clarity (session recordings + heatmaps).
 * Production builds only, and only once NEXT_PUBLIC_CLARITY_ID is set (letters and digits only).
 * ClarityLoader also skips localhost, admin pages and signed-in admins.
 */
export const Clarity = () => {
  if (process.env.NODE_ENV !== "production" || !CLARITY_ID || !/^[a-z0-9]+$/i.test(CLARITY_ID)) return null;

  // usePathname needs a Suspense boundary under Cache Components.
  return (
    <Suspense fallback={null}>
      <ClarityLoader id={CLARITY_ID} />
    </Suspense>
  );
};
