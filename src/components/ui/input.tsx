import * as React from "react"
import { cn } from "@/lib/utils"

// Restyled: 44px tall, 8px radius, border-control edge on white.
// Focus uses the global 2px brand-bright outline.
const Input = ({ className, type, ...props }: React.ComponentProps<"input">) => (
  <input
    type={type}
    data-slot="input"
    className={cn(
      "h-11 w-full min-w-0 rounded-md border border-control bg-surface px-3 text-body text-ink transition-colors duration-150 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-label file:font-medium placeholder:text-ink-muted disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
      className
    )}
    {...props}
  />
)

export { Input }
