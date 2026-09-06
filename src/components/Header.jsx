import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PiList, PiX, PiShoppingCartSimple, PiWhatsappLogo } from 'react-icons/pi'
import Logo from './Logo'
import { siteConfig } from '../data/siteConfig'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `font-label text-sm font-semibold uppercase tracking-wider transition-colors hover:text-brand-400 ${
                  isActive ? 'text-brand-400' : 'text-chrome-300'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={siteConfig.whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-chrome-300 transition-colors hover:border-neon-green/60 hover:text-neon-green"
          >
            <PiWhatsappLogo className="h-4 w-4" />
            {siteConfig.whatsappDisplay}
          </a>
          <Link
            to="/cart"
            className="glow-border-hover relative rounded-full bg-ink-elevated p-2.5 text-chrome-100 transition-colors"
            aria-label="Cart"
          >
            <PiShoppingCartSimple className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-semibold text-white">
              0
            </span>
          </Link>
        </div>

        <button
          type="button"
          className="p-2 text-chrome-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <PiX className="h-6 w-6" /> : <PiList className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-ink px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-label text-base font-semibold uppercase tracking-wider text-chrome-300"
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-base font-medium text-chrome-300 hover:text-neon-green"
            >
              <PiWhatsappLogo className="h-5 w-5" />
              {siteConfig.whatsappDisplay}
            </a>
            <Link to="/cart" onClick={() => setOpen(false)} className="text-base font-medium text-chrome-300">
              Cart (0)
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
