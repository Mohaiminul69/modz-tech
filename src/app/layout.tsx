import type { Metadata } from "next";
import {
  Archivo,
  Inter,
  JetBrains_Mono,
  Manrope,
  Orbitron,
  Rajdhani,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { CartProvider } from "@context/CartContext";
import Navbar from "@components/Navbar";
import ConditionalFooter from "@components/ConditionalFooter";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Modz Tech",
  description: "Tech that keeps up with your day",
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${manrope.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${rajdhani.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#0b0e15",
                color: "#f2f4f7",
                border: "1px solid rgba(106,169,233,.3)",
                borderRadius: "14px",
                fontFamily: "var(--font-body)",
                fontSize: "13.5px",
                fontWeight: 600,
              },
              success: {
                iconTheme: {
                  primary: "#4e9ae8",
                  secondary: "#0b0e15",
                },
              },
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </CartProvider>
      </body>
    </html>
  );
};

export default RootLayout;
