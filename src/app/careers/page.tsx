import type { Metadata } from "next";
import NextImage from "next/image";
import { getPageContent, stripChrome, resolvePageH1, type HeadingBlock, type ImageBlock } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { CareersForm } from "@/components/forms/CareersForm";

const content = getPageContent("careers");
const h1 = resolvePageH1(content);
const stripped = stripChrome(content.blocks, h1);
const formStart = stripped.findIndex((b) => b.type === "form");
const withoutForm = formStart === -1 ? stripped : stripped.slice(0, formStart);
// "Career options at Solidmixrmc" measures 40px desktop / 24px mobile,
// unlike BlockRenderer's generic (28px flat) heading default.
const introHeading = withoutForm.find((b): b is HeadingBlock => b.type === "heading");
const afterIntro = introHeading ? withoutForm.filter((b) => b !== introHeading) : withoutForm;
// "Inside Elevate" / "Company Benefits" cards are hidden on every breakpoint
// on the original (elementor-hidden-desktop/tablet/mobile) — never rendered,
// kept in content.json only.
const insideElevateStart = afterIntro.findIndex((b) => b.type === "heading" && b.text === "Inside Elevate");
const insideElevateEnd =
  insideElevateStart === -1
    ? -1
    : afterIntro.findIndex((b, idx) => idx > insideElevateStart && b.type === "image");
const withoutInsideElevate =
  insideElevateStart === -1
    ? afterIntro
    : [
        ...afterIntro.slice(0, insideElevateStart),
        ...afterIntro.slice(insideElevateEnd === -1 ? afterIntro.length : insideElevateEnd),
      ];
// The Hindi graduation poster ("सही शिक्षा का SOLID फैसला...") sits
// immediately before the form on the original (two-column row: image col
// 50% / form col 50%, image itself 72% of its column — css/post-35.css
// elements 73daf38/22cf096/92be738/910bc19). Its alt text says "column
// casting" but it is visually the poster (confirmed against the live site).
const posterImage =
  withoutInsideElevate[withoutInsideElevate.length - 1]?.type === "image"
    ? (withoutInsideElevate[withoutInsideElevate.length - 1] as ImageBlock)
    : undefined;
const bodyBlocks = posterImage ? withoutInsideElevate.slice(0, -1) : withoutInsideElevate;

export const metadata: Metadata = pageMetadata(content, "/careers/");

export default function CareersPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Careers" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl">
          {introHeading && (
            <h2 className="text-[24px] font-semibold text-primary md:text-[40px]">{introHeading.text}</h2>
          )}
          <BlockRenderer blocks={bodyBlocks} />
        </div>
        <div className="container-content mt-10 grid gap-x-[11px] gap-y-10 md:grid-cols-2 md:items-center">
          {posterImage && (
            <div className="flex justify-center">
              <NextImage
                src={posterImage.src}
                alt={posterImage.alt || ""}
                width={1280}
                height={1600}
                className="h-auto w-[72%]"
              />
            </div>
          )}
          <CareersForm />
        </div>
      </section>
    </>
  );
}
