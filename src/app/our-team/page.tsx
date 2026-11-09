import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1, extractCards } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CardGrid } from "@/components/CardGrid";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";

const content = getPageContent("our-team");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const cardsStart = blocks.findIndex((b) => b.type === "image");
const before = blocks.slice(0, cardsStart);
const cards = extractCards(blocks.slice(cardsStart));

export const metadata: Metadata = pageMetadata(content, "/our-team/", cards[0]?.image?.src);

export default function OurTeamPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Our Team" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Team" }]} />
      <section className="py-12 md:py-16 text-center">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={before} />
        </div>
        <div className="container-content mt-10 text-left">
          <CardGrid cards={cards} columns={3} imageAspect="portrait" />
        </div>
      </section>
    </>
  );
}
