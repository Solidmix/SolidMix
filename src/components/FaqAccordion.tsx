"use client";

import { useId, useState } from "react";
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
  openQuestionColor,
  hoverQuestionColorClass,
  questionSizeClass = "text-[22px]",
  questionWeightClass = "font-semibold",
  answerColor = "text-grey",
}: {
  items: FaqItem[];
  defaultOpen?: number;
  questionColor?: keyof typeof QUESTION_COLOR;
  // Home's first answer ("Our plant is located...") measures teal on the
  // original, unlike every other answer on the page — a one-off override
  // rather than a new shared default.
  firstAnswerColor?: keyof typeof QUESTION_COLOR;
  variant?: "bordered" | "filled";
  // Some pages' n-accordion widget gives the OPEN item a different colour
  // than the closed ones (sourced per-page from the original CSS custom
  // properties). A raw Tailwind colour class, not the QUESTION_COLOR enum,
  // because on Home/About the sourced open colour (#1f2124) is Elementor's
  // own unthemed default — it isn't tied to any of our primary/secondary/ink
  // design tokens, so it must not be approximated by one. Undefined (the
  // default) keeps every existing caller's look exactly as it was: the
  // question stays questionColor whether open or closed.
  openQuestionColor?: string;
  // Hover colour, gated to real-hover devices only (`@media(hover:hover)`)
  // so touch taps never leave a "stuck" hover colour. Undefined (the
  // default) adds no hover effect, matching every existing caller.
  hoverQuestionColorClass?: string;
  // Both default to the original hardcoded bordered-variant values, so
  // omitting them reproduces today's output exactly.
  questionSizeClass?: string;
  questionWeightClass?: string;
  answerColor?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();

  if (variant === "filled") {
    return (
      <div className="space-y-3">
        {items.map((item, i) => {
          const isOpen = open === i;
          const buttonId = `${uid}-button-${i}`;
          const panelId = `${uid}-panel-${i}`;
          return (
            <div key={item.q} className="overflow-hidden rounded-none bg-secondary">
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
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
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="bg-[#292929] p-[15px] text-white"
              >
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
        const buttonId = `${uid}-button-${i}`;
        const panelId = `${uid}-panel-${i}`;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={buttonId}
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center gap-3 px-4 py-4 text-left font-semibold text-primary"
              >
                <span aria-hidden="true" className="text-xl leading-none text-primary">
                  {isOpen ? "−" : "+"}
                </span>
                <span
                  className={`${questionSizeClass} ${questionWeightClass} ${
                    isOpen && openQuestionColor ? openQuestionColor : QUESTION_COLOR[questionColor]
                  } ${hoverQuestionColorClass ?? ""}`}
                >
                  <InlineText text={item.q} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={`px-4 pb-5 pl-11 ${i === 0 && firstAnswerColor ? QUESTION_COLOR[firstAnswerColor] : answerColor}`}
            >
              <p>
                <InlineText text={item.a} />
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
