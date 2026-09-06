import { PiCube } from 'react-icons/pi'

export default function Identity() {
  return (
    <section className="border-y border-line bg-ink-soft">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="glow-border relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-ink-elevated">
          <div className="bg-grid absolute inset-0 opacity-50" />
          <PiCube className="glow-text-blue relative h-24 w-24 text-brand-400" strokeWidth={1} />
        </div>
        <div>
          <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
            Our Identity
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold uppercase tracking-wide text-chrome sm:text-3xl">
            Built Around How You Actually Use Tech
          </h2>
          <p className="mt-6 text-chrome-500">
            Modz Tech is a tech accessories brand created with one simple belief: every device
            deserves the right upgrade. We hand-pick gear that's reliable, affordable, and ready
            for real life — whether you're commuting, working, gaming, or creating.
          </p>
        </div>
      </div>
    </section>
  )
}
