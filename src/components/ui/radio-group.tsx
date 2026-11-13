"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

const RadioGroup = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) => (
  <RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid w-full gap-2", className)} {...props} />
)

// Restyled: 20px circle, border-control edge, brand fill with a white dot when checked.
// Focus uses the global 2px brand-bright outline.
const RadioGroupItem = ({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => (
  <RadioGroupPrimitive.Item
    data-slot="radio-group-item"
    className={cn(
      "peer relative flex aspect-square size-5 shrink-0 rounded-full border border-control bg-surface transition-colors duration-150 disabled:cursor-not-allowed disabled:border-border disabled:bg-media-frame aria-invalid:border-danger data-checked:border-brand data-checked:bg-brand",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator data-slot="radio-group-indicator" className="flex size-full items-center justify-center">
      <span className="size-2 rounded-full bg-on-brand" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
)

export { RadioGroup, RadioGroupItem }
