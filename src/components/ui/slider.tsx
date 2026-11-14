"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Slider as SliderPrimitive } from "radix-ui"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  /** Accessible name per thumb, e.g. ["Minimum price", "Maximum price"]. */
  thumbLabels?: string[]
}

// Restyled: brand range on a light track, 20px white thumbs with a brand edge and a
// 44px touch area. Focus uses the global 2px brand-bright outline.
const Slider = ({ className, defaultValue, value, min = 0, max = 100, thumbLabels, ...props }: SliderProps) => {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex h-11 w-full touch-none items-center select-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1.5 grow overflow-hidden rounded-full bg-media-frame"
      >
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-brand" />
      </SliderPrimitive.Track>
      {Array.from({ length: values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbLabels?.[index]}
          className="relative block size-5 shrink-0 rounded-full border-2 border-brand bg-surface shadow-card transition-shadow duration-150 after:absolute after:-inset-3 hover:shadow-glow active:shadow-glow"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
