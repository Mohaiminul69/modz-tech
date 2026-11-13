import * as React from "react"
import { cn } from "@/lib/utils"

// Restyled: 8px radius, border-control edge on white, grows with its content.
// Focus uses the global 2px brand-bright outline.
const Textarea = ({ className, ...props }: React.ComponentProps<"textarea">) => (
  <textarea
    data-slot="textarea"
    className={cn(
      "flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-control bg-surface px-3 py-2.5 text-body text-ink transition-colors duration-150 placeholder:text-ink-muted disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
      className
    )}
    {...props}
  />
)

export { Textarea }
