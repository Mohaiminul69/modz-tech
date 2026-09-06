import { Link } from 'react-router-dom'

export default function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 80% 50%, rgba(47,142,255,0.22), transparent 45%), radial-gradient(circle at 15% 20%, rgba(57,255,136,0.1), transparent 40%), radial-gradient(circle at 25% 90%, rgba(255,46,77,0.1), transparent 40%)',
        }}
      />
      <span className="beam-line left-1/3 top-0 h-full opacity-30" />
      <span className="beam-line beam-line-yellow right-1/4 top-0 h-full opacity-25" />
      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide sm:text-3xl">
          <span className="text-chrome">Ready to Upgrade </span>
          <span className="glow-text-blue text-brand-400">Your Tech?</span>
        </h2>
        <p className="mt-4 text-chrome-500">Every device deserves its own upgrade.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-105 hover:bg-brand-400"
        >
          Explore Our Shop
        </Link>
      </div>
    </section>
  )
}
