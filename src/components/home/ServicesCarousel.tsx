"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { servicesCarousel } from "@/content/home";

// Elementor n-carousel widget settings (docs/reference/original-site/pages/home/page.html,
// element 134930d) + css/post-11.css.css:
//   autoplay_speed:1000 (delay between auto-advances), speed:500 (transition),
//   infinite:yes (loop), slides_to_show_tablet:2, slides_to_show_mobile:1
//   (desktop uses the widget default of 3 — no override present),
//   pause_on_hover:yes, image_spacing_custom:50 (gap).
//   Card (.elementor-element-2860071): border 1px solid primary, radius 12px,
//   padding 40/30/20px desktop/tablet/mobile. Icon (.elementor-element-b04d890
//   .elementor-image-box-img): width 30%. Arrows (--e-n-carousel-arrow-*):
//   25px, colour primary, positioned 35px outside the slide edges — kept only
//   from min-width:1450px (see button classes below) since container-content
//   has no side margin to spare below that width; closer in, arrows sit flush
//   with the card edge instead, to guarantee no horizontal overflow.
const AUTOPLAY_DELAY_MS = 1000;
const TRANSITION_MS = 500;
const GAP_PX = 50;
const SWIPE_THRESHOLD_PX = 50;

export function ServicesCarousel() {
  const cards = servicesCarousel.cards;
  const count = cards.length;

  const trackRef = useRef<HTMLDivElement>(null);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);
  // Seamless infinite loop: the track renders [tail-clones][real cards][head-clones]
  // (standard clone-carousel trick) so sliding past either end never shows blank
  // space. `position` indexes into that extended array; realStart/realEnd mark
  // where the real cards sit. Reaching a clone zone snaps back to the matching
  // real position with the transition off (imperceptible, same technique as
  // Swiper's own loop mode — no copied code, same well-known approach).
  const realStart = slidesPerView;
  const realEnd = slidesPerView + count;
  const [position, setPosition] = useState(realStart);
  const [animate, setAnimate] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragDeltaX = useRef(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1025px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateSlides = () => setSlidesPerView(mqLg.matches ? 3 : mqMd.matches ? 2 : 1);
    const updateMotion = () => setReducedMotion(mqMotion.matches);
    updateSlides();
    updateMotion();
    mqLg.addEventListener("change", updateSlides);
    mqMd.addEventListener("change", updateSlides);
    mqMotion.addEventListener("change", updateMotion);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mqLg.removeEventListener("change", updateSlides);
      mqMd.removeEventListener("change", updateSlides);
      mqMotion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // slidesPerView changing resizes the clone set, so jump (no transition) back
  // to the first real slide rather than keep a now-meaningless position.
  useEffect(() => {
    setAnimate(false);
    setPosition(slidesPerView);
  }, [slidesPerView]);

  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  useEffect(() => {
    const measure = () => {
      const card = trackRef.current?.querySelector<HTMLElement>("[data-card]");
      if (card) setCardWidth(card.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [slidesPerView]);

  const autoplayPaused = hover || focused || hidden || reducedMotion || dragging;

  const go = useCallback((dir: 1 | -1) => {
    setAnimate(true);
    setPosition((p) => p + dir);
  }, []);

  useEffect(() => {
    if (autoplayPaused || count === 0) return;
    const id = setInterval(() => go(1), AUTOPLAY_DELAY_MS);
    return () => clearInterval(id);
  }, [autoplayPaused, count, go]);

  const handleTransitionEnd = () => {
    if (position >= realEnd) {
      setAnimate(false);
      setPosition(position - count);
    } else if (position < realStart) {
      setAnimate(false);
      setPosition(position + count);
    }
  };

  const offsetPx = position * (cardWidth + GAP_PX);

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragDeltaX.current = 0;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    dragDeltaX.current = e.clientX - dragStartX.current;
  };
  const endDrag = () => {
    if (dragStartX.current === null) return;
    const delta = dragDeltaX.current;
    dragStartX.current = null;
    setDragging(false);
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) go(delta < 0 ? 1 : -1);
  };

  // [tail clones = last N real cards][real cards][head clones = first N real
  // cards]. Clones are aria-hidden/unfocusable, and their caption text is only
  // added after hydration (mounted) — the server-rendered HTML (and anything
  // that reads it without running JS) never contains duplicated card text.
  const extended = [
    ...cards.slice(-slidesPerView).map((c, i) => ({ card: c, key: `tail-${i}`, isClone: true })),
    ...cards.map((c, i) => ({ card: c, key: `real-${i}`, isClone: false })),
    ...cards.slice(0, slidesPerView).map((c, i) => ({ card: c, key: `head-${i}`, isClone: true })),
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous"
        className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-primary min-[1450px]:-left-[35px]"
      >
        <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex touch-pan-y select-none"
          style={{
            gap: `${GAP_PX}px`,
            transform: `translateX(-${offsetPx}px)`,
            transition: !animate || reducedMotion ? "none" : `transform ${TRANSITION_MS}ms ease`,
            touchAction: "pan-y",
          }}
          onTransitionEnd={handleTransitionEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
        >
          {extended.map(({ card, key, isClone }) => (
            <article
              key={key}
              data-card
              aria-hidden={isClone ? true : undefined}
              className="flex shrink-0 flex-col rounded-xl border border-primary p-[20px] md:p-[30px] lg:p-[40px]"
              style={{ width: `calc((100% - ${GAP_PX * (slidesPerView - 1)}px) / ${slidesPerView})` }}
            >
              <Image
                src={card.image}
                alt={isClone ? "" : `${card.title} icon`}
                width={150}
                height={150}
                draggable={false}
                className="h-auto w-[30%] object-contain"
              />
              {(!isClone || mounted) && (
                <>
                  <h3 tabIndex={isClone ? -1 : undefined} className="mt-5 text-[28px] font-semibold text-primary">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-grey">{card.body}</p>
                </>
              )}
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next"
        className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-primary min-[1450px]:-right-[35px]"
      >
        <svg viewBox="0 0 24 24" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
