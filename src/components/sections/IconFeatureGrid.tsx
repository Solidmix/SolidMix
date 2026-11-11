import type { ReactNode } from "react";

export type FeatureItem = { icon: ReactNode; title: string; body?: string };

// Small icon top-left of each card (not stretched full-width like a photo),
// bold primary title, body text; 3 columns desktop. One card's body
// ("SolidMix operates a fully owned fleet...") measures teal on the
// original, unlike the rest — a one-off override, not a new shared default.
export function IconFeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-grey-line bg-white p-6">
          <div className="flex h-10 w-10 items-center justify-center">{item.icon}</div>
          <h3 className="mt-4 text-[22px] font-semibold text-primary">{item.title}</h3>
          {item.body && (
            <p
              className={`mt-2 text-sm leading-relaxed ${
                item.body.startsWith("SolidMix operates a fully owned fleet") ? "text-secondary" : "text-grey"
              }`}
            >
              {item.body}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
