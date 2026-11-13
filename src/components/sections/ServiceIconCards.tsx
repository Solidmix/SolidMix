"use client";

import { useId, useState } from "react";
import {
  DropletIcon,
  TruckIcon,
  MixerIcon,
  BuildingIcon,
  RoadIcon,
  ShieldIcon,
} from "@/components/icons";

// Picks a representative icon from the service title; titles may or may not
// already carry an emoji prefix in the source content (kept as-is, never
// stripped — this only adds a dedicated inline-SVG icon alongside it).
function iconFor(title: string) {
  const t = title.toLowerCase();
  if (t.includes("waterproof")) return DropletIcon;
  if (t.includes("material")) return TruckIcon;
  if (t.includes("mixing")) return MixerIcon;
  if (t.includes("placement")) return BuildingIcon;
  if (t.includes("site")) return RoadIcon;
  return ShieldIcon; // quality / supervision / fallback
}

// Elementor flip-box, direction-down + effect-flip (css/widget-flip-box.min.css.css;
// css/post-13.css.css element 8a5ff6c / css/post-17.css.css element 4d1c840 —
// identical values on both pages): 280px tall, 1000px perspective, 0.6s
// ease-in-out rotateX flip; front bg secondary + icon(75px) + title(24px/600)
// only; back bg primary + description(18px/400) only. Desktop flips on
// hover/focus, touch flips on tap (click/Enter toggles a "flipped" class
// alongside the CSS :hover/:focus-visible triggers). prefers-reduced-motion
// swaps the 3D rotate for a simple opacity fade (see .flip-card rules in
// globals.css).
export function ServiceIconCards({ items }: { items: { title: string; body?: string }[] }) {
  const uid = useId();
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const Icon = iconFor(item.title);
        const isFlipped = flipped.has(i);
        const panelId = `${uid}-back-${i}`;
        return (
          <div
            key={item.title}
            className={`flip-card ${isFlipped ? "is-flipped" : ""}`}
            tabIndex={0}
            role="button"
            aria-expanded={isFlipped}
            aria-controls={panelId}
            aria-label={item.title}
            onClick={() => toggle(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(i);
              }
            }}
          >
            <div className="flip-card-layer flip-card-front flex flex-col items-center justify-center gap-4 bg-secondary px-6 text-center text-white">
              <Icon className="h-[75px] w-[75px] text-white" />
              <h3 className="text-[24px] font-semibold text-white">{item.title}</h3>
            </div>
            <div
              id={panelId}
              className="flip-card-layer flip-card-back flex flex-col items-center justify-center bg-primary px-6 text-center text-white"
            >
              {item.body && <p className="text-[18px]">{item.body}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
