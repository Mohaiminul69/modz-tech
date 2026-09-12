import { useState } from "react";
import { Link } from "react-router-dom";
import { PiShoppingBagOpen } from "react-icons/pi";
import Hamburger from "./Hamburger";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import { siteConfig } from "../data/siteConfig";

const WHATSAPP_ICON = "https://cdn.simpleicons.org/whatsapp/f2f4f7";

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
              <img src={WHATSAPP_ICON} alt="" className="h-5 w-5" />
            </a>
            <Link
              to="/cart"
              className="glow-border-hover relative rounded-full bg-white/5 p-2.5 text-snow transition-colors"
              aria-label="Cart"
            >
              <PiShoppingBagOpen className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4.75 w-4.75 items-center justify-center rounded-full bg-accent font-body text-[11px] font-bold text-[#04060a]">
                0
              </span>
            </Link>
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
              <img src={WHATSAPP_ICON} alt="" className="h-4 w-4" />
              {siteConfig.whatsappDisplay}
            </a>
            <Link
              to="/cart"
              className="glow-border-hover relative rounded-full bg-white/5 p-2.5 text-snow transition-colors"
              aria-label="Cart"
            >
              <PiShoppingBagOpen className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4.75 w-4.75 items-center justify-center rounded-full bg-accent font-body text-[11px] font-bold text-[#04060a]">
                0
              </span>
            </Link>
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
