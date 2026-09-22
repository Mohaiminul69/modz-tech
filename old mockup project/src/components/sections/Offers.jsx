import { Link } from 'react-router-dom'
import { PiArrowRight, PiHeadphones, PiBatteryChargingVertical, PiWatch, PiCube } from 'react-icons/pi'
import { offers, offersEndDate } from '../../data/offers'

const ICONS = {
  earbuds: PiHeadphones,
  battery: PiBatteryChargingVertical,
  watch: PiWatch,
}

const OfferCard = ({ offer }) => {
  const Icon = ICONS[offer.icon] || PiCube

  return (
    <Link
      to={offer.slug}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[18px] border border-white/8 bg-surface-media transition-colors hover:border-[rgba(106,169,233,.5)]"
    >
      {offer.image ? (
        <img
          src={offer.image}
          alt={offer.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" role="img" aria-label={offer.name}>
          <Icon className="h-8 w-8 text-accent-tint/60 sm:h-12 sm:w-12" strokeWidth={1.5} />
        </div>
      )}

      <span className="absolute left-2 top-2 rounded-full bg-[rgba(47,127,212,.92)] px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#04060a] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[9.5px]">
        {offer.discount}
      </span>

      <div
        className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-0.5 px-2.5 pb-2.5 pt-8 sm:gap-1 sm:px-[18px] sm:pb-[18px] sm:pt-16"
        style={{ background: 'linear-gradient(180deg,transparent,rgba(6,8,11,.94))' }}
      >
        <div className="font-heading text-[13px] font-semibold text-white sm:text-[17px]">{offer.name}</div>
        <div className="font-mono text-[8.5px] font-medium uppercase tracking-[0.1em] text-[#7fb0e4] sm:text-[10.5px] sm:tracking-[0.14em]">
          {offer.descriptor}
        </div>
        <div className="font-body text-[11px] text-snow/62 sm:text-[13.5px]">
          Now ৳{offer.price.toLocaleString()}{' '}
          <span className="text-snow/40 line-through">৳{offer.oldPrice.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  )
}

const Offers = () => {
  return (
    <section
      id="offers"
      className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] pb-[clamp(56px,6vw,96px)] pt-[clamp(48px,5vw,80px)]"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:gap-[clamp(28px,4vw,56px)]">
        {/* Left copy column */}
        <div className="flex flex-col gap-4.5 lg:max-w-90 lg:flex-1 lg:basis-60 lg:justify-center">
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent-tint">
            01 — Offers
          </span>

          <h2 className="font-heading text-[clamp(30px,3.2vw,44px)] font-bold leading-[1.04] tracking-[-0.03em] text-snow">
            September
            <br />
            deals.
          </h2>

          <p className="max-w-[290px] font-body text-[14.5px] leading-relaxed text-snow/58">
            Real cuts on a short list of pieces — while stock and the month last.
          </p>

          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(106,169,233,.3)] bg-[rgba(47,127,212,.08)] px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(47,127,212,.8)]" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-accent-tint">
              {offersEndDate}
            </span>
          </span>

          <Link
            to="/offers"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 px-5 py-2.5 font-body text-[13px] font-semibold text-snow transition-colors hover:bg-white/6"
          >
            Explore all offers
            <PiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Right card row: 2-up on phones, exactly three columns from sm up */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:flex-[3_1_420px]">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Offers
