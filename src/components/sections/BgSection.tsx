import type { ReactNode } from "react";

// Full-bleed photo background + dark overlay + white text, the pattern the
// original uses for its "dark banner" sections (Quality Works, Let's Build
// Stronger Together, the various mid-page CTA bands). Layout/spacing of the
// content itself is controlled entirely by the caller via className/children.
export function BgSection({
  image,
  overlayOpacity,
  className = "",
  children,
}: {
  image: string;
  overlayOpacity: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden bg-cover bg-center text-white ${className}`} style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}
