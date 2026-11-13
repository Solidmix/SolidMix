import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  extractCards,
  getFaqItems,
  stripBoldMarkers,
  parseMdLink,
  type ImageBlock,
  type HeadingBlock,
  type ParaBlock,
  type ListBlock,
  type LinkBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { InlineText } from "@/components/InlineText";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";
import { MediaSplit } from "@/components/sections/MediaSplit";
import { TeamGrid, type TeamMember } from "@/components/sections/TeamGrid";
import { ServiceIconCards } from "@/components/sections/ServiceIconCards";
import { ProgressBars } from "@/components/sections/ProgressBars";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { ConsultancyTabs, type ConsultancyItem } from "@/components/legal/ConsultancyTabs";
import { whyChooseStats } from "@/content/stats";
import { UsersIcon } from "@/components/icons";

const content = getPageContent("legal");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);
// "Why RMC?" ends with "?" but is a heading followed by a list, not a real
// FAQ answer — drop any zero-answer item so it never reaches FAQPage JSON-LD.
const faqs = getFaqItems(blocks).filter((f) => f.a.trim().length > 0);

// Compares against the bold-marker-stripped text: a heading like
// "Why [[b]]RMC[[/b]]?" (bold-enriched mid-phrase) must still match "Why RMC?".
function findHeading(text: string) {
  return blocks.find(
    (b): b is HeadingBlock => b.type === "heading" && stripBoldMarkers(b.text) === text,
  );
}
function indexOfHeading(text: string) {
  return blocks.findIndex((b) => b.type === "heading" && stripBoldMarkers(b.text) === text);
}
function nextOfType<T>(fromIndex: number, type: string): T | undefined {
  for (let i = fromIndex + 1; i < blocks.length; i++) {
    if (blocks[i].type === type) return blocks[i] as T;
  }
  return undefined;
}

// Why RMC?
const bannerImage = blocks.find((b): b is ImageBlock => b.type === "image");
const coreFeaturesHeading = findHeading("Core Features");
const whyRmcHeading = findHeading("Why RMC?");
const lists = blocks.filter((b): b is ListBlock => b.type === "list");
const whyRmcList = lists[0];
const aboutChecklist = lists[1];

// About Us
const aboutUsIdx = indexOfHeading("About Us");
const aboutImagesStart = blocks.findIndex((b) => b.type === "list") + 1;
const aboutImages = blocks
  .slice(aboutImagesStart, aboutUsIdx)
  .filter((b): b is ImageBlock => b.type === "image");
const aboutPara1 = nextOfType<ParaBlock>(aboutUsIdx, "p");
const aboutPara1Idx = blocks.indexOf(aboutPara1!);
const aboutPara2 = nextOfType<ParaBlock>(aboutPara1Idx, "p");
const foundersHeadingIdx = blocks.findIndex(
  (b) => b.type === "heading" && b.text.includes("Vinit Tiwari & Pratham Bafna"),
);
const foundersHeading = blocks[foundersHeadingIdx] as HeadingBlock;
// The original wraps both the icon and the name in a link to Contact Us
// (page.html: <a href=".../contact-us/" aria-label="Vinit Tiwari & Pratham
// Bafna">) — parsed here instead of InlineText so it gets the icon-box's own
// white/bold styling, not the sitewide #cc3366 link colour.
const foundersLink = parseMdLink(foundersHeading.text);
const foundersRole = nextOfType<ParaBlock>(foundersHeadingIdx, "p");
const foundersCta = blocks.find(
  (b): b is LinkBlock => b.type === "link" && b.text === "Get In Touch",
);
const elevateProfileCta = blocks.find(
  (b): b is LinkBlock => b.type === "link" && b.text === "Elevate Profile",
);

// CTA 1
const cta1HeadingIdx = indexOfHeading("Trusted Concrete Solutions, Timely Delivery, Strong Foundation!");
const cta1Heading = blocks[cta1HeadingIdx] as HeadingBlock;
const cta1Para = nextOfType<ParaBlock>(cta1HeadingIdx, "p");
const cta1Link = blocks.find((b): b is LinkBlock => b.type === "link" && b.text === "Explore More");

// Why Choose Us?
const whyChooseHeadingIdx = indexOfHeading("Why Choose Us?");
const whyChooseHeading = blocks[whyChooseHeadingIdx] as HeadingBlock;
const whyChoosePara = nextOfType<ParaBlock>(whyChooseHeadingIdx, "p");

