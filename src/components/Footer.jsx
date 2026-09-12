import { Link } from 'react-router-dom'
import { PiFacebookLogo, PiInstagramLogo } from 'react-icons/pi'
import Logo from './Logo'
import { siteConfig } from '../data/siteConfig'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'Bundles', to: '/bundles' },
      { label: 'New Arrivals', to: '/shop' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'FAQs', to: '/contact' },
      { label: 'Shipping & Returns', to: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-soft">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-chrome-500">
              {siteConfig.tagline}. Quality gadgets and accessories, picked for real life.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href={siteConfig.social.facebook}
                aria-label="Facebook"
                className="glow-border-hover flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink-elevated text-chrome-300 transition-colors hover:text-brand-400"
              >
                <PiFacebookLogo className="h-4.5 w-4.5" />
              </a>
              <a
                href={siteConfig.social.instagram}
                aria-label="Instagram"
                className="glow-border-hover flex h-9 w-9 items-center justify-center rounded-full border border-line bg-ink-elevated text-chrome-300 transition-colors hover:text-neon-red"
              >
                <PiInstagramLogo className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-label text-sm font-semibold uppercase tracking-wider text-chrome-100">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-chrome-500 hover:text-brand-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line pt-6 text-sm text-chrome-700">
          © {new Date().getFullYear()}, {siteConfig.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}
