"use client";

import { useEffect, useState } from "react";

/*
 * Header search field whose placeholder "types out" examples of what shoppers can search for.
 * The animation pauses while the field is focused or filled, and is skipped entirely for
 * visitors with "reduce motion" turned on. The examples match real categories, so each one finds products.
 */

const EXAMPLES = [
  "wireless earbuds",
  "fast charger",
  "bluetooth speaker",
  "smart watch",
  "wireless mic",
  "AirPods case cover",
  "AirTag tracker",
  "charger adapter",
];

const STATIC_PLACEHOLDER = "Search earbuds, chargers, watches…";
const PREFIX = "Search ";

// Timings in ms.
const TYPE_SPEED = 75;
const DELETE_SPEED = 35;
const HOLD_TYPED = 1600;
const HOLD_EMPTY = 350;
const START_DELAY = 1200;

type Phase = "typing" | "holding" | "deleting" | "waiting";

export const TypingSearchInput = ({ defaultValue }: { defaultValue?: string }) => {
  // Server render and first paint show the plain placeholder; typing starts after load.
  const [text, setText] = useState<string | null>(null);
  const [paused, setPaused] = useState(Boolean(defaultValue));

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let example = 0;
    let length = 0;
    let phase: Phase = "typing";
    let timer: ReturnType<typeof setTimeout>;

    const step = () => {
      const word = EXAMPLES[example];
      let delay = TYPE_SPEED;

      if (phase === "typing") {
        length += 1;
        if (length >= word.length) {
          phase = "holding";
          delay = HOLD_TYPED;
        }
      } else if (phase === "holding") {
        phase = "deleting";
        delay = DELETE_SPEED;
      } else if (phase === "deleting") {
        length -= 1;
        delay = DELETE_SPEED;
        if (length <= 0) {
          phase = "waiting";
          delay = HOLD_EMPTY;
        }
      } else {
        example = (example + 1) % EXAMPLES.length;
        phase = "typing";
      }

      setText(word.slice(0, length));
      timer = setTimeout(step, delay);
    };

    timer = setTimeout(step, START_DELAY);
    return () => clearTimeout(timer);
  }, [paused]);

  return (
    <input
      type="search"
      name="q"
      defaultValue={defaultValue}
      // Typing examples show a trailing bar as a cursor.
      placeholder={text === null || paused ? STATIC_PLACEHOLDER : `${PREFIX}${text}|`}
      aria-label="Search products"
      enterKeyHint="search"
      autoComplete="off"
      onFocus={() => setPaused(true)}
      onBlur={(event) => setPaused(event.currentTarget.value !== "")}
      className="h-full min-w-0 flex-1 bg-transparent text-body text-on-chrome placeholder:text-on-chrome-muted focus-visible:outline-none"
    />
  );
};
