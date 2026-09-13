import { siteConfig } from '../../data/siteConfig'

const phoneDigits = siteConfig.whatsappDisplay.replace(/\s+/g, '')

const socials = [
  { label: 'Facebook', handle: '/modztech', href: siteConfig.social.facebook },
  { label: 'Messenger', handle: 'm.me/modztech', href: siteConfig.social.messenger },
  { label: 'Instagram', handle: '@modztech', href: siteConfig.social.instagram },
  { label: 'Email', handle: siteConfig.email, href: `mailto:${siteConfig.email}` },
]

const CallToAction = () => {
  return (
    <section className="mx-auto max-w-[1680px] px-[clamp(20px,4vw,64px)] py-[clamp(56px,6vw,96px)]">
      <div
        className="relative overflow-hidden rounded-[28px] border border-[rgba(106,169,233,.22)] px-[clamp(24px,4vw,64px)] py-[clamp(44px,6vw,88px)] text-center"
        style={{ backgroundColor: '#0a0d13' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 120%, rgba(47,127,212,.28), transparent 70%)',
          }}
        />

        <div className="relative flex flex-col items-center">
          <span className="mb-4.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-accent-tint">
            04 — Order or ask
          </span>

          <h2 className="mb-4 max-w-[14em] font-heading text-[clamp(28px,3.6vw,50px)] font-semibold leading-[1.06] tracking-[-0.032em] text-snow">
            Message us and we'll sort it out.
          </h2>

          <p className="mb-8 max-w-[440px] font-body text-[15px] leading-relaxed text-snow/60">
            Stock, sizing, or placing an order — WhatsApp is the fastest way to
            reach us. Cash on delivery nationwide.
          </p>

          <div className="mb-8.5 flex flex-wrap items-center justify-center gap-3">
            <a
              href={siteConfig.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="bg-brand-gradient inline-flex items-center gap-2.5 rounded-full px-7 py-3.75 font-body text-[14px] font-bold text-white shadow-[0_10px_30px_rgba(47,127,212,.35)] transition-[filter] hover:brightness-[1.08]"
            >
              WhatsApp · {siteConfig.whatsappDisplay}
            </a>
            <a
              href={`tel:${phoneDigits}`}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/16 px-6.5 py-3.75 font-body text-[14px] font-semibold text-snow transition-colors hover:bg-white/6"
            >
              Call instead
            </a>
          </div>

          <div
            className="grid w-full max-w-[740px] gap-2.5 border-t border-white/8 pt-7"
            style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex flex-col items-start gap-1 rounded-2xl border border-white/10 bg-white/3 px-[18px] py-[13px] text-left transition-colors hover:border-[rgba(106,169,233,.45)] hover:bg-[rgba(47,127,212,.1)]"
              >
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[rgba(242,244,247,.58)]">
                  {social.label}
                </span>
                <span className="font-body text-[13.5px] font-semibold text-snow">
                  {social.handle}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
