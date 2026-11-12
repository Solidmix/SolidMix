import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1, type HeadingBlock } from "@/lib/content";
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
const bodyBlocks = introHeading ? withoutForm.filter((b) => b !== introHeading) : withoutForm;

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
        <div className="container-content mt-10 max-w-2xl">
          <CareersForm />
        </div>
      </section>
    </>
  );
}
