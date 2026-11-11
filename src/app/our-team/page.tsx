import type { Metadata } from "next";
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
import { pageMetadata, breadcrumbLd } from "@/lib/seo";

const content = getPageContent("our-team");
const h1 = resolvePageH1(content);
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

export const metadata: Metadata = pageMetadata(content, "/our-team/", cards[0]?.image?.src);

export default function OurTeamPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Our Team" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
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
        <div className="container-content mt-10 text-left">
          <TeamGrid members={members} />
        </div>
      </section>
    </>
  );
}
