import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  eyebrow?: string;
  href?: string;
  linkLabel?: string;
  /** Extra controls shown before "Show all" on desktop (e.g. brand chips). */
  actions?: React.ReactNode;
  id?: string;
};

export const SectionHeader = ({ title, eyebrow, href, linkLabel = "Show all", actions, id }: SectionHeaderProps) => (
  <div className="flex items-end justify-between gap-2">
    <div className="flex flex-col gap-1">
      {eyebrow && <span className="eyebrow text-brand-bright">{eyebrow}</span>}
      <h2 id={id} className="text-section text-ink lg:text-section-lg">
        {title}
      </h2>
    </div>
    <div className="flex items-center gap-4">
      {actions}
      {href && (
        <Link
          href={href}
          className="flex min-h-11 shrink-0 items-end rounded-sm pb-1 text-label font-semibold text-brand-bright hover:text-brand lg:text-body"
        >
          {linkLabel}
          <span className="sr-only">: {title}</span>
        </Link>
      )}
    </div>
  </div>
);
