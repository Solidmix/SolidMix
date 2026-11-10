"use client";

import { useEffect, useRef, useState } from "react";

export type ProgressItem = { emoji: string; label: string; percent: number };

// 2 columns desktop; each bar fills to its percentage once it scrolls into
// view (prefers-reduced-motion skips the animation and shows the final value).
export function ProgressBars({ items }: { items: ProgressItem[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reducedMotion) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={ref} className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <p className="font-semibold text-primary">
            <span aria-hidden="true">{item.emoji}</span> {item.label}
          </p>
          <div className="mt-2 h-7 w-full overflow-hidden rounded-full bg-grey-line">
            <div
              className="flex h-full items-center justify-end rounded-full bg-primary pr-2 text-xs font-semibold text-white transition-[width] duration-1000 ease-out"
              style={{ width: visible ? `${item.percent}%` : "0%" }}
            >
              {`${item.percent}%`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
