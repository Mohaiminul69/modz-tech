"use client";

import { Children, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  label: string;
  children: React.ReactNode;
};

// How long each slide stays before moving on by itself.
const AUTOPLAY_MS = 5000;

/*
 * Swipeable track (CSS scroll-snap) with dot buttons.
 * Slides are server-rendered and passed in as children; this only tracks
 * which one is showing.
 *
 * Autoplay: moves to the next slide every AUTOPLAY_MS. Any change of slide
 * (swipe, dot, or autoplay) restarts the timer, so a manual swipe always gets
 * the full time. Paused while the pointer is over it, a finger is on it, it
 * has keyboard focus, or the tab is hidden; off for reduced motion.
 */
export const HeroCarousel = ({ label, children }: HeroCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [touching, setTouching] = useState(false);
  const [focused, setFocused] = useState(false);
  const slides = Children.toArray(children);
  const count = slides.length;
  const paused = hovered || touching || focused;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setActive(Math.round(track.scrollLeft / track.clientWidth));
      });
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", handleScroll);
    };
  }, [count]);

  const goTo = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  // Bumped when the tab becomes visible again, to restart the countdown.
  const [visibleTick, setVisibleTick] = useState(0);
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setVisibleTick((tick) => tick + 1);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => {
      if (document.hidden) return;
      const track = trackRef.current;
      if (!track) return;
      track.scrollTo({ left: ((active + 1) % count) * track.clientWidth, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, count, paused, visibleTick]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
            className="w-full shrink-0 snap-start"
          >
            {slide}
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-0.5 pb-3 lg:pb-5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
              className="flex h-6 items-center rounded-full px-1"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-1 rounded-full transition-[width,background-color] duration-200 ease-out",
                  index === active ? "w-5 bg-chrome-accent" : "w-1.5 bg-chrome-border",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
