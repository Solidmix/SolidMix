import type { Metadata } from "next";
import Image from "next/image";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  getFaqItems,
  type ImageBlock,
  type HeadingBlock,
  type ParaBlock,
  type LinkBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";
import { IconFeatureGrid } from "@/components/sections/IconFeatureGrid";
import { MediaSplit } from "@/components/sections/MediaSplit";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { InlineText } from "@/components/InlineText";
import { Tilt } from "@/components/Tilt";

const content = getPageContent("rmc-services-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const cardsStart = blocks.findIndex((b) => b.type === "image");
const faqImageIndex = blocks.findIndex(
  (b) => b.type === "heading" && b.text.startsWith("Frequently Asked Questions"),
);
const cardsEnd = blocks[faqImageIndex - 1]?.type === "image" ? faqImageIndex - 1 : faqImageIndex;

const before = blocks.slice(0, cardsStart);
const cards = extractCards(blocks.slice(cardsStart, cardsEnd));

const faqImage = blocks[faqImageIndex - 1]?.type === "image" ? (blocks[faqImageIndex - 1] as ImageBlock) : undefined;
const faqHeading = blocks[faqImageIndex] as HeadingBlock;
const faqSubtitleIndex = faqImageIndex + 1;
const faqSubtitle = blocks[faqSubtitleIndex]?.type === "heading" ? (blocks[faqSubtitleIndex] as HeadingBlock) : undefined;

const ctaStart = blocks.findIndex(
  (b) => b.type === "heading" && b.text.startsWith("Ready to Order"),
);
const faqBlocks = blocks.slice(faqSubtitleIndex + 1, ctaStart);
const faqs = getFaqItems(faqBlocks);

const ctaHeading = blocks[ctaStart] as HeadingBlock;
const ctaBody = blocks
  .slice(ctaStart + 1)
  .filter((b): b is ParaBlock => b.type === "p");
const ctaLinks = blocks
  .slice(ctaStart + 1)
  .filter((b): b is LinkBlock => b.type === "link");

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
          <IconFeatureGrid
            items={cards.map((c) => ({
              icon: c.image ? (
                <Image
                  src={c.image.src}
                  alt={c.image.alt || c.title}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              ) : null,
              title: c.title,
              body: c.body,
            }))}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container-content">
          <MediaSplit
            media={
              faqImage && (
                <Tilt className="mx-auto w-full max-w-sm">
                  <Image
                    src={faqImage.src}
                    alt={faqImage.alt || "Frequently asked questions"}
                    width={622}
                    height={622}
                    className="h-auto w-full rounded-lg object-contain shadow-lg"
                  />
                </Tilt>
              )
            }
          >
            <h2 className="text-[28px] font-semibold text-secondary md:text-[40px]">{faqHeading.text}</h2>
            {faqSubtitle && <p className="mt-3 leading-relaxed text-grey">{faqSubtitle.text}</p>}
            <div className="mt-6">
              <FaqAccordion items={faqs} questionColor="secondary" />
            </div>
          </MediaSplit>
        </div>
      </section>

      {/* CTA */}
      <CtaBanner
        heading={ctaHeading.text}
        ctas={ctaLinks.map((l) => ({ label: l.text, href: l.href }))}
        bgImage="/images/bg/quality-works.webp"
        bgOpacity={0.8}
      >
        {ctaBody.map((p, i) => (
          <p key={i} className={i > 0 ? "mt-3" : ""}>
            <InlineText text={p.text} />
          </p>
        ))}
      </CtaBanner>
    </>
  );
}
