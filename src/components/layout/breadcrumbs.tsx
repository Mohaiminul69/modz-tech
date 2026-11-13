import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

// Last crumb is the current page (no link).
export const Breadcrumbs = ({ items, className }: { items: Crumb[]; className?: string }) => (
  <nav aria-label="Breadcrumb" className={cn("text-small text-ink-muted lg:text-small-lg", className)}>
    <ol className="flex flex-wrap items-center gap-1.5 lg:gap-2">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 && (
            <li aria-hidden="true" className="select-none">
              /
            </li>
          )}
          <li className="min-w-0">
            {item.href ? (
              <Link href={item.href} className="rounded-sm text-brand-bright hover:text-brand">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {item.label}
              </span>
            )}
          </li>
        </Fragment>
      ))}
    </ol>
  </nav>
);
