import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  type HeadingBlock,
  type ParaBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { InlineText } from "@/components/InlineText";
import { TeamGrid, type TeamMember } from "@/components/sections/TeamGrid";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, resolveDisplayH1 } from "@/lib/seo";

const content = getPageContent("our-team");
const h1 = resolvePageH1(content);
const displayH1 = resolveDisplayH1("/our-team/", h1);
const blocks = stripChrome(content.blocks, h1);

const cardsStart = blocks.findIndex((b) => b.type === "image");
const before = blocks.slice(0, cardsStart);
// Both "Meet Our Expert Team" (teal eyebrow) and "Solidmix Concrete Team"
// (the real H2, measured at 40px) have page-specific styling that differs
// from BlockRenderer's generic h3/h2 defaults, so rendered directly here.
const eyebrow = before.find((b): b is HeadingBlock => b.type === "heading" && b.level === 3);
const teamHeading = before.find((b): b is HeadingBlock => b.type === "heading" && b.level === 2);
const introPara = before.find((b): b is ParaBlock => b.type === "p");
const cards = extractCards(blocks.slice(cardsStart));
const members: TeamMember[] = cards.map((c) => ({
  image: { src: c.image?.src ?? "", alt: c.image?.alt || c.title },
  name: c.title,
  role: c.body ?? "",
  href: c.titleHref,
}));

// our-team.json already lists the 2 Founder & Director entries first,
// followed by the 5 team roles in the required order, so splitting by
// array position needs no `group` field and no JSON reordering.
const directors = members.slice(0, 2);
const team = members.slice(2);

export const metadata: Metadata = pageMetadata(content, "/our-team/", cards[0]?.image?.src);

export default function OurTeamPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Our Team" }])]} />
      <PageHero title={displayH1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
      <section className="py-12 md:py-16 text-center">
        <div className="container-content max-w-3xl">
          {eyebrow && <p className="font-semibold text-secondary">{eyebrow.text}</p>}
          {teamHeading && (
            <h2 className="mt-2 text-[28px] font-semibold text-primary md:text-[40px]">{teamHeading.text}</h2>
          )}
          {introPara && (
            <p className="mt-4 leading-relaxed text-grey">
              <InlineText text={introPara.text} />
            </p>
          )}
        </div>
        <div className="container-content mt-10">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">Our Directors</h2>
          {/* Same card width formula as TeamGrid's sm:grid-cols-2/lg:grid-cols-3
              (gap-x-8 = 2rem), but wrapped in a centered flex row since a
              3-column grid with only 2 items would sit left instead of centering. */}
          <div className="mt-8 flex flex-col items-center gap-x-8 gap-y-10 text-left sm:flex-row sm:flex-wrap sm:justify-center">
            {directors.map((m) => (
              <div key={m.name} className="w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
                <div className="hover-bob relative mx-auto aspect-[4/5] w-[89%] max-w-full overflow-hidden rounded-md bg-grey-line sm:mx-0 sm:w-full">
                  <Image
                    src={m.image.src}
                    alt={m.image.alt || m.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 89vw"
                    className="object-cover object-top"
                  />
                </div>
                <h3 className="mt-4 text-[32px] font-semibold text-primary">
                  {m.href ? (
                    <Link href={m.href} className="hover:underline">
                      {m.name}
                    </Link>
                  ) : (
                    m.name
                  )}
                </h3>
                <p className="mt-1 text-[20px] font-normal text-secondary">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="container-content mt-16">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">Our Team</h2>
          <div className="mt-8 text-left">
            <TeamGrid members={team} />
          </div>
        </div>
      </section>
    </>
  );
}
