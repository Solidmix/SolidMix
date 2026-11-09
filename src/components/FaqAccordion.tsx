"use client";

import { useState } from "react";

type FaqItem = { q: string; a: string };

export function FaqAccordion({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-grey-line rounded-lg border border-grey-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 px-4 py-4 text-left font-semibold text-primary"
              >
                <span aria-hidden="true" className="text-xl leading-none text-primary">
                  {isOpen ? "−" : "+"}
                </span>
                <span className="text-ink">{item.q}</span>
              </button>
            </h3>
            {isOpen && (
              <div className="px-4 pb-5 pl-11 text-grey">
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
