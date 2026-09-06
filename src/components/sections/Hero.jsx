import { Link } from 'react-router-dom'
import {
  PiArrowRight,
  PiSealCheck,
  PiShieldCheck,
  PiCpu,
  PiHeadphones,
} from 'react-icons/pi'

const features = [
  { icon: PiSealCheck, label: 'Premium Quality', accent: 'blue' },
  { icon: PiShieldCheck, label: 'Reliable Performance', accent: 'red' },
  { icon: PiCpu, label: 'Modern Technology', accent: 'yellow' },
  { icon: PiHeadphones, label: 'Built For Your Lifestyle', accent: 'green' },
]

const accentClasses = {
  blue: { ring: 'border-brand-500/40', text: 'text-brand-400' },
  yellow: { ring: 'border-neon-yellow/40', text: 'text-neon-yellow' },
  red: { ring: 'border-neon-red/40', text: 'text-neon-red' },
  green: { ring: 'border-neon-green/40', text: 'text-neon-green' },
}

const categories = ['Earphones', 'Headphones', 'Chargers', 'Adapters', 'And More']

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 15%, rgba(47,142,255,0.18), transparent 40%), radial-gradient(circle at 85% 10%, rgba(79,179,255,0.15), transparent 45%), radial-gradient(circle at 90% 85%, rgba(245,217,10,0.1), transparent 40%), radial-gradient(circle at 5% 80%, rgba(255,46,77,0.1), transparent 40%), radial-gradient(circle at 50% 100%, rgba(57,255,136,0.08), transparent 35%)',
        }}
      />
      {/* Beam lines echoing the brand banner */}
      <span className="beam-line left-[10%] top-0 h-full opacity-40" />
      <span className="beam-line beam-line-red left-[22%] top-0 h-full opacity-30" />
      <span className="beam-line beam-line-green left-[36%] top-0 h-full opacity-20" />
      <span className="beam-line right-[22%] top-0 h-full opacity-30" />
      <span className="beam-line beam-line-yellow right-[10%] top-0 h-full opacity-30" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <span className="font-label flex items-center gap-2.5 rounded-full border border-line bg-ink-elevated px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-neon-red" />
            <span className="h-1.5 w-1.5 rounded-full bg-neon-yellow" />
            <span className="h-1.5 w-1.5 rounded-full bg-neon-green" />
          </span>
          New Season, New Gear
        </span>

        <h1 className="mt-6 max-w-3xl font-display text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl lg:text-5xl">
          <span className="text-chrome">Tech That Connects.</span>
          <br />
          <span className="glow-text-blue text-brand-400">Quality That Lasts.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-chrome-500">
          From work hours to play hours, find the gadget that powers your day.
        </p>

        <Link
          to="/shop"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105 hover:bg-brand-400"
        >
          View All Products
          <PiArrowRight className="h-4 w-4" />
        </Link>

        {/* Feature strip */}
        <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-y-6 border-y border-line py-8 sm:grid-cols-4 sm:gap-x-4">
          {features.map(({ icon: Icon, label, accent }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-2 sm:flex-row sm:justify-center">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${accentClasses[accent].ring} ${accentClasses[accent].text}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="font-label text-xs font-semibold uppercase tracking-wider text-chrome-300">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Category strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          {categories.map((cat, i) => (
            <span key={cat} className="flex items-center gap-3">
              <span className="font-label text-xs uppercase tracking-[0.2em] text-chrome-500">
                {cat}
              </span>
              {i < categories.length - 1 && <span className="h-3 w-px bg-line" />}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
