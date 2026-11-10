import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1, extractCards, getFaqItems } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CardGrid } from "@/components/CardGrid";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";

const content = getPageContent("rmc-services-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const cardsStart = blocks.findIndex((b) => b.type === "image");
let cardsEnd = blocks.findIndex(
  (b) => b.type === "heading" && b.text.startsWith("Frequently Asked Questions"),
);
if (blocks[cardsEnd - 1]?.type === "image") cardsEnd -= 1;
const before = blocks.slice(0, cardsStart);
const cards = extractCards(blocks.slice(cardsStart, cardsEnd));
const after = blocks.slice(cardsEnd);
const faqs = getFaqItems(after);

export const metadata: Metadata = pageMetadata(content, "/rmc-services-in-raipur/", cards[0]?.image?.src);

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: "/" }, { name: "Our Services" }]),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Services" }]} />
      <section className="py-12 md:py-16 text-center">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={before} />
        </div>
        <div className="container-content mt-10 text-left">
          <CardGrid cards={cards} columns={3} imageAspect="square" />
        </div>
        <div className="container-content mt-10 max-w-3xl text-left">
          <BlockRenderer blocks={after} />
        </div>
      </section>
    </>
  );
}
