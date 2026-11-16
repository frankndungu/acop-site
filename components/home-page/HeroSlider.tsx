"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Cta {
  label: string;
  href: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  primary?: Cta;
  secondary?: Cta;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "September 2026 Intake Now Open! With Free Courses",
    subtitle: "Start Your Purpose Journey with Africana College of Professionals",
    image:
      "https://res.cloudinary.com/kwishi/image/upload/v1794831463/ACOP/acopseptember_ddhmk7.jpg",
    primary: { label: "Apply Now", href: "/get-started" },
    secondary: { label: "Explore Courses", href: "/courses" },
  },
  {
    id: 2,
    title: "Rooted in Faith, Driven by Excellence",
    image:
      "https://res.cloudinary.com/kwishi/image/upload/v1794830790/ACOP/slide2_vng9cb.jpg",
  },
  {
    id: 3,
    title: "Building Skills That Build Nations",
    subtitle: "Practical education for tomorrow's leaders.",
    image:
      "https://res.cloudinary.com/kwishi/image/upload/v1794830792/ACOP/slide3_edsuxt.jpg",
    primary: { label: "Discover Our Courses", href: "/courses" },
  },
  {
    id: 4,
    title: "Join a Thriving Community of Purpose-Driven Students",
    subtitle: "Where faith meets academic excellence.",
    image:
      "https://res.cloudinary.com/kwishi/image/upload/v1794830794/ACOP/slide4_y0pyty.jpg",
    primary: { label: "Apply Now", href: "/get-started" },
  },
];

const AUTOPLAY_MS = 8000;
const SWIPE_THRESHOLD_PX = 50;

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => setCurrent((index + SLIDES.length) % SLIDES.length),
    []
  );
  const goPrev = () => goTo(current - 1);
  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  // Autoplay. Depends on `current`, so any manual navigation restarts the timer.
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(goNext, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [goNext, paused]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    if (delta < 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured announcements"
      className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {SLIDES.map((slide, index) => {
        const active = index === current;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}`}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ${
              active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center"
            />

            {/* Scrim: dark enough behind the copy to keep it readable on any photo.
                Solid-ish on mobile where text spans the full width, fading to the
                right on larger screens so the photo still shows. */}
            <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-linear-to-r md:from-black/80 md:via-black/55 md:to-black/10" />

            <div className="relative z-20 container mx-auto px-6 sm:px-10 h-full flex items-center">
              <div className="max-w-xl lg:max-w-2xl text-white">
                <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-balance drop-shadow-md">
                  {slide.title}
                </h1>

                {slide.subtitle && (
                  <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed max-w-prose">
                    {slide.subtitle}
                  </p>
                )}

                {(slide.primary || slide.secondary) && (
                  <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {slide.primary && (
                      <Link
                        href={slide.primary.href}
                        tabIndex={active ? 0 : -1}
                        className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full font-semibold text-center shadow-md transition-colors"
                      >
                        {slide.primary.label}
                      </Link>
                    )}
                    {slide.secondary && (
                      <Link
                        href={slide.secondary.href}
                        tabIndex={active ? 0 : -1}
                        className="border-2 border-white hover:bg-white/15 text-white px-6 py-3 rounded-full font-semibold text-center transition-colors"
                      >
                        {slide.secondary.label}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows (hidden on touch-size screens, where swiping is used) */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-accent text-white shadow-lg transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-black/40 hover:bg-accent text-white shadow-lg transition-colors cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-0 right-0 z-30 flex justify-center gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              index === current ? "w-8 bg-accent" : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
