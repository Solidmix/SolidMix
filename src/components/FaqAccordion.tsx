"use client";

import { useState } from "react";
import { InlineText } from "@/components/InlineText";

type FaqItem = { q: string; a: string };

const QUESTION_COLOR = {
  ink: "text-ink",
  primary: "text-primary",
  secondary: "text-secondary",
} as const;

// Question colour varies per page on the original (measured per-page in
// .local-tools/parity); default "ink" matches blog posts and product pages.
export function FaqAccordion({
  items,
  defaultOpen = 0,
  questionColor = "ink",
}: {
  items: FaqItem[];
  defaultOpen?: number;
  questionColor?: keyof typeof QUESTION_COLOR;
}) {
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
                <span className={`text-[22px] font-semibold ${QUESTION_COLOR[questionColor]}`}>
                  <InlineText text={item.q} />
                </span>
              </button>
            </h3>
            {isOpen && (
              <div className="px-4 pb-5 pl-11 text-grey">
                <p>
                  <InlineText text={item.a} />
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
