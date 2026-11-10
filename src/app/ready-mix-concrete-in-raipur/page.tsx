import type { Metadata } from "next";
import Link from "next/link";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  type HeadingBlock,
  type ParaBlock,
  type LinkBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CardGrid } from "@/components/CardGrid";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { PRODUCTS_BASE } from "@/content/site";
import { BgSection } from "@/components/sections/BgSection";

const content = getPageContent("ready-mix-concrete-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const cardsStart = blocks.findIndex((b) => b.type === "image");
let cardsEnd = blocks.findIndex(
  (b) => b.type === "heading" && b.text.startsWith("Get the Right Concrete"),
);
// Guard against a trailing orphan image (e.g. an FAQ icon) with no heading
// after it — extractCards would otherwise misread the next heading as a title.
if (blocks[cardsEnd - 1]?.type === "image") cardsEnd -= 1;
const before = blocks.slice(0, cardsStart);
const cards = extractCards(blocks.slice(cardsStart, cardsEnd));

const ctaHeading1 = blocks[cardsEnd] as HeadingBlock;
const ctaHeading2 = blocks[cardsEnd + 1] as HeadingBlock;
const ctaLinks = blocks.slice(cardsEnd + 2, cardsEnd + 4).filter((b): b is LinkBlock => b.type === "link");

const whyStart = blocks.findIndex(
  (b) => b.type === "heading" && b.text === "Why SolidMix Ready Mix Concrete Stands Apart",
);
const faqStart = blocks.findIndex((b) => b.type === "heading" && b.text === "Frequently asked question");
const whyBlocks = blocks.slice(whyStart, faqStart);
const faqHeading = blocks[faqStart] as HeadingBlock;
const faqIntro = blocks[faqStart + 1] as ParaBlock | undefined;
const faqRest = blocks.slice(faqStart + 2);

export const metadata: Metadata = pageMetadata(content, `${PRODUCTS_BASE}/`, cards[0]?.image?.src);

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Products" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl text-center">
          <BlockRenderer blocks={before} />
        </div>
        <div className="container-content mt-10">
          <CardGrid cards={cards} columns={3} imageAspect="square" />
        </div>
      </section>

      <BgSection image="/images/bg/build-together.webp" overlayOpacity={0.88} className="py-16 text-center">
        <div className="container-content max-w-2xl">
          <h2 className="text-[28px] font-semibold md:text-[40px]">{ctaHeading1.text}</h2>
          <p className="mt-4 leading-relaxed text-white/90">{ctaHeading2.text}</p>
          {ctaLinks.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              {ctaLinks.map((cta, i) => (
                <Link
                  key={cta.href + cta.text}
                  href={cta.href}
                  className={
                    i === 0
                      ? "inline-block rounded-md bg-primary px-8 py-3.5 text-xl font-medium text-white transition-colors hover:bg-primary/90"
                      : "inline-block rounded-md bg-secondary px-8 py-3.5 text-xl font-medium text-white transition-colors hover:bg-secondary/90"
                  }
                >
                  {cta.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </BgSection>

      <section className="py-12 md:py-16 text-center">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={whyBlocks} />
        </div>
      </section>

      <section className="pb-12 md:pb-16">
        <div className="container-content max-w-3xl text-center">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{faqHeading.text}</h2>
          {faqIntro && <p className="mt-4 leading-relaxed text-grey">{faqIntro.text}</p>}
        </div>
        <div className="container-content mt-8 max-w-3xl">
          <BlockRenderer blocks={faqRest} />
        </div>
      </section>
    </>
  );
}
