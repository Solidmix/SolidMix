"use client";

import { useRef } from "react";
import Image from "next/image";
import { servicesCarousel } from "@/content/home";

export function ServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : 320;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label="Previous"
        className="absolute -left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-grey-line bg-white text-primary shadow md:flex"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {servicesCarousel.cards.map((card) => (
          <article
            key={card.title}
            data-card
            className="hover-bob flex w-full flex-shrink-0 snap-start flex-col rounded-xl border border-grey-line p-7 shadow-sm sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            <Image
              src={card.image}
              alt={`${card.title} icon`}
              width={72}
              height={72}
              className="h-16 w-16 object-contain"
            />
            <h3 className="mt-5 text-[28px] font-semibold text-primary">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-grey">{card.body}</p>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label="Next"
        className="absolute -right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-grey-line bg-white text-primary shadow md:flex"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
