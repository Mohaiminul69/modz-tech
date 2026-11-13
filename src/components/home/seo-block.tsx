// SEO text at the bottom of the home page. Full-width white band on phones,
// white card with two columns on desktop.
export const SeoBlock = () => (
  <section
    aria-labelledby="about-title"
    className="mt-4 flex flex-col gap-3 border-t border-border bg-surface px-4 py-7 lg:my-14 lg:grid lg:grid-cols-2 lg:gap-12 lg:rounded-lg lg:border lg:px-12 lg:py-10"
  >
    <h2 id="about-title" className="text-section text-ink lg:text-section-lg">
      Gadgets and mobile accessories in Bangladesh
    </h2>
    <div className="flex flex-col gap-3">
      <p className="text-ink-muted">
        Modz Tech brings you earbuds, speakers, microphones, smart watches, trackers, chargers and adapters that
        feel premium without the premium price. Every product is 100% authentic, and you pay cash on delivery
        anywhere in Bangladesh.
      </p>
      <h3 className="mt-2 text-[17px] leading-5.5 font-semibold tracking-[-0.01em] text-ink lg:sr-only">
        Why shop with Modz Tech
      </h3>
      <p className="text-ink-muted">
        Tech that connects. Quality that lasts. Order on the site or message us on Facebook, and we will confirm
        your order by phone.
      </p>
    </div>
  </section>
);
