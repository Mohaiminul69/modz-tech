"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const MINUTE = 60_000;

// Ticks once a minute. The server snapshot is null, so the time is only filled in
// after hydration (no server/client mismatch, no prerender clock access).
const subscribe = (onChange: () => void) => {
  const timer = setInterval(onChange, MINUTE / 4);
  return () => clearInterval(timer);
};
const getSnapshot = () => Math.floor(Date.now() / MINUTE);
const getServerSnapshot = () => null;

const formatRemaining = (ms: number) => {
  const totalMinutes = Math.floor(ms / MINUTE);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
};

type CountdownProps = {
  endsAt: string;
  className?: string;
};

export const Countdown = ({ endsAt, className }: CountdownProps) => {
  const nowMinute = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const remaining = nowMinute === null ? null : new Date(endsAt).getTime() - nowMinute * MINUTE;

  if (remaining !== null && remaining <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-chrome-border bg-chrome-surface px-3 py-1.5 font-heading text-small font-semibold text-chrome-silver lg:px-3.5 lg:py-2 lg:text-small-lg",
        remaining === null && "invisible",
        className,
      )}
    >
      Ends in {remaining === null ? "0d 0h 0m" : formatRemaining(remaining)}
    </span>
  );
};
