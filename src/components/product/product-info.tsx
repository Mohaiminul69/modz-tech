import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { ProductDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductInfoProps = {
  product: ProductDetail;
  messengerUrl: string;
};

/*
 * Description text: blank lines separate paragraphs; a line starting with "## "
 * becomes a small heading. Plain text otherwise (no HTML from the database).
 */
const Description = ({ text }: { text: string }) => (
  <>
    {text
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block, index) =>
        block.startsWith("## ") ? (
          <h3 key={index} className="mt-1 text-base font-semibold tracking-[-0.01em] text-ink lg:text-[17px] lg:leading-5.5">
            {block.slice(3)}
          </h3>
        ) : (
          <p key={index} className="whitespace-pre-line text-ink-muted">
            {block}
          </p>
        ),
      )}
  </>
);

const sectionTitle = "text-section text-ink lg:text-[24px] lg:leading-7.5";

// The mockup's "tabs" jump to sections that are all on the page (better for phones and search engines).
export const ProductInfo = ({ product, messengerUrl }: ProductInfoProps) => {
  const hasSpecs = product.specGroups.length > 0;
  const hasDescription = product.description.trim().length > 0;

  const links = [
    hasSpecs && { href: "#specification", label: "Specification" },
    hasDescription && { href: "#description", label: "Description" },
    { href: "#reviews", label: "Reviews (0)" },
    { href: "#questions", label: "Questions" },
  ].filter((link): link is { href: string; label: string } => Boolean(link));

  return (
    <div className="flex flex-col lg:mt-6 lg:gap-6">
      <nav
        aria-label="Product information"
        className="flex gap-5 overflow-x-auto border-y border-border bg-surface px-4 [scrollbar-width:none] lg:gap-8 lg:border-t-0 lg:bg-transparent lg:px-0"
      >
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className={cn(
              "flex h-12 shrink-0 items-center border-b-2 text-label font-semibold whitespace-nowrap lg:h-13 lg:text-[15px]",
              index === 0 ? "border-brand-bright text-brand-bright" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        {hasSpecs && (
          <section
            id="specification"
            aria-labelledby="specification-title"
            className="flex scroll-mt-36 flex-col gap-3.5 bg-surface px-4 py-6 lg:scroll-mt-6 lg:gap-4 lg:bg-transparent lg:p-0"
          >
            <h2 id="specification-title" className={sectionTitle}>
              Specification
            </h2>
            {product.specGroups.map((group) => (
              <div key={group.title} className="overflow-hidden rounded-md border border-border bg-surface text-label">
                <h3 className="bg-brand-tint px-3 py-2.5 font-heading text-label font-semibold tracking-normal text-brand-bright lg:px-4">
                  {group.title}
                </h3>
                <dl>
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-2 gap-3 border-t border-border px-3 py-2.5 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-4 lg:px-4"
                    >
                      <dt className="text-ink-muted">{item.label}</dt>
                      <dd className="text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </section>
        )}

        <div className={cn("flex flex-col lg:gap-4", !hasSpecs && "lg:col-span-2 lg:max-w-3xl")}>
          {hasDescription && (
            <section
              id="description"
              aria-labelledby="description-title"
              className="flex scroll-mt-36 flex-col gap-2.5 border-t border-border bg-surface px-4 py-6 lg:scroll-mt-6 lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0"
            >
              <h2 id="description-title" className={sectionTitle}>
                Description
              </h2>
              <Description text={product.description} />
            </section>
          )}

          <section
            id="reviews"
            aria-labelledby="reviews-title"
            className="flex scroll-mt-36 flex-col gap-3 border-t border-border px-4 py-6 lg:mt-4 lg:scroll-mt-6 lg:border-0 lg:p-0"
          >
            <h2 id="reviews-title" className={sectionTitle}>
              Reviews
            </h2>
            <p className="rounded-md border border-dashed border-control bg-surface p-4 text-center text-label text-ink-muted">
              No reviews yet.
            </p>
          </section>

          <section
            id="questions"
            aria-labelledby="questions-title"
            className="flex scroll-mt-36 flex-col gap-3 border-t border-border px-4 py-6 lg:mt-4 lg:scroll-mt-6 lg:border-0 lg:p-0"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="questions-title" className={sectionTitle}>
                Questions
              </h2>
              {messengerUrl && (
                <a
                  href={messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-10")}
                >
                  <MessageCircle aria-hidden="true" strokeWidth={1.5} className="size-4.5" />
                  Ask a question
                </a>
              )}
            </div>
            <p className="text-label text-ink-muted">
              Not sure if it works with your phone? Ask us on Messenger and we&apos;ll reply quickly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
