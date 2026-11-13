"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  /** id of a visible label, or… */
  labelId?: string;
  /** …an accessible name when there is no visible label (cart rows). */
  label?: string;
  /** "md" = 44px buttons (product page), "sm" = 40px (cart rows, as in the mockup). */
  size?: "md" | "sm";
};

// − value + stepper. Min 1, max = available stock (capped by the caller).
export const QuantityStepper = ({ value, max, onChange, labelId, label, size = "md" }: QuantityStepperProps) => {
  const buttonClass = cn(
    "flex items-center justify-center rounded-md text-ink disabled:text-ink-muted/50",
    size === "md" ? "size-11" : "size-10",
  );

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-label={labelId ? undefined : label}
      className="inline-flex w-max items-center rounded-md border border-control bg-surface"
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className={buttonClass}
      >
        <Minus aria-hidden="true" strokeWidth={1.5} className={size === "md" ? "size-5" : "size-4.5"} />
      </button>
      <output
        aria-live="polite"
        className={cn("text-center font-heading font-semibold text-ink", size === "md" ? "w-8 text-base" : "w-7 text-[15px]")}
      >
        {value}
      </output>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={buttonClass}
      >
        <Plus aria-hidden="true" strokeWidth={1.5} className={size === "md" ? "size-5" : "size-4.5"} />
      </button>
    </div>
  );
};
