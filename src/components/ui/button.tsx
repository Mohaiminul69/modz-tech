import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Restyled to the Modz Tech mockup: 44px tall, 8px radius, sentence case,
// Hind Siliguri 600. Focus uses the global 2px brand-bright outline.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding font-sans font-semibold whitespace-nowrap transition-[background-color,box-shadow,color] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-brand text-on-brand hover:bg-brand-bright hover:shadow-glow",
        outline: "border-control bg-surface text-ink hover:bg-brand-tint",
        secondary: "bg-brand-tint text-brand-bright hover:bg-brand-tint/70",
        ghost: "text-ink hover:bg-brand-tint",
        destructive: "bg-surface text-danger hover:bg-danger/10",
        link: "text-brand-bright underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-body",
        sm: "h-9 px-4 text-label",
        lg: "h-12 px-6 text-body",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = ({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
