"use client";

import { useState } from "react";
import Image from "next/image";

export type WorkPanel = {
  key: string;
  label: string;
  image: { src: string; alt: string };
  heading: string;
  intro: string;
  stats: { title: string; body: string }[];
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Mirrors the AboutTabs pattern (magenta active / teal inactive buttons)
// for the Residential / Roads & Infrastructure switcher on Our Work.
export function WorkTabs({ panels }: { panels: WorkPanel[] }) {
  const [active, setActive] = useState(panels[0]?.key);
  const panel = panels.find((p) => p.key === active) ?? panels[0];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3">
        {panels.map((p) => {
          const isActive = p.key === active;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(p.key)}
              aria-pressed={isActive}
              className={`rounded-md px-6 py-3 text-sm font-semibold transition-colors ${
                isActive ? "bg-primary text-white" : "bg-secondary text-white hover:bg-secondary/90"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {panel && (
        <div className="mt-10 rounded-lg bg-tint-cyan-2/50 p-5 md:p-8">
          <div className="overflow-hidden rounded-lg">
            <Image
              src={panel.image.src}
              alt={panel.image.alt}
              width={1100}
              height={650}
              className="h-auto w-full max-w-2xl mx-auto object-cover"
            />
          </div>
          <h2 className="mt-8 text-2xl font-extrabold text-secondary md:text-3xl">{panel.heading}</h2>
          <p className="mt-4 leading-relaxed text-grey">{panel.intro}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {panel.stats.map((s) => (
              <div key={s.title} className="rounded-lg border border-grey-line bg-white p-5">
                <div className="flex items-center gap-2 text-secondary">
                  <CheckIcon />
                  <h3 className="text-base font-semibold text-secondary">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-grey">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
