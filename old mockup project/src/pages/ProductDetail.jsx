import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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
import { shopProducts, offerEndsAt } from '../data/shopProducts'
import { offersEndDate } from '../data/offers'
import { siteConfig } from '../data/siteConfig'
import { useCart } from '../context/CartContext'
import ShopProductCard from '../components/shop/ShopProductCard'

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

const fmt = (n) => `৳${n.toLocaleString()}`

const fallbackGallery = (product) =>
  product.image
    ? ['FRONT', 'SIDE', 'DETAIL', 'IN BOX'].map((label) => ({ label, image: product.image }))
    : null

const genericSpecs = (product) => [
  { k: 'CATEGORY', v: product.category },
  { k: 'AVAILABILITY', v: product.inStock ? 'In stock' : 'Pre-order' },
  { k: 'PRICE', v: fmt(product.price) },
]

const whatsappOrderLink = (name) =>
  `${siteConfig.whatsappLink}?text=${encodeURIComponent(`Hi, I'd like to order: ${name}`)}`

const useCountdown = (endDate) => {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const ms = Math.max(endDate.getTime() - now, 0)
  const pad = (n) => String(n).padStart(2, '0')

  return [
    { label: 'Days', value: pad(Math.floor(ms / 86400000)) },
    { label: 'Hrs', value: pad(Math.floor(ms / 3600000) % 24) },
    { label: 'Min', value: pad(Math.floor(ms / 60000) % 60) },
    { label: 'Sec', value: pad(Math.floor(ms / 1000) % 60) },
  ]
}

