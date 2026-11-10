"use client";

import { useState } from "react";
import Image from "next/image";
import { hero, intro } from "@/content/home";

export function AboutTabs() {
  const [active, setActive] = useState<"about" | "mission" | "vision">("about");

  const panels: Record<string, { heading?: string; bodyHtml?: string; body?: string }> = {
    about: { heading: intro.heading, bodyHtml: intro.bodyHtml },
    mission: { body: intro.mission },
    vision: { body: intro.vision },
  };
  const panel = panels[active];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="flex flex-wrap gap-3">
          {hero.tabs.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key as typeof active)}
                aria-pressed={isActive}
                className={`rounded-md px-6 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "bg-primary text-white" : "bg-secondary text-white hover:bg-secondary/90"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          {panel.heading && (
            <h2 className="mb-4 text-2xl font-bold text-secondary md:text-3xl">{panel.heading}</h2>
          )}
          {panel.bodyHtml ? (
            <p
              className="leading-relaxed text-ink [&_a]:text-primary [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: panel.bodyHtml }}
            />
          ) : (
            <p className="leading-relaxed text-ink">{panel.body}</p>
          )}
          {active === "about" && (
            <a
              href={intro.cta.href}
              className="mt-6 inline-block rounded-md bg-secondary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-secondary/90"
            >
              {intro.cta.label}
            </a>
          )}
        </div>
      </div>
      <div className="flex justify-center lg:justify-end">
        <Image
          src="/images/mixer-truck.webp"
          alt="SolidMix RMC transit mixer truck"
          width={520}
          height={310}
          className="h-auto w-full max-w-md"
        />
      </div>
    </div>
  );
}