// Team
const galleryHeading = findHeading("Meet Our Gallery");
const teamHeadingIdx = indexOfHeading("Solidmix Concrete Team");
const teamHeading = blocks[teamHeadingIdx] as HeadingBlock;
const teamIntroPara = nextOfType<ParaBlock>(teamHeadingIdx, "p");
const teamIntroParaIdx = blocks.indexOf(teamIntroPara!);
const servicesHeadingIdx = indexOfHeading("What Service We Provide");
const teamCards = extractCards(blocks.slice(teamIntroParaIdx + 1, servicesHeadingIdx));
const teamMembers: TeamMember[] = teamCards.map((c) => ({
  image: { src: c.image?.src ?? "", alt: c.image?.alt || c.title },
  name: c.title,
  role: c.body ?? "",
}));

// Services
const cta2HeadingIdx = indexOfHeading("Build with Strength, Trust & Speed!");
const servicesHeading = blocks[servicesHeadingIdx] as HeadingBlock;
const serviceItems = extractCards(blocks.slice(servicesHeadingIdx + 1, cta2HeadingIdx));

// CTA 2
const cta2Heading = blocks[cta2HeadingIdx] as HeadingBlock;
const cta2Para = nextOfType<ParaBlock>(cta2HeadingIdx, "p");
const cta2Link = blocks.find((b): b is LinkBlock => b.type === "link" && b.text === "Contact Us");

// Just a Consultancy
const consultEyebrowIdx = indexOfHeading("Just a Consultancy");
const consultImage =
  blocks[consultEyebrowIdx - 1]?.type === "image" ? (blocks[consultEyebrowIdx - 1] as ImageBlock) : undefined;
const consultHeading = nextOfType<HeadingBlock>(consultEyebrowIdx, "heading");
const consultItemHeadings = blocks
  .slice(consultEyebrowIdx + 1)
  .filter((b): b is HeadingBlock => b.type === "heading" && b !== consultHeading);
const consultItems: ConsultancyItem[] = consultItemHeadings.map((h) => {
  const idx = blocks.indexOf(h);
  const para = nextOfType<ParaBlock>(idx, "p");
  return { heading: h.text, body: para?.text ?? "" };
});

export const metadata: Metadata = pageMetadata(content, "/legal/");

