import { Link } from 'react-router-dom'
import Logo from './Logo'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Audio', to: '/shop' },
      { label: 'Power & Charging', to: '/shop' },
      { label: 'Wearables', to: '/shop' },
      { label: 'Desk & Mobile', to: '/shop' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Track an order', to: '/track-order' },
      { label: 'Running offers', to: '/offers' },
      { label: 'Packages', to: '/packages' },
      { label: 'Contact us', to: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why Modz', to: '/about' },
      { label: 'Store location', to: '/store-location' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
    ],
  },
]

const Footer = () => {
  return (
    <footer className="border-t border-white/7">
      <div className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-10 pt-[clamp(48px,6vw,80px)]">
        <div
          className="grid gap-9"
          style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))' }}
        >
          <div>
            <Logo />
            <p className="mt-4 max-w-xs font-body text-[12.5px] leading-relaxed text-snow/45">
              Premium consumer tech, delivered nationwide. Cash on delivery.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[9.5px] font-medium uppercase tracking-[0.16em] text-snow/40">
                {col.title}
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-body text-[13px] text-snow/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-white/7 pt-6 font-body text-[11.5px] text-snow/35">
          <span>© {new Date().getFullYear()} Modz Tech. All rights reserved.</span>
          <span>Cash on delivery · 24–48 hr nationwide delivery</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
