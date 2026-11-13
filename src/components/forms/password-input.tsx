"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  invalid?: boolean;
};

// Password field with a show/hide toggle.
export const PasswordInput = ({ invalid, className, ...props }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={cn(
        "flex h-11 items-center overflow-hidden rounded-md border bg-surface transition-colors duration-150 focus-within:border-brand-bright",
        invalid ? "border-danger" : "border-control",
        className,
      )}
    >
      <input
        type={visible ? "text" : "password"}
        aria-invalid={invalid || undefined}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-body font-normal text-ink placeholder:text-ink-muted focus-visible:outline-none"
        {...props}
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((value) => !value)}
        className="flex size-11 shrink-0 items-center justify-center text-ink-muted hover:text-ink"
      >
        {visible ? (
          <EyeOff aria-hidden="true" strokeWidth={1.5} className="size-5" />
        ) : (
          <Eye aria-hidden="true" strokeWidth={1.5} className="size-5" />
        )}
      </button>
    </span>
  );
};
