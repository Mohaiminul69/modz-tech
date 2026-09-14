import { Link } from 'react-router-dom'
import {
  PiHeadphones,
  PiBatteryChargingVertical,
  PiWatch,
  PiPlugCharging,
  PiUsb,
  PiSpeakerHigh,
  PiLaptop,
  PiDeviceMobile,
  PiCube,
} from 'react-icons/pi'
import { siteConfig } from '../../data/siteConfig'

const ICONS = {
  earbuds: PiHeadphones,
  battery: PiBatteryChargingVertical,
  watch: PiWatch,
  charger: PiPlugCharging,
  hub: PiUsb,
  speaker: PiSpeakerHigh,
  laptop: PiLaptop,
  case: PiDeviceMobile,
}

const whatsappOrderLink = (name) =>
  `${siteConfig.whatsappLink}?text=${encodeURIComponent(`Hi, I'd like to order: ${name}`)}`

const ShopProductCard = ({ product }) => {
  const Icon = ICONS[product.icon] || PiCube
  const hasDiscount = product.oldPrice > product.price
  const badgeLabel = product.tag || (product.inStock ? 'In stock' : 'Pre-order')
  const isOnOffer = product.tag === 'On offer'

  return (
    <article className="group flex flex-col overflow-hidden rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))] transition-colors hover:border-[rgba(106,169,233,.5)]">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/6 bg-surface-media">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center" role="img" aria-label={product.name}>
            <Icon className="h-10 w-10 text-accent-tint/60" strokeWidth={1.5} />
          </div>
        )}

        <span
          className={`pointer-events-none absolute left-3 top-3 rounded-full border px-2.5 py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] ${
            isOnOffer
              ? 'border-white/18 bg-[rgba(47,127,212,.92)] text-[#04060a]'
              : 'border-white/14 bg-[rgba(7,9,13,.78)] text-[#a9c9ee]'
          }`}
        >
          {badgeLabel}
        </span>

        <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-[rgba(6,8,11,.72)] opacity-0 backdrop-blur-[3px] transition-opacity duration-[180ms] ease-out group-hover:opacity-100">
          <Link
            to={product.slug}
            className="rounded-full bg-white px-4.5 py-2.75 font-body text-[12.5px] font-bold text-[#07080a] transition-colors hover:bg-[#dce8f6]"
          >
            Quick view
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-[18px]">
        <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-snow/45">
          {product.category}
        </span>
        <h3 className="font-heading text-[16.5px] font-semibold tracking-[-0.01em] text-snow">
          {product.name}
        </h3>
        <p className="font-body text-[12.5px] leading-relaxed text-snow/55">{product.note}</p>

        <div className="mt-auto flex items-baseline gap-2.5 pt-3.5">
          <span className="font-heading text-[17px] font-semibold text-snow">
            ৳{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="font-body text-[12px] text-snow/40 line-through">
              ৳{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[1fr_auto] gap-2 pt-3">
          <button
            type="button"
            className="rounded-full border border-[rgba(106,169,233,.4)] bg-[rgba(47,127,212,.14)] px-3.5 py-2.5 font-body text-[12.5px] font-semibold text-[#cfe3f8] transition-colors hover:bg-[rgba(47,127,212,.3)] hover:text-white"
          >
            Add to cart
          </button>
          <a
            href={whatsappOrderLink(product.name)}
            target="_blank"
            rel="noreferrer"
            title="Order on WhatsApp"
            className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/4 px-3.75 py-2.5 font-body text-[12px] font-semibold text-snow transition-colors hover:bg-white/10"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}

export default ShopProductCard
