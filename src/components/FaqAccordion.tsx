"use client";

import { useState } from "react";
import { InlineText } from "@/components/InlineText";

type FaqItem = { q: string; a: string; list?: string[] };

const QUESTION_COLOR = {
  ink: "text-ink",
  primary: "text-primary",
  secondary: "text-secondary",
} as const;

// Question colour varies per page on the original (measured per-page in
// .local-tools/parity); default "ink" matches blog posts and product pages.
// variant "filled" is the solid-teal boxed accordion used on the product
// list's dark FAQ section (confirmed against the original screenshot) —
// "bordered" is the plain white/grey-border style used everywhere else.
export function FaqAccordion({
  items,
  defaultOpen = 0,
  questionColor = "ink",
  firstAnswerColor,
  variant = "bordered",
}: {
  items: FaqItem[];
  defaultOpen?: number;
  questionColor?: keyof typeof QUESTION_COLOR;
  // Home's first answer ("Our plant is located...") measures teal on the
  // original, unlike every other answer on the page — a one-off override
  // rather than a new shared default.
  firstAnswerColor?: keyof typeof QUESTION_COLOR;
  variant?: "bordered" | "filled";
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  if (variant === "filled") {
    return (
      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="overflow-hidden rounded-none bg-secondary">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-3 p-[15px] text-left font-semibold text-white"
                >
                  <span className="text-[20px] font-semibold text-white">
                    <InlineText text={item.q} />
                  </span>
                  <span aria-hidden="true" className="text-xl leading-none text-white">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
              </h3>
              {isOpen && (
                <div className="bg-[#292929] p-[15px] text-white">
                  <p>
                    <InlineText text={item.a} />
                  </p>
                  {item.list && (
                    <ul className="mt-4 list-disc space-y-2 pl-6">
                      {item.list.map((li, j) => (
                        <li key={j}>
                          <InlineText text={li} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

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
              <div
                className={`px-4 pb-5 pl-11 ${i === 0 && firstAnswerColor ? QUESTION_COLOR[firstAnswerColor] : "text-grey"}`}
              >
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
