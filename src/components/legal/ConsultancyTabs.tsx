"use client";

import { useState } from "react";

export type ConsultancyItem = { heading: string; body: string };

// Numbered 1-4 tab buttons switching between the 4 "Just a Consultancy"
// items; active tab primary, others teal.
export function ConsultancyTabs({ items }: { items: ConsultancyItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div>
      <div className="flex gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            aria-label={`Show item ${i + 1}`}
            className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold transition-colors ${
              i === active ? "bg-primary text-white" : "bg-secondary text-white hover:bg-secondary/90"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {current && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-primary md:text-2xl">{current.heading}</h3>
          <p className="mt-3 leading-relaxed text-grey">{current.body}</p>
        </div>
      )}
    </div>
  );
}
