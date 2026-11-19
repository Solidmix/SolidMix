"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export type LightboxImage = { src: string; alt: string; width?: number; height?: number };

const GAP = 10;

// Elementor's masonry gallery (page.html widget e9e9ec7: gallery_layout:masonry)
// places each next photo into whichever column is currently shortest, using
// each photo's own aspect ratio — not CSS multi-column's row-balanced fill,
// which gives a different (wrong) order. Reproduced here from first
// principles; verified to reproduce the live original's exact measured
// column assignment at both 4 and 2 columns.
function layoutMasonry(images: LightboxImage[], columns: number, containerWidth: number) {
  const colWidth = (containerWidth - (columns - 1) * GAP) / columns;
  const colHeights = new Array(columns).fill(0);
  return images.map((img) => {
    const ratio = (img.height ?? 1) / (img.width ?? 1);
    const itemHeight = colWidth * ratio;
    let col = 0;
    for (let c = 1; c < columns; c++) {
      if (colHeights[c] < colHeights[col]) col = c;
    }
    const top = colHeights[col] > 0 ? colHeights[col] + GAP : 0;
    colHeights[col] = top + itemHeight;
    return { left: col * (colWidth + GAP), top, width: colWidth, height: itemHeight };
  });
}

export function Lightbox({ images }: { images: LightboxImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // Elementor default breakpoints (post-15.css.css @media(max-width:767px);
  // page.html widget e9e9ec7 columns:4/columns_tablet:2/columns_mobile:1) —
  // desktop (4 cols) is the initial/server-rendered state, matched on the
  // client once mounted.
  const [columns, setColumns] = useState(4);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mqTablet = window.matchMedia("(min-width: 768px)");
    const mqDesktop = window.matchMedia("(min-width: 1024px)");
    const updateColumns = () => setColumns(mqDesktop.matches ? 4 : mqTablet.matches ? 2 : 1);
    const updateWidth = () => {
      if (gridRef.current) setContainerWidth(gridRef.current.clientWidth);
    };
    updateColumns();
    updateWidth();
    mqTablet.addEventListener("change", updateColumns);
    mqDesktop.addEventListener("change", updateColumns);
    window.addEventListener("resize", updateWidth);
    const ro = new ResizeObserver(updateWidth);
    if (gridRef.current) ro.observe(gridRef.current);
    return () => {
      mqTablet.removeEventListener("change", updateColumns);
      mqDesktop.removeEventListener("change", updateColumns);
      window.removeEventListener("resize", updateWidth);
      ro.disconnect();
    };
  }, []);

  const layout = useMemo(
    () => (containerWidth ? layoutMasonry(images, columns, containerWidth) : null),
    [images, columns, containerWidth],
  );

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
      {/* Container: max-width 1380px (post-7.css.css.css kit var
          --container-max-width:1380px), padding 0 desktop/tablet, 20px mobile
          (post-15.css.css.css el f01ee3e, @media(max-width:767px)). Masonry
          (page.html e9e9ec7: gallery_layout:masonry, columns:4/2/1, gap:10px)
          placed via layoutMasonry above once the container is measured; the
          CSS multi-column fallback below only shows before that measurement
          (server render / first paint), so desktop always starts at 4 columns. */}
      <div className="mx-auto w-full max-w-[1380px] px-5 md:px-0">
        {/* gridRef/relative live on this inner wrapper (no padding of its
            own) so clientWidth is the usable content width and absolute
            children's left:0 lines up with the padded edge, not the
            viewport edge. */}
        <div ref={gridRef} className="relative">
          {layout ? (
            <div style={{ height: Math.max(...layout.map((l) => l.top + l.height)) }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="reveal reveal-fade is-visible absolute block"
                  style={{ left: layout[i].left, top: layout[i].top, width: layout[i].width }}
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
          ) : (
            <div className="columns-1 gap-[10px] md:columns-2 lg:columns-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="reveal reveal-fade is-visible mb-[10px] block w-full"
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
          )}
        </div>
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
            className="relative max-h-[90vh] max-w-[95vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              width={images[openIndex].width ?? 1200}
              height={images[openIndex].height ?? 1200}
              sizes="95vw"
              priority
              className="mx-auto h-auto max-h-[90vh] w-auto max-w-[95vw] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
