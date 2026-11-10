"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// Order matches the original site: Boom Pump Service slide shows first.
const SLIDES = [
  { src: "/images/hero/slide-3.webp", alt: "SolidMix RMC — Raipur's 1st Boom Pump Service for faster concrete placement" },
  { src: "/images/hero/slide-1.webp", alt: "SolidMix RMC — Raipur's complete concrete solution: RMC, transit mixers and boom pump services" },
  { src: "/images/hero/slide-2.webp", alt: "SolidMix RMC ready mix concrete transit mixer fleet, on-time every time" },
];

const AUTOPLAY_MS = 5000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <section
      className="relative overflow-hidden bg-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="SolidMix RMC highlights"
    >
      <div className="relative aspect-[16/9] w-full sm:aspect-[21/9] lg:aspect-[3/1]">
        {SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-dark transition-colors hover:bg-white md:left-4"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-dark transition-colors hover:bg-white md:right-4"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === index ? "bg-primary" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
