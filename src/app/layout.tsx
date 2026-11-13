import type { Metadata } from "next";
import { Hind_Siliguri, Saira, Sora } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Base for canonical URLs and Open Graph images (Facebook shares).
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Modz Tech | Gadgets and mobile accessories in Bangladesh",
    template: "%s | Modz Tech",
  },
  description:
    "Authentic earbuds, speakers, smart watches, chargers and more. Cash on delivery all over Bangladesh.",
};

// suppressHydrationWarning: browser extensions (Grammarly, ColorZilla, ...) add attributes to
// <html>/<body> before React loads. This only ignores attribute differences on these two
// tags, not on anything inside them.
const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={`${sora.variable} ${hindSiliguri.variable} ${saira.variable} h-full antialiased`}
  >
    <body suppressHydrationWarning className="flex min-h-full flex-col">
      {children}
      <Toaster />
    </body>
  </html>
);

export default RootLayout;
