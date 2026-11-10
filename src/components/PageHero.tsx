import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export type Crumb = { label: string; href?: string };

// The dark inner-page banner seen on every original page: magenta H1,
// "Home / ..." breadcrumb, mixer truck sliding in from the right. On mobile
// the truck moves below the title at a smaller size (default DOM order).
export function PageHero({ title, crumbs }: { title: string; crumbs: Crumb[] }) {
  return (
    <section
      className="overflow-x-clip bg-[#2a2a2a] bg-cover bg-center"
      style={{ backgroundImage: "linear-gradient(0deg, rgba(20,20,20,0.55), rgba(20,20,20,0.55)), url(/images/page-hero-bg.webp)" }}
    >
      <div className="container-content grid items-center gap-6 py-14 md:py-20 lg:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-4xl font-extrabold text-primary md:text-5xl lg:text-6xl">{title}</h1>
          <nav aria-label="Breadcrumb" className="mt-4 text-base font-semibold text-white md:text-lg">
            {crumbs.map((c, i) => (
              <span key={i}>
                {i > 0 && <span className="mx-2 text-white/60">/</span>}
                {c.href ? (
                  <Link href={c.href} className="hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
        <Reveal variant="slide-right" className="flex justify-center lg:justify-end">
          <Image
            src="/images/mixer-truck.webp"
            alt="SolidMix RMC transit mixer truck"
            width={420}
            height={250}
            className="h-auto w-48 md:w-64 lg:w-96"
          />
        </Reveal>
      </div>
    </section>
  );
}
