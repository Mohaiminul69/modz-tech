"use client";

import { Children, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  label: string;
  children: React.ReactNode;
};

/*
 * Swipeable track (CSS scroll-snap) with dot buttons. No autoplay.
 * Slides are server-rendered and passed in as children; this only tracks
 * which one is showing.
 */
export const HeroCarousel = ({ label, children }: HeroCarouselProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = Children.toArray(children);
  const count = slides.length;

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

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
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
