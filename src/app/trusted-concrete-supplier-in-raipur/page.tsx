import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  getFaqItems,
  type ImageBlock,
  type HeadingBlock,
  type ParaBlock,
  type ListBlock,
  type LinkBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CardGrid } from "@/components/CardGrid";
import { InlineText } from "@/components/InlineText";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";

const content = getPageContent("trusted-concrete-supplier-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const collageImages = blocks.slice(0, 2) as ImageBlock[];
const introHeading = blocks[2] as HeadingBlock;
const introParas = blocks.slice(3, 6) as ParaBlock[];
const introList = blocks[6] as ListBlock;
const foundersHeading = blocks[7] as HeadingBlock;
const foundersRole = blocks[8] as ParaBlock;
const foundersCta = blocks[9] as LinkBlock;

const strongSection = blocks.slice(10, 13);
const whyChooseSection = blocks.slice(13, 15);

const teamIntro = blocks.slice(15, 20);
const teamCards = extractCards(blocks.slice(20, 35));

const servicesHeading = blocks[35] as HeadingBlock;
const servicesIntro = blocks[36] as ParaBlock;
const serviceChips = extractCards(blocks.slice(37, 43));

const tailCta = blocks.slice(43, 46);
const faqSection = blocks.slice(46, 59);
const faqs = getFaqItems(faqSection);

export const metadata: Metadata = pageMetadata(
  content,
  "/trusted-concrete-supplier-in-raipur/",
  collageImages[0]?.src,
);

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: "/" }, { name: "About Us" }]),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      {/* Intro: image collage + teal text column */}
      <section className="py-14">
        <div className="container-content grid gap-0 overflow-hidden rounded-lg lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-2 bg-tint-pink p-4">
            {collageImages.map((img, i) => (
              <Image
                key={i}
                src={img.src}
                alt={img.alt || h1}
                width={400}
                height={300}
                className={`h-auto w-full rounded-md object-cover ${i === 0 ? "col-span-2" : ""}`}
              />
            ))}
          </div>
          <div className="bg-secondary p-6 text-white md:p-10">
            <h2 className="text-2xl font-extrabold md:text-3xl">{introHeading.text}</h2>
            {introParas.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-white/90">
                <InlineText text={p.text} />
              </p>
            ))}
            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {introList.items.map((item) => (
                <li key={item} className="flex items-center gap-2 font-medium">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
              <div>
                <p className="font-bold">
                  <InlineText text={foundersHeading.text} />
                </p>
                <p className="text-sm text-white/80">{foundersRole.text}</p>
              </div>
              <Link
                href={foundersCta.href}
                className="rounded-md bg-white px-6 py-3 font-semibold text-secondary transition-colors hover:bg-white/90"
              >
                {foundersCta.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Strong Concrete. Strong Foundations. Stronger Trust. */}
      <DarkCta blocks={strongSection} />

      {/* Why Choose SolidMix RMC? */}
      <section className="py-14">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={whyChooseSection} />
        </div>
      </section>

      {/* Team */}
      <section className="bg-tint-cyan-2/40 py-14">
        <div className="container-content max-w-3xl text-center">
          <BlockRenderer blocks={teamIntro} />
        </div>
        <div className="container-content mt-10">
          <CardGrid cards={teamCards} columns={3} imageAspect="portrait" />
        </div>
      </section>

      {/* Services (icon chips) */}
      <section className="py-14 text-center">
        <div className="container-content max-w-3xl">
          <h2 className="text-2xl font-extrabold text-primary md:text-3xl">{servicesHeading.text}</h2>
          <p className="mt-4 leading-relaxed text-grey">{servicesIntro.text}</p>
        </div>
        <div className="container-content mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {serviceChips.map((chip) => (
            <div
              key={chip.title}
              className="hover-bob rounded-lg border border-grey-line bg-white px-3 py-5 text-sm font-semibold text-secondary"
            >
              {chip.title}
            </div>
          ))}
        </div>
      </section>

      {/* Tail CTA */}
      <DarkCta blocks={tailCta} />

      {/* FAQ */}
      <section className="py-14">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={faqSection} />
        </div>
      </section>
    </>
  );
}

function DarkCta({ blocks }: { blocks: ReturnType<typeof stripChrome> }) {
  const heading = blocks.find((b): b is HeadingBlock => b.type === "heading");
  const para = blocks.find((b): b is ParaBlock => b.type === "p");
  const link = blocks.find((b): b is LinkBlock => b.type === "link");
  if (!heading) return null;
  return (
    <section className="bg-dark py-16 text-center text-white">
      <div className="container-content max-w-2xl">
        <h2 className="text-2xl font-extrabold text-primary md:text-3xl">{heading.text}</h2>
        {para && (
          <p className="mt-4 leading-relaxed text-white/90">
            <InlineText text={para.text} />
          </p>
        )}
        {link && (
          <Link
            href={link.href}
            className="mt-7 inline-block rounded-md bg-primary px-8 py-3.5 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {link.text}
          </Link>
        )}
      </div>
    </section>
  );
}
