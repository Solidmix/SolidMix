"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type LightboxImage = { src: string; alt: string; width?: number; height?: number };

export function Lightbox({ images }: { images: LightboxImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft")
        setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, images.length]);

  return (
    <>
      {/* Masonry (page.html e9e9ec7: gallery_layout:masonry, columns:4/2/1 desktop/
          tablet/mobile, gap:10px) via CSS multi-column — each photo keeps its own
          natural aspect ratio (no crop), unlike a uniform grid. */}
      <div className="columns-1 gap-[10px] md:columns-2 lg:columns-4">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="reveal reveal-fade is-visible mb-[10px] block w-full overflow-hidden rounded-lg bg-tint-cyan-2 transition-transform hover:scale-[1.02]"
            style={{ breakInside: "avoid" }}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={img.width ?? 800}
              height={img.height ?? 800}
              loading={i < 4 ? "eager" : "lazy"}
              className="h-auto w-full"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery photo viewer"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
            }}
            aria-label="Previous photo"
            className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
            }}
            aria-label="Next photo"
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              width={1200}
              height={1200}
              className="mx-auto h-auto max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
