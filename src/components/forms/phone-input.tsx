import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  invalid?: boolean;
};

// Fixed "+880" prefix box + number field. Reused at checkout, track order and contact.
export const PhoneInput = ({ invalid, className, ...props }: PhoneInputProps) => (
  <span
    className={cn(
      "flex h-11 overflow-hidden rounded-md border bg-surface transition-colors duration-150 focus-within:border-brand-bright",
      invalid ? "border-danger" : "border-control",
      className,
    )}
  >
    <span
      aria-hidden="true"
      className="flex items-center border-r border-border bg-media-frame px-3 font-heading text-label font-semibold text-ink"
    >
      +880
    </span>
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      placeholder="1XXXXXXXXX"
      aria-invalid={invalid || undefined}
      className="h-full min-w-0 flex-1 bg-transparent px-3 text-body font-normal text-ink placeholder:text-ink-muted focus-visible:outline-none"
      {...props}
    />
  </span>
);
