import type { ReactNode } from "react";
import Link from "next/link";

type CtaLink = { label: string; href: string; variant?: "primary" | "white" };

// Full-width band with a white heading/body and one or more buttons — the
// "Trusted Concrete Solutions...", "Build with Strength..." and
// "Ready to Order..." bands on the original. Each one uses its own photo
// background on the original, so the background image/overlay is per call
// site (bgImage/bgOpacity), not baked into the component.
export function CtaBanner({
  heading,
  children,
  ctas,
  bgImage,
  bgOpacity = 0.7,
}: {
  heading: string;
  children?: ReactNode;
  ctas?: CtaLink[];
  bgImage?: string;
  bgOpacity?: number;
}) {
  return (
    <section
      className="relative overflow-hidden bg-[#5f5f5f] bg-cover bg-center py-20 text-center text-white md:py-28"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-black" style={{ opacity: bgOpacity }} aria-hidden="true" />
      )}
      <div className="container-content relative max-w-2xl">
        <h2 className="text-[28px] font-semibold md:text-[40px]">{heading}</h2>
        {children && (
          <div className="mt-4 text-center text-[16px] leading-relaxed text-white/90 md:text-[20px]">
            {children}
          </div>
        )}
        {ctas && ctas.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <Link
                key={cta.href + cta.label}
                href={cta.href}
                className={`inline-block rounded-md px-8 py-3.5 text-xl transition-colors ${
                  cta.variant === "white"
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-white hover:bg-primary/90"
                } ${cta.label === "Contact Us" ? "font-semibold" : "font-medium"}`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
