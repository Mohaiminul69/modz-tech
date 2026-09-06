import { Link } from 'react-router-dom'
import { products } from '../../data/products'
import { siteConfig } from '../../data/siteConfig'
import ProductImage from '../ProductImage'

export default function Products() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-chrome sm:text-3xl">
          Our Products
        </h2>
        <p className="mt-3 text-chrome-500">Handpicked gadgets, ready to ship today.</p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div key={product.id} className="group flex flex-col">
            <div className="glow-border-hover relative aspect-square overflow-hidden rounded-2xl border border-line bg-ink-soft">
              {product.oldPrice && (
                <span className="font-label absolute left-2 top-2 z-10 rounded-full bg-linear-to-r from-neon-red to-neon-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Sale
                </span>
              )}
              <ProductImage
                src={product.image}
                alt={product.name}
                icon={product.icon}
                className="transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 text-sm font-medium text-chrome-100">{product.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-display font-semibold text-brand-400">
                {siteConfig.currency}
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-chrome-700 line-through">
                  {siteConfig.currency}
                  {product.oldPrice}
                </span>
              )}
            </div>
            <button
              type="button"
              className="mt-3 rounded-full border border-line py-2 text-sm font-medium text-chrome-300 transition-colors hover:border-brand-500 hover:bg-brand-500 hover:text-white"
            >
              Select Options
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
        >
          View All Products
        </Link>
      </div>
    </section>
  )
}
