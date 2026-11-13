import Form from "next/form";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchFormProps = {
  /** "compact" = mobile header field, "wide" = desktop header field with a Search button. */
  variant: "compact" | "wide";
  defaultValue?: string;
  className?: string;
};

// Plain GET form to /search, so it works without JavaScript.
export const SearchForm = ({ variant, defaultValue, className }: SearchFormProps) => {
  const wide = variant === "wide";

  return (
    <Form
      action="/search"
      role="search"
      className={cn(
        "flex items-center rounded-md border border-chrome-border bg-chrome-surface text-on-chrome-muted transition-colors duration-150 focus-within:border-chrome-accent",
        wide ? "h-12 gap-2.5 pr-1.5 pl-4" : "h-11 gap-2 px-3",
        className,
      )}
    >
      <Search aria-hidden="true" strokeWidth={1.5} className={wide ? "size-5" : "size-4.5"} />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search earbuds, chargers, watches…"
        aria-label="Search products"
        enterKeyHint="search"
        autoComplete="off"
        className="h-full min-w-0 flex-1 bg-transparent text-body text-on-chrome placeholder:text-on-chrome-muted focus-visible:outline-none"
      />
      {wide && (
        <button
          type="submit"
          className="h-9 rounded-[6px] bg-brand px-4 text-label font-semibold text-on-brand transition-colors duration-150 hover:bg-brand-bright"
        >
          Search
        </button>
      )}
    </Form>
  );
};
