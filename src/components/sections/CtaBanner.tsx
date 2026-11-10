import type { ReactNode } from "react";
import Link from "next/link";

// Full-width grey band with a white heading/body and one or more buttons —
// the "Trusted Concrete Solutions...", "Build with Strength..." and
// "Ready to Order..." bands on the original.
export function CtaBanner({
  heading,
  children,
  ctas,
}: {
  heading: string;
  children?: ReactNode;
  ctas?: { label: string; href: string }[];
}) {
  return (
    <section className="bg-[#5f5f5f] py-16 text-center text-white">
      <div className="container-content max-w-2xl">
        <h2 className="text-[28px] font-semibold md:text-[40px]">{heading}</h2>
        {children && <div className="mt-4 leading-relaxed text-white/90">{children}</div>}
        {ctas && ctas.length > 0 && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta) => (
              <Link
                key={cta.href + cta.label}
                href={cta.href}
                className="inline-block rounded-md bg-primary px-8 py-3.5 text-xl font-medium text-white transition-colors hover:bg-primary/90"
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
