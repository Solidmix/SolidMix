import type { Metadata } from "next";
import Link from "next/link";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  getFaqItems,
  type HeadingBlock,
  type ParaBlock,
  type LinkBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CardGrid } from "@/components/CardGrid";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";
import { PRODUCTS_BASE } from "@/content/site";
import { BgSection } from "@/components/sections/BgSection";
import { FlameIcon, TruckIcon, DropletIcon } from "@/components/icons";

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

// "Why SolidMix Ready Mix Concrete Stands Apart" — a WHITE section (confirmed
// against the original screenshot, not the dark banner round 6 guessed from
// CSS): eyebrow, teal H2, centred intro, then 3 purple feature cards.
const whyEyebrowIdx = blocks.findIndex(
  (b) => b.type === "heading" && b.text === "Why SolidMix Ready Mix Concrete Stands Apart",
);
const whyEyebrow = blocks[whyEyebrowIdx] as HeadingBlock;
const whyHeading = blocks[whyEyebrowIdx + 1] as HeadingBlock;
const whyIntro = blocks[whyEyebrowIdx + 2] as ParaBlock;
const faqStart = blocks.findIndex((b) => b.type === "heading" && b.text === "Frequently asked question");
const FEATURE_ICONS = [FlameIcon, TruckIcon, DropletIcon];
const whyFeatures = extractCards(blocks.slice(whyEyebrowIdx + 3, faqStart)).filter((c) => c.image === undefined);
const faqHeading = blocks[faqStart] as HeadingBlock;
const faqIntro = blocks[faqStart + 1] as ParaBlock | undefined;
const faqRest = blocks.slice(faqStart + 2);
const faqItems = getFaqItems(faqRest);

export const metadata: Metadata = pageMetadata(content, `${PRODUCTS_BASE}/`, cards[0]?.image?.src);

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: "/" }, { name: "Products" }]),
          ...(faqItems.length ? [faqPageLd(faqItems)] : []),
        ]}
      />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl text-center">
          <BlockRenderer blocks={before} />
        </div>
        <div className="container-content mt-10">
          <CardGrid cards={cards} columns={3} imageAspect="square" priorityCount={3} />
        </div>
      </section>

      <BgSection image="/images/bg/build-together.webp" overlayOpacity={0.88} className="py-16 text-center text-white">
        <div className="container-content max-w-2xl">
          <h2 className="text-[28px] font-semibold md:text-[40px]">{ctaHeading1.text}</h2>
          <p className="mt-4 leading-relaxed text-white/90">{ctaHeading2.text}</p>
          {ctaLinks.length > 0 && (
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              {ctaLinks.map((cta) => (
                <Link
                  key={cta.href + cta.text}
                  href={cta.href}
                  className="inline-block rounded-lg bg-secondary px-8 py-3.5 text-xl font-medium text-white transition-colors hover:bg-secondary/90"
                >
                  {cta.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </BgSection>

      {/* White section, confirmed against the original screenshot: pink
          eyebrow, teal H2, centred intro, 3 purple feature cards. */}
      <section className="py-12 text-center md:py-16">
        <div className="container-content max-w-3xl">
          <p className="text-[28px] font-semibold text-primary">{whyEyebrow.text}</p>
          <h2 className="mt-2 text-[32px] font-semibold text-secondary md:text-[56px]">{whyHeading.text}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[20px] leading-relaxed text-[#292929]">{whyIntro.text}</p>
        </div>
        <div className="container-content mt-10 grid grid-cols-1 gap-5 text-left lg:grid-cols-3">
          {whyFeatures.map((f, i) => {
            const Icon = FEATURE_ICONS[i] ?? FlameIcon;
            return (
              <div key={f.title} className="rounded-lg bg-primary p-7 text-white">
                <Icon className="h-9 w-9 text-white" />
                <h3 className="mt-4 text-[22px] font-semibold text-white">{f.title}</h3>
                {f.body && <p className="mt-2 leading-relaxed text-white/90">{f.body}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Dark FAQ section with teal filled accordion boxes — confirmed
          against the original screenshot, not a plain white section. */}
      <section className="bg-[#1e1e1e] py-12 md:py-16">
        <div className="container-content max-w-3xl text-center">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{faqHeading.text}</h2>
          {faqIntro && <p className="mt-4 leading-relaxed text-white/80">{faqIntro.text}</p>}
        </div>
        <div className="container-content mt-8 max-w-3xl">
          <FaqAccordion items={faqItems} variant="filled" />
        </div>
      </section>
    </>
  );
}
