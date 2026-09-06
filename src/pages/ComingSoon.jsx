import { Link, useLocation } from 'react-router-dom'

export default function ComingSoon() {
  const { pathname } = useLocation()
  const label = pathname.replace('/', '') || 'page'

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center sm:px-6">
      <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
        Coming Soon
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold uppercase tracking-wide text-chrome sm:text-4xl">
        {label}
      </h1>
      <p className="mt-4 text-chrome-500">
        We're still building this page. Check back soon, or head back to the homepage.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-400"
      >
        Back to Home
      </Link>
    </section>
  )
}
