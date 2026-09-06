import { bundles } from '../../data/bundles'
import { siteConfig } from '../../data/siteConfig'
import ProductImage from '../ProductImage'

const accentBars = ['bg-brand-500', 'bg-neon-yellow', 'bg-neon-red', 'bg-neon-green']

export default function Bundles() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-chrome sm:text-3xl">
          Bundles For You
        </h2>
        <p className="mt-3 text-chrome-500">Save more when you gear up together.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.map((bundle, i) => (
          <div
            key={bundle.id}
            className="glow-border-hover group flex flex-col overflow-hidden rounded-2xl border border-line bg-ink-soft"
          >
            <div className={`h-1 ${accentBars[i % accentBars.length]}`} />
            <div className="aspect-4/3 overflow-hidden">
              <ProductImage
                src={bundle.image}
                alt={bundle.title}
                icon={bundle.icon}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="font-display text-base font-semibold text-chrome-100">
                {bundle.title}
              </h3>
              <p className="mt-1 text-sm text-chrome-500">{bundle.description}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-chrome-300">
                {bundle.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-brand-400">
                  {siteConfig.currency}
                  {bundle.price}
                </span>
                <button
                  type="button"
                  className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
