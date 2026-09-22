import heroProduct from '../../assets/products/hero_section_product.jpg'
import { useCart } from '../../context/CartContext'

const specs = [
  { value: 'ANC+ENC', label: 'Noise control' },
  { value: 'BT 5.3', label: 'Connection' },
  { value: 'Touch', label: 'Controls' },
]

const ProductSpotlight = () => {
  const { addItem } = useCart()

  return (
    <section
      id="spotlight"
      className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-[clamp(56px,6vw,96px)]"
    >
      <div
        className="grid items-center gap-[clamp(28px,4vw,64px)]"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))' }}
      >
        {/* Media well */}
        <div className="relative aspect-[5/4] overflow-hidden rounded-3xl border border-white/9 bg-surface-media">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, rgba(47,127,212,.16), transparent 62%)',
            }}
          />
          <img
            src={heroProduct}
            alt="Hoco EQ34 Plus — three-quarter detail shot"
            className="relative h-full w-full object-cover"
          />
        </div>

        {/* Copy */}
        <div>
          <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent-tint">
            03 — Product spotlight
          </span>

          <h2 className="mt-3 font-heading text-[clamp(28px,3.2vw,44px)] font-bold leading-[1.1] tracking-[-0.03em] text-snow">
            Hoco EQ34 Plus
          </h2>

          <p className="mt-4 max-w-[460px] font-body text-[15.5px] leading-relaxed text-snow/62">
            Active noise cancellation that actually cancels, a case that lasts
            the week, and touch controls that don't fire by accident — the
            earbuds we reach for ourselves.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-[2px] overflow-hidden rounded-[14px] border border-white/8 bg-white/6">
            {specs.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1 bg-surface px-4 py-[18px]">
                <span className="font-heading text-[15px] font-semibold text-snow">
                  {spec.value}
                </span>
                <span className="font-mono text-[9.5px] font-medium uppercase tracking-[0.14em] text-snow/45">
                  {spec.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-[26px] font-semibold text-snow">৳729</span>
              <span className="font-body text-[13px] text-snow/40 line-through">৳990</span>
            </div>

            <button
              type="button"
              onClick={() => addItem('hoco-eq-34-plus', 1)}
              className="bg-brand-gradient inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 font-body text-[14px] font-bold text-white shadow-[0_10px_28px_rgba(47,127,212,.3)] transition-[filter] hover:brightness-[1.08]"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductSpotlight
