"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiShoppingBagOpen } from "react-icons/pi";
import Hamburger from "./Hamburger";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { siteConfig } from "@/data/siteConfig";
import { useCart } from "@/context/CartContext";

const WHATSAPP_ICON = "https://cdn.simpleicons.org/whatsapp/f2f4f7";

const CartLink = () => {
  const { count } = useCart();
  const pathname = usePathname();
  const isActive = pathname === "/cart";

  return (
    <Link
      href="/cart"
      className={`relative rounded-full p-2.5 text-snow transition-colors ${
        isActive
          ? "border border-[rgba(106,169,233,.5)] bg-[rgba(47,127,212,.16)]"
          : "glow-border-hover bg-white/5"
      }`}
      aria-label="Cart"
    >
      <PiShoppingBagOpen className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 flex h-4.75 w-4.75 items-center justify-center rounded-full bg-accent font-body text-[11px] font-bold text-[#04060a]">
        {count}
      </span>
    </Link>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/7 bg-bg/72 backdrop-blur-[18px]">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)]">
        {/* Mobile: logo on the left, whatsapp + cart + hamburger on the right */}
        <div className="flex h-16 items-center justify-between md:hidden">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center gap-2">
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              aria-label={`Chat on WhatsApp: ${siteConfig.whatsappDisplay}`}
              className="rounded-full bg-white/5 p-2.5 transition-colors hover:bg-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external icon CDN, not an optimizable local asset */}
              <img src={WHATSAPP_ICON} alt="" className="h-5 w-5" />
            </a>
            <CartLink />
            <Hamburger
              isOpen={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />
          </div>
        </div>

        {/* Desktop: logo, centered nav links, whatsapp + cart */}
        <div className="hidden h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
          <Logo />

          <NavLinks />

          <div className="flex items-center justify-end gap-4">
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-body text-[12.5px] font-semibold text-snow/72 transition-colors hover:border-white/20 hover:text-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external icon CDN, not an optimizable local asset */}
              <img src={WHATSAPP_ICON} alt="" className="h-4 w-4" />
              {siteConfig.whatsappDisplay}
            </a>
            <CartLink />
          </div>
        </div>

        {isMenuOpen && (
          <NavLinks variant="mobile" onLinkClick={() => setIsMenuOpen(false)} />
        )}
      </div>
    </header>
  );
};

export default Navbar;
