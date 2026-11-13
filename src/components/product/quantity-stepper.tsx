"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  labelId?: string;
};

// − value + stepper. Min 1, max = available stock (capped by the caller).
export const QuantityStepper = ({ value, max, onChange, labelId }: QuantityStepperProps) => (
  <div
    role="group"
    aria-labelledby={labelId}
    className="inline-flex items-center rounded-md border border-control bg-surface"
  >
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={value <= 1}
      onClick={() => onChange(Math.max(1, value - 1))}
      className="flex size-11 items-center justify-center rounded-md text-ink disabled:text-ink-muted/50"
    >
      <Minus aria-hidden="true" strokeWidth={1.5} className="size-5" />
    </button>
    <output aria-live="polite" className="w-8 text-center font-heading text-base font-semibold text-ink">
      {value}
    </output>
    <button
      type="button"
      aria-label="Increase quantity"
      disabled={value >= max}
      onClick={() => onChange(Math.min(max, value + 1))}
      className="flex size-11 items-center justify-center rounded-md text-ink disabled:text-ink-muted/50"
    >
      <Plus aria-hidden="true" strokeWidth={1.5} className="size-5" />
    </button>
  </div>
);
