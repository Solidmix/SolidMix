import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  getFaqItems,
  parseMdLink,
  type ImageBlock,
  type HeadingBlock,
  type ParaBlock,
  type ListBlock,
  type LinkBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { InlineText } from "@/components/InlineText";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";
import { TeamGrid, type TeamMember } from "@/components/sections/TeamGrid";
import { ServiceIconCards } from "@/components/sections/ServiceIconCards";
import { ProgressBars } from "@/components/sections/ProgressBars";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { whyChooseStats } from "@/content/stats";
import { UsersIcon } from "@/components/icons";

const content = getPageContent("trusted-concrete-supplier-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const collageImages = blocks.slice(0, 2) as ImageBlock[];
const introHeading = blocks[2] as HeadingBlock;
const introParas = blocks.slice(3, 6) as ParaBlock[];
const introList = blocks[6] as ListBlock;
const foundersHeading = blocks[7] as HeadingBlock;
// The original wraps both the icon and the name in a link to Contact Us
// (page.html: <a href=".../contact-us/" aria-label="Vinit Tiwari & Pratham
// Bafna">) — parsed here instead of InlineText so it gets the icon-box's own
// white/bold styling, not the sitewide #cc3366 link colour.
const foundersLink = parseMdLink(foundersHeading.text);
const foundersRole = blocks[8] as ParaBlock;
const foundersCta = blocks[9] as LinkBlock;

const strongSection = blocks.slice(10, 13);
// Rendered directly below (not via BlockRenderer): the heading ends with "?"
// which BlockRenderer's FAQ segmentation would otherwise turn into a
// single-item accordion instead of a plain heading + paragraph.
const whyChooseHeading = blocks[13] as HeadingBlock;
const whyChoosePara = blocks[14] as ParaBlock;

const teamIntroAll = blocks.slice(15, 20);
// "Meet the SolidMix Team" (teal eyebrow) and "Solidmix Concrete Team" (the
// real H2, measured at 40px) have page-specific styling that differs from
// BlockRenderer's generic h3/h2 defaults, so pulled out and rendered directly.
const teamEyebrow = teamIntroAll.find((b): b is HeadingBlock => b.type === "heading" && b.level === 3);
const teamH2 = teamIntroAll.find((b): b is HeadingBlock => b.type === "heading" && b.level === 2);
const teamIntro = teamIntroAll.filter((b) => b !== teamEyebrow && b !== teamH2);
const teamCards = extractCards(blocks.slice(20, 35));
const teamMembers: TeamMember[] = teamCards.map((c) => ({
  image: { src: c.image?.src ?? "", alt: c.image?.alt || c.title },
  name: c.title,
  role: c.body ?? "",
}));

const servicesHeading = blocks[35] as HeadingBlock;
const servicesIntro = blocks[36] as ParaBlock;
// Each of the 6 service headings is now followed by its restored back-face
// description (a "p" block) — the range grows from 6 to 12 blocks.
const serviceChips = extractCards(blocks.slice(37, 49));

const tailCta = blocks.slice(49, 52);
const faqSectionAll = blocks.slice(52, 65);
const faqs = getFaqItems(faqSectionAll);
// "Frequently Asked Questions" is centered and 40px on the original, unlike
// BlockRenderer's generic (left, 28px) heading default — pulled out so it
// can get that treatment.
const faqHeading = faqSectionAll.find((b): b is HeadingBlock => b.type === "heading");
const faqSection = faqHeading ? faqSectionAll.filter((b) => b !== faqHeading) : faqSectionAll;

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

      {/* Intro: image collage + teal text column (one joined card, 33/66 split) */}
      <section className="py-14">
        <div className="container-content grid items-stretch gap-0 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-[20px] bg-primary p-[20px]">
            {collageImages.map((img, i) => (
              <Image
                key={i}
                src={img.src}
                alt={img.alt || h1}
                width={img.src.includes("untitled-design-20") ? 448 : 1000}
                height={img.src.includes("untitled-design-20") ? 550 : 572}
                priority={img.src.includes("untitled-design-20")}
                className="h-auto w-full"
              />
            ))}
          </div>
          <div className="bg-secondary p-[20px] text-white md:p-[50px]">
            <h2 className="text-center text-[28px] font-semibold md:text-[40px]">
              <InlineText text={introHeading.text} />
            </h2>
            {introParas.map((p, i) => (
              <p key={i} className="mt-4 text-justify leading-relaxed text-white/90">
                <InlineText text={p.text} />
              </p>
            ))}
            <ul className="mt-6 grid grid-cols-1 gap-x-[50px] gap-y-2 sm:grid-cols-2">
              {introList.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[16px] font-normal text-white">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center justify-start gap-4">
              <div className="flex items-start gap-[15px]">
                <Link href={foundersLink.href ?? "#"} aria-hidden="true" tabIndex={-1} className="shrink-0 text-white">
                  <UsersIcon className="h-9 w-9" />
                </Link>
                <div>
                  <Link
                    href={foundersLink.href ?? "#"}
                    aria-label={foundersLink.label}
                    className="text-[30px] font-semibold text-white"
                  >
                    {foundersLink.label}
                  </Link>
                  <p className="mt-1 text-[16px] text-white">{foundersRole.text}</p>
                </div>
              </div>
              <Link
                href={foundersCta.href}
                className="rounded-lg bg-white px-[20px] py-[20px] text-[18px] font-medium text-secondary transition-colors hover:bg-white/90 md:px-[50px] md:py-[30px] md:text-[20px]"
              >
                {foundersCta.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Strong Concrete. Strong Foundations. Stronger Trust. */}
      <BlocksCta blocks={strongSection} bgImage="/images/bg/strong-concrete.webp" bgOpacity={0.61} />

      {/* Why Choose SolidMix RMC? */}
      <section className="py-14">
        <div className="container-content max-w-3xl text-center">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">
            <InlineText text={whyChooseHeading.text} />
          </h2>
          <p className="mt-4 leading-relaxed text-grey">
            <InlineText text={whyChoosePara.text} />
          </p>
        </div>
        <div className="container-content mt-10 max-w-3xl">
          <ProgressBars items={whyChooseStats} />
        </div>
      </section>

      {/* Team */}
      <section className="bg-tint-cyan-2/40 pb-14 pt-20">
        <div className="container-content max-w-3xl text-center">
          {teamEyebrow && <p className="font-semibold text-secondary">{teamEyebrow.text}</p>}
          {teamH2 && (
            <h2 className="mt-2 text-[28px] font-semibold text-primary md:text-[40px]">{teamH2.text}</h2>
          )}
          <BlockRenderer blocks={teamIntro} />
        </div>
        <div className="container-content mt-10">
          <TeamGrid members={teamMembers} />
        </div>
      </section>

      {/* Services */}
      <section className="py-14 text-center">
        <div className="container-content max-w-3xl">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{servicesHeading.text}</h2>
          <p className="mt-4 leading-relaxed text-grey">
            <InlineText text={servicesIntro.text} />
          </p>
        </div>
        <div className="container-content mt-8 text-left">
          <ServiceIconCards items={serviceChips.map((c) => ({ title: c.title, body: c.body }))} />
        </div>
      </section>

      {/* Tail CTA — "Contact Us" is a white button on the original, not primary. */}
      <BlocksCta blocks={tailCta} bgImage="/images/bg/cta-blog.webp" bgOpacity={0.73} ctaVariant="white" />

      {/* FAQ */}
      <section className="py-14">
        <div className="container-content max-w-3xl">
          {faqHeading && (
            <h2 className="mb-6 text-center text-[28px] font-semibold text-primary md:text-[40px]">
              {faqHeading.text}
            </h2>
          )}
          <BlockRenderer blocks={faqSection} faqQuestionColor="primary" />
        </div>
      </section>
    </>
  );
}

function BlocksCta({
  blocks,
  bgImage,
  bgOpacity,
  ctaVariant,
}: {
  blocks: ReturnType<typeof stripChrome>;
  bgImage?: string;
  bgOpacity?: number;
  ctaVariant?: "primary" | "white";
}) {
  const heading = blocks.find((b): b is HeadingBlock => b.type === "heading");
  const para = blocks.find((b): b is ParaBlock => b.type === "p");
  const link = blocks.find((b): b is LinkBlock => b.type === "link");
  if (!heading) return null;
  return (
    <CtaBanner
      heading={heading.text}
      ctas={link ? [{ label: link.text, href: link.href, variant: ctaVariant }] : undefined}
      bgImage={bgImage}
      bgOpacity={bgOpacity}
    >
      {para && <InlineText text={para.text} />}
    </CtaBanner>
  );
}
