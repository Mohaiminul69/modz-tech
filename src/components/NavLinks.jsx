import { Link } from "react-router-dom";
import { siteConfig } from "../data/siteConfig";

const NavLinks = ({ variant = "desktop", onLinkClick }) => {
  const wrapperClassName =
    variant === "mobile"
      ? "flex flex-col gap-1 border-t border-white/7 py-3 md:hidden"
      : "hidden items-center justify-center gap-8 md:flex";

  const linkClassName =
    variant === "mobile"
      ? "rounded-md px-3 py-2 font-body text-[13.5px] font-medium text-snow/72 transition-colors hover:bg-white/5 hover:text-white"
      : "font-body text-[13.5px] font-medium text-snow/72 transition-colors hover:text-white";

  return (
    <nav className={wrapperClassName}>
      {siteConfig.nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onLinkClick}
          className={linkClassName}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
