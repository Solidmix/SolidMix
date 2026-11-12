"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BagIcon,
  ClockIcon,
  UsersIcon,
  DollarIcon,
  ShieldIcon,
  TruckIcon,
  GaugeIcon,
} from "@/components/icons";

export type WorkPanel = {
  key: string;
  label: string;
  image: { src: string; alt: string };
  heading: string;
  intro: string;
  stats: { title: string; body: string }[];
};

// Maps a stat title to a representative icon; falls back to a generic badge.
const STAT_ICONS: Record<string, typeof BagIcon> = {
  "Instant Business Growth": BagIcon,
  "24/7 Quality Service": ClockIcon,
  "Easy Customer Service": UsersIcon,
  "Cost Effective Mixes": DollarIcon,
  "High Durability": ShieldIcon,
  "Smooth Supply Chain": TruckIcon,
  "Experienced Workforce": UsersIcon,
  "Long-Term Reliability": GaugeIcon,
};

// Mirrors the AboutTabs pattern (magenta active / teal inactive buttons)
// for the Residential / Roads & Infrastructure switcher on Our Work.
export function WorkTabs({ panels }: { panels: WorkPanel[] }) {
  const [active, setActive] = useState(panels[0]?.key);
  const panel = panels.find((p) => p.key === active) ?? panels[0];

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {panels.map((p) => {
          const isActive = p.key === active;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(p.key)}
              aria-pressed={isActive}
              className={`rounded-md px-8 py-4 text-base font-normal transition-colors ${
                isActive ? "bg-primary text-white" : "bg-secondary text-white hover:bg-secondary/90"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {panel && (
        <div className="mt-8 rounded-lg bg-tint-cyan-2/50 p-5 md:p-8">
          <div className="overflow-hidden rounded-lg">
            <Image
              src={panel.image.src}
              alt={panel.image.alt}
              width={1100}
              height={650}
              className="h-auto w-full max-w-2xl mx-auto object-cover"
            />
          </div>
          <h2 className="mt-8 text-[28px] font-semibold text-secondary">{panel.heading}</h2>
          <p className="mt-4 leading-relaxed text-grey">{panel.intro}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {panel.stats.map((s) => {
              const Icon = STAT_ICONS[s.title] ?? ShieldIcon;
              return (
                <div key={s.title} className="rounded-lg border border-grey-line bg-white p-6">
                  <div className="flex items-center gap-3 text-secondary">
                    <Icon className="h-9 w-9 flex-shrink-0" />
                    <h3 className="text-[18px] font-semibold text-secondary sm:text-[28px]">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-[20px] leading-relaxed text-grey">{s.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