export default function LegalPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: "/" }, { name: "Legal" }]),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Legal" }]} />

      {/* Why RMC? */}
      <section className="py-14">
        <div className="container-content">
          <MediaSplit
            media={
              bannerImage && (
                <Image
                  src={bannerImage.src}
                  alt={bannerImage.alt || "Why RMC"}
                  width={600}
                  height={700}
                  className="h-auto w-full rounded-lg object-cover"
                />
              )
            }
          >
            {coreFeaturesHeading && (
              <p className="text-[20px] font-semibold text-primary">{coreFeaturesHeading.text}</p>
            )}
            {whyRmcHeading && (
              <h2 className="mt-2 text-[28px] font-semibold text-ink md:text-[40px]">
                <InlineText text={whyRmcHeading.text} />
              </h2>
            )}
            {whyRmcList && (
              <ul className="mt-6 space-y-3">
                {whyRmcList.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-normal text-[#333333]">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="flex-shrink-0 text-primary"
                      aria-hidden="true"
                    >
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </MediaSplit>
        </div>
      </section>

      {/* About Us */}
      <section className="py-14">
        <div className="container-content">
          <MediaSplit
            gap="gap-0"
            align="stretch"
            gridCols="lg:grid-cols-[1fr_2fr]"
            media={
              <div className="flex h-full flex-col gap-[20px] bg-primary p-[20px]">
                {aboutImages.map((img, i) => {
                  const image = (
                    <Image
                      key={i}
                      src={img.src}
                      alt={img.alt || "SolidMix RMC"}
                      width={img.src.includes("untitled-design-20") ? 448 : 1000}
                      height={img.src.includes("untitled-design-20") ? 550 : 572}
                      className="h-auto w-full"
                    />
                  );
                  return img.href ? (
                    <Link key={i} href={img.href}>
                      {image}
                    </Link>
                  ) : (
                    image
                  );
                })}
                {elevateProfileCta && (
                  <Link
                    href={elevateProfileCta.href}
                    className="inline-block self-start rounded-lg bg-secondary px-[50px] py-[25px] text-[20px] font-medium text-white transition-colors hover:bg-secondary/90"
                  >
                    {elevateProfileCta.text}
                  </Link>
                )}
              </div>
            }
            contentClassName="bg-secondary p-[20px] text-white md:p-[50px]"
          >
            <h2 className="text-center text-[28px] font-semibold md:text-[40px]">About Us</h2>
            {aboutPara1 && (
              <p className="mt-4 text-[18px] leading-relaxed text-white/90 md:text-[24px]">
                <InlineText text={aboutPara1.text} />
              </p>
            )}
            {aboutPara2 && (
              <p className="mt-4 text-[18px] leading-relaxed text-white/90 md:text-[24px]">
                <InlineText text={aboutPara2.text} />
              </p>
            )}
            {aboutChecklist && (
              <ul className="mt-6 grid grid-cols-1 gap-x-[25px] gap-y-2 sm:grid-cols-2">
                {aboutChecklist.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[16px] font-normal text-white">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-start gap-4">
              <div className="flex items-start gap-[15px]">
                <Link href={foundersLink.href ?? "#"} aria-hidden="true" tabIndex={-1} className="shrink-0 text-white">
                  <UsersIcon className="h-9 w-9" />
                </Link>
                <div>
                  <Link
                    href={foundersLink.href ?? "#"}
                    aria-label={foundersLink.label}
                    className="text-[22px] font-semibold text-white md:text-[30px]"
                  >
                    {foundersLink.label}
                  </Link>
                  {foundersRole && <p className="mt-1 text-[16px] text-white">{foundersRole.text}</p>}
                </div>
              </div>
              {foundersCta && (
                <Link
                  href={foundersCta.href}
                  className="rounded-lg bg-white px-[20px] py-[20px] text-[18px] font-medium text-secondary transition-colors hover:bg-white/90 md:px-[50px] md:py-[30px] md:text-[20px]"
                >
                  {foundersCta.text}
                </Link>
              )}
            </div>
          </MediaSplit>
        </div>
      </section>

      {/* CTA 1 */}
      <CtaBanner
        heading={cta1Heading.text}
        ctas={cta1Link ? [{ label: cta1Link.text, href: cta1Link.href }] : undefined}
        bgImage="/images/bg/strong-concrete.webp"
        bgOpacity={0.61}
      >
        {cta1Para && <InlineText text={cta1Para.text} />}
      </CtaBanner>

      {/* Why Choose Us? */}
      <section className="py-14 text-center">
        <div className="container-content max-w-3xl">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{whyChooseHeading.text}</h2>
          {whyChoosePara && (
            <p className="mt-4 leading-relaxed text-grey">
              <InlineText text={whyChoosePara.text} />
            </p>
          )}
        </div>
        <div className="container-content mt-10 max-w-3xl text-left">
          <ProgressBars items={whyChooseStats} />
        </div>
      </section>

      {/* Team */}
      <section className="bg-tint-cyan-2/40 pb-14 pt-20 text-center">
        <div className="container-content max-w-3xl">
          {galleryHeading && (
            <p className="text-[20px] font-semibold text-secondary">{galleryHeading.text}</p>
          )}
          <h2 className="mt-2 text-[28px] font-semibold text-primary md:text-[40px]">{teamHeading.text}</h2>
          {teamIntroPara && (
            <p className="mt-4 text-[20px] leading-relaxed text-grey">{teamIntroPara.text}</p>
          )}
        </div>
        <div className="container-content mt-10 text-left">
          <TeamGrid members={teamMembers} />
        </div>
      </section>

      {/* Services */}
      <section className="py-14 text-center">
        <div className="container-content max-w-3xl">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">{servicesHeading.text}</h2>
        </div>
        <div className="container-content mt-8 text-left">
          <ServiceIconCards items={serviceItems.map((c) => ({ title: c.title, body: c.body }))} />
        </div>
      </section>

      {/* CTA 2 */}
      <CtaBanner
        heading={cta2Heading.text}
        ctas={cta2Link ? [{ label: cta2Link.text, href: cta2Link.href, variant: "white" }] : undefined}
        bgImage="/images/bg/build-together.webp"
        bgOpacity={0.73}
      >
        {cta2Para && <InlineText text={cta2Para.text} />}
      </CtaBanner>

      {/* Just a Consultancy */}
      <section className="py-14">
        <div className="container-content">
          <MediaSplit
            media={
              consultImage && (
                <Image
                  src={consultImage.src}
                  alt={consultImage.alt || "Just a Consultancy"}
                  width={600}
                  height={500}
                  className="h-auto w-full rounded-lg object-cover"
                />
              )
            }
          >
            <p className="text-[20px] font-semibold text-secondary">Just a Consultancy</p>
            {consultHeading && (
              <h2 className="mt-2 text-[28px] font-semibold text-ink md:text-[40px]">{consultHeading.text}</h2>
            )}
            <div className="mt-6">
              <ConsultancyTabs items={consultItems} />
            </div>
          </MediaSplit>
        </div>
      </section>
    </>
  );
}
