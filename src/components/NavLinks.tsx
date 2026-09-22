"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/siteConfig";

type NavLinksProps = {
  variant?: "desktop" | "mobile";
  onLinkClick?: () => void;
};

const NavLinks = ({ variant = "desktop", onLinkClick }: NavLinksProps) => {
  const pathname = usePathname();

  const wrapperClassName =
    variant === "mobile"
      ? "flex flex-col gap-1 border-t border-white/7 py-3 md:hidden"
      : "hidden items-center justify-center gap-8 md:flex";

  const baseLinkClassName =
    variant === "mobile"
      ? "rounded-md px-3 py-2 font-body text-[13.5px] font-medium text-snow/72 transition-colors hover:bg-white/5 hover:text-white"
      : "font-body text-[13.5px] font-medium text-snow/72 transition-colors hover:text-white";

  const activeLinkClassName =
    variant === "mobile"
      ? "text-white font-semibold bg-white/5"
      : "text-white font-semibold border-b border-[rgba(106,169,233,.7)] pb-1";

  return (
    <nav className={wrapperClassName}>
      {siteConfig.nav.map((item) => {
        const isActive =
          item.to === "/"
            ? pathname === "/"
            : pathname === item.to || pathname.startsWith(`${item.to}/`);

        return (
          <Link
            key={item.to}
            href={item.to}
            onClick={onLinkClick}
            className={`${baseLinkClassName} ${isActive ? activeLinkClassName : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