const PartThumb = ({ part }) => {
  const Icon = ICONS[part.icon] || PiCube
  return (
    <div className="flex-1 min-w-0">
      <div className="h-[118px] overflow-hidden rounded-[14px] border border-white/9 bg-surface-media">
        {part.image ? (
          <img src={part.image} alt={part.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="h-8 w-8 text-accent-tint/60" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="mt-2 min-h-8.5 text-center font-body text-[12px] leading-[1.4] text-snow/72">
        {part.name}
      </div>
    </div>
  )
}

const ProductDetail = () => {
  const { productId } = useParams()
  const { addItem } = useCart()
  const product = shopProducts.find((p) => p.id === productId)

  const [view, setView] = useState(0)
  const [colour, setColour] = useState(product?.details?.colours?.[0]?.name)
  const [qty, setQty] = useState(1)

  const countdown = useCountdown(offerEndsAt)

  if (!product) {
    return (
      <section className="mx-auto flex max-w-[1680px] flex-col items-center gap-4 px-[clamp(20px,4vw,64px)] py-[clamp(80px,10vw,140px)] text-center">
        <h1 className="font-heading text-[28px] font-bold text-snow">Product not found.</h1>
        <p className="font-body text-[14px] text-snow/60">
          That item may have sold out or moved.
        </p>
        <Link
          to="/shop"
          className="rounded-full border border-white/16 px-5 py-2.5 font-body text-[13px] font-semibold text-snow transition-colors hover:bg-white/6"
        >
          Back to shop
        </Link>
      </section>
    )
  }

  const hasOffer = product.oldPrice > product.price
  const discountPercent = hasOffer
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0
  const save = product.oldPrice - product.price

  const details = product.details || {}
  const description = details.description || [product.note]
  const gallery = details.gallery || fallbackGallery(product)
  const active = gallery?.[view] || gallery?.[0]
  const specs = details.specs || genericSpecs(product)
  const Icon = ICONS[product.icon] || PiCube

  const relatedProducts = details.related
    ? details.related.map((id) => shopProducts.find((p) => p.id === id)).filter(Boolean)
    : shopProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <>
      {/* Breadcrumb */}
      <div className="mx-auto flex max-w-[1680px] flex-wrap items-center gap-2 px-[clamp(20px,4vw,64px)] pt-[clamp(24px,3vw,40px)] font-mono text-[10.5px] uppercase tracking-[0.16em] text-snow/45">
        <Link to="/" className="text-snow/45 transition-colors hover:text-[#9ac8f5]">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="text-snow/45 transition-colors hover:text-[#9ac8f5]">
          Shop
        </Link>
        <span>/</span>
        <Link to="/shop" className="text-snow/45 transition-colors hover:text-[#9ac8f5]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#7fb0e4]">{product.name}</span>
      </div>

      {/* Buy block */}
      <section className="mx-auto flex max-w-[1680px] flex-wrap items-start gap-[clamp(24px,3.5vw,56px)] px-[clamp(20px,4vw,64px)] pb-[clamp(48px,5vw,80px)] pt-[clamp(24px,3vw,40px)]">
        {/* Gallery */}
        <div className="flex min-w-[min(100%,300px)] max-w-[520px] flex-1 basis-100 flex-col gap-3">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/9 sm:w-[min(100%,440px)]"
            style={{
              background:
                'radial-gradient(circle at 50% 35%, rgba(47,127,212,.16), rgba(255,255,255,.02) 62%), #0a0d12',
            }}
          >
            {active?.image ? (
              <img src={active.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Icon className="h-16 w-16 text-accent-tint/60" strokeWidth={1.5} />
              </div>
            )}

            {hasOffer && (
              <span className="absolute left-4 top-4 rounded-full bg-[rgba(47,127,212,.92)] px-2.75 py-1.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-[#04060a]">
                On sale −{discountPercent}%
              </span>
            )}

            {gallery && (
              <span className="absolute bottom-4 right-4 rounded-full border border-white/12 bg-[rgba(9,11,15,.78)] px-3.25 py-1.75 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent-tint backdrop-blur-[10px]">
                {active.label}
              </span>
            )}
          </div>

          {gallery && (
            <div className="grid grid-cols-4 gap-2.5">
              {gallery.map((g, i) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setView(i)}
                  className="flex flex-col items-center gap-1.75"
                >
                  <span
                    className={`block aspect-square w-full overflow-hidden rounded-[14px] border bg-surface-media transition-colors hover:border-[rgba(106,169,233,.5)] ${
                      i === view ? 'border-[rgba(106,169,233,.6)]' : 'border-white/8'
                    }`}
                  >
                    <img src={g.image} alt={g.label} className="h-full w-full object-cover" />
                  </span>
                  <span
                    className={`font-mono text-[9.5px] tracking-[0.12em] ${
                      i === view ? 'text-[#cfe3f8]' : 'text-snow/78'
                    }`}
                  >
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy column */}
        <div className="flex min-w-[min(100%,300px)] flex-1 basis-95 flex-col gap-5.5 lg:sticky lg:top-24">
          <div>
            <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#7fb0e4]">
              {product.category} · {product.inStock ? 'In stock' : 'Pre-order'}
            </div>
            <h1 className="mb-3.5 font-heading text-[clamp(32px,3.8vw,52px)] font-bold leading-[1.03] tracking-[-0.032em] text-snow">
              {product.name}
            </h1>
            <p className="max-w-[480px] font-body text-[15.5px] leading-relaxed text-snow/62">
              {description[0]}
            </p>
          </div>

          {hasOffer ? (
            <div
              className="flex flex-col gap-4 rounded-[20px] border border-[rgba(106,169,233,.3)] px-5 py-5"
              style={{
                background:
                  'radial-gradient(ellipse at 0% 0%, rgba(47,127,212,.18), transparent 70%), rgba(255,255,255,.03)',
              }}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#04060a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#04060a]" />
                  On sale −{discountPercent}%
                </span>
                <span className="rounded-full border border-[rgba(106,169,233,.35)] bg-[rgba(47,127,212,.14)] px-2.75 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[#cfe3f8]">
                  Save {fmt(save)}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3.5">
                <span className="font-heading text-[34px] font-semibold tracking-[-0.02em] text-snow">
                  {fmt(product.price)}
                </span>
                <span className="font-body text-[14px] text-snow/50 line-through">
                  {fmt(product.oldPrice)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-3.5">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#9cc3ec]">
                  Offer ends in
                </span>
                <div className="flex gap-1.75">
                  {countdown.map((u) => (
                    <div
                      key={u.label}
                      className="min-w-13 rounded-xl border border-[rgba(106,169,233,.38)] bg-[rgba(7,9,13,.72)] px-2.5 py-2.25 text-center shadow-[0_6px_18px_rgba(47,127,212,.22)]"
                    >
                      <div
                        className="font-heading text-[21px] font-bold leading-none tracking-[-0.01em]"
                        style={{
                          background: 'linear-gradient(180deg,#8fc4fb 10%,#2a6fbf 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                      >
                        {u.value}
                      </div>
                      <div className="mt-1.25 font-mono text-[8.5px] tracking-[0.12em] text-snow/62">
                        {u.label}
                      </div>
                    </div>
                  ))}
                </div>
                <span className="font-body text-[12px] text-snow/55">{offersEndDate}</span>
              </div>
            </div>
          ) : (
            <span className="font-heading text-[34px] font-semibold tracking-[-0.02em] text-snow">
              {fmt(product.price)}
            </span>
          )}

          {details.quickSpecs && (
            <div
              className="grid gap-px overflow-hidden rounded-[14px] border border-white/9 bg-white/9"
              style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))' }}
            >
              {details.quickSpecs.map((spec) => (
                <div key={spec.label} className="bg-surface px-4.25 py-3.75">
                  <div className="font-heading text-[17px] font-semibold text-snow">
                    {spec.value}
                  </div>
                  <div className="mt-1.25 font-mono text-[9.5px] uppercase tracking-[0.13em] text-snow/50">
                    {spec.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {details.colours && (
            <div>
              <div className="mb-2.75 font-mono text-[9.5px] uppercase tracking-[0.16em] text-snow/55">
                Colour — {colour}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {details.colours.map((c) => {
                  const selected = colour === c.name
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColour(c.name)}
                      className={`inline-flex items-center gap-2.25 rounded-full border px-3.75 py-2.25 font-body text-[12.5px] font-semibold text-snow transition-colors hover:border-[rgba(106,169,233,.5)] ${
                        selected
                          ? 'border-[rgba(106,169,233,.6)] bg-[rgba(47,127,212,.16)]'
                          : 'border-white/12 bg-white/3'
                      }`}
                    >
                      <span
                        className="h-3.25 w-3.25 rounded-full shadow-[0_0_0_1px_rgba(255,255,255,.2)]"
                        style={{ background: c.swatch }}
                      />
                      {c.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-white/14 bg-white/4 p-1.5">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(v - 1, 1))}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/5 font-body text-[17px] font-semibold leading-none text-snow transition-colors hover:bg-white/12"
              >
                −
              </button>
              <span className="min-w-8 text-center font-heading text-[15px] font-semibold text-snow">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((v) => Math.min(v + 1, 9))}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white/5 font-body text-[17px] font-semibold leading-none text-snow transition-colors hover:bg-white/12"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => addItem(product.id, qty)}
              className="bg-brand-gradient flex-1 basis-45 rounded-full px-7 py-3.75 font-body text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(47,127,212,.35)] transition-[filter] hover:brightness-[1.08]"
            >
              Add to cart — {fmt(product.price * qty)}
            </button>

            <a
              href={whatsappOrderLink(product.name)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 basis-40 rounded-full border border-white/16 px-6 py-3.75 text-center font-body text-[14px] font-semibold text-snow transition-colors hover:bg-white/6"
            >
              Order on WhatsApp
            </a>
          </div>

          <div className="grid gap-0.5 overflow-hidden rounded-2xl border border-white/8 bg-white/6">
            {[
              'Cash on delivery — pay the courier when it arrives',
              '24–48 hr nationwide delivery, next day inside the city',
              'Checked and boxed by us before dispatch',
            ].map((line) => (
              <div
                key={line}
                className="flex items-center gap-3 bg-surface px-4.5 py-3.5 font-body text-[13px] text-snow/72"
              >
                <span className="text-accent">•</span> {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="border-t border-white/7 px-[clamp(20px,4vw,64px)] py-[clamp(48px,5vw,80px)]">
        <div className="mx-auto flex max-w-[1680px] flex-wrap items-start gap-[clamp(24px,3.5vw,56px)]">
          <div className="min-w-[min(100%,260px)] flex-1 basis-75">
            <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#7fb0e4]">
              Details
            </div>
            <h2 className="mb-4.5 font-heading text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.026em] text-snow">
              What you are getting.
            </h2>
            {description.map((p) => (
              <p key={p} className="mb-4 max-w-[440px] font-body text-[14.5px] leading-[1.7] text-snow/60 last:mb-0">
                {p}
              </p>
            ))}
          </div>

          <div className="grid min-w-[min(100%,280px)] flex-1 basis-95 gap-px overflow-hidden rounded-[20px] border border-white/8 bg-white/6">
            {specs.map((spec) => (
              <div
                key={spec.k}
                className="flex flex-wrap items-center justify-between gap-3 bg-surface px-5 py-3.75"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-snow/50">
                  {spec.k}
                </span>
                <span className="text-right font-body text-[13.5px] font-semibold text-snow">
                  {spec.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles */}
      {details.bundles && details.bundles.length > 0 && (
        <section
          className="border-t border-white/7 px-[clamp(20px,4vw,64px)] py-[clamp(48px,5vw,80px)]"
          style={{ background: 'linear-gradient(180deg,rgba(47,127,212,.06),transparent 60%)' }}
        >
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#7fb0e4]">
                  Buy together
                </div>
                <h2 className="font-heading text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.026em] text-snow">
                  Add a case and pay less for both.
                </h2>
              </div>
              <p className="max-w-70 font-body text-[13px] leading-[1.55] text-snow/55">
                Bundles ship as one order. Cash on delivery applies.
              </p>
            </div>

            <div
              className="grid items-stretch gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))' }}
            >
              {details.bundles.map((bundle) => {
                const parts = bundle.partIds
                  .map((id) => shopProducts.find((p) => p.id === id))
                  .filter(Boolean)
                const was = parts.reduce((sum, p) => sum + p.price, 0)
                const price = was - bundle.save

                return (
                  <div
                    key={bundle.kicker}
                    className={`flex flex-col gap-4.5 rounded-[20px] border p-6 ${
                      bundle.highlighted ? 'border-[rgba(106,169,233,.45)]' : 'border-white/8'
                    }`}
                    style={{
                      background: bundle.highlighted
                        ? 'radial-gradient(ellipse at 50% 0%, rgba(47,127,212,.18), transparent 70%), rgba(255,255,255,.03)'
                        : 'linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.015))',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#9cc3ec]">
                        {bundle.kicker}
                      </span>
                      <span className="rounded-full border border-[rgba(106,169,233,.35)] bg-[rgba(47,127,212,.16)] px-2.5 py-1.25 font-mono text-[9.5px] tracking-[0.14em] text-[#cfe3f8]">
                        Save {fmt(bundle.save)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {bundle.parts.map((part) => (
                        <PartThumb key={part.name} part={part} />
                      ))}
                    </div>

                    <div className="flex items-baseline gap-2.5 border-t border-white/8 pt-3.5">
                      <span className="font-heading text-[24px] font-semibold text-snow">
                        {fmt(price)}
                      </span>
                      <span className="font-body text-[12.5px] text-snow/42 line-through">
                        {fmt(was)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => bundle.partIds.forEach((id) => addItem(id, 1))}
                      className="mt-auto rounded-full border border-[rgba(106,169,233,.4)] bg-[rgba(47,127,212,.14)] px-5 py-3.25 font-body text-[13px] font-semibold text-[#cfe3f8] transition-colors hover:bg-[rgba(47,127,212,.32)] hover:text-white"
                    >
                      Add bundle to cart
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-white/7 px-[clamp(20px,4vw,64px)] py-[clamp(48px,6vw,96px)]">
          <div className="mx-auto max-w-[1680px]">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="mb-3.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-[#7fb0e4]">
                  Goes with it
                </div>
                <h2 className="font-heading text-[clamp(24px,2.6vw,34px)] font-semibold leading-[1.1] tracking-[-0.026em] text-snow">
                  {details.related
                    ? 'Cases, tips and cables for these buds.'
                    : `More from ${product.category}.`}
                </h2>
              </div>
              <Link
                to="/shop"
                className="border-b border-white/20 pb-1 font-body text-[13px] font-semibold text-snow/70 transition-colors hover:text-snow"
              >
                {details.related ? 'All accessories →' : 'See more →'}
              </Link>
            </div>

            <div
              className="grid gap-[18px]"
              style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(215px,1fr))' }}
            >
              {relatedProducts.map((p) => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default ProductDetail
