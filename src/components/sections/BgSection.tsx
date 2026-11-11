import type { ReactNode } from "react";

// Full-bleed photo background + overlay, the pattern the original uses for
// its banner sections. Most (Quality Works, Let's Build Stronger Together,
// the mid-page CTA bands) are a dark overlay + white text — callers add
// `text-white` via className for those. The Contact Details sections have
// no overlay at all in the original (verified against the captured CSS:
// `--background-overlay:''`) and dark text directly on the photo, so they
// pass overlayOpacity={0} and set their own text colours.
export function BgSection({
  image,
  overlayOpacity,
  overlayColor = "#000000",
  className = "",
  children,
}: {
  image: string;
  overlayOpacity: number;
  overlayColor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden bg-cover bg-center ${className}`} style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity: overlayOpacity }} aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}
