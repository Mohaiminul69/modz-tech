import { PiQuotes } from 'react-icons/pi'
import { testimonials } from '../../data/testimonials'

const accentColors = ['text-brand-400', 'text-neon-red', 'text-neon-yellow', 'text-neon-green']

export default function Testimonials() {
  return (
    <section className="border-y border-line bg-ink-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-chrome sm:text-3xl">
            What Customers Say
          </h2>
          <p className="mt-3 text-chrome-500">Sample reviews — real customer stories coming soon.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="glow-border-hover rounded-2xl border border-line bg-ink-elevated p-6"
            >
              <PiQuotes className={`h-6 w-6 ${accentColors[i % accentColors.length]}`} />
              <p className="mt-4 text-sm leading-relaxed text-chrome-300">{t.quote}</p>
              <div className="mt-5 border-t border-line pt-4">
                <p className="text-sm font-semibold text-chrome-100">{t.name}</p>
                <p className="text-xs text-chrome-700">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
