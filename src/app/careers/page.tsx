import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1 } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { CareersForm } from "@/components/forms/CareersForm";

const content = getPageContent("careers");
const h1 = resolvePageH1(content);
const stripped = stripChrome(content.blocks, h1);
const formStart = stripped.findIndex((b) => b.type === "form");
const bodyBlocks = formStart === -1 ? stripped : stripped.slice(0, formStart);

export const metadata: Metadata = pageMetadata(content, "/careers/");

export default function CareersPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Careers" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={bodyBlocks} />
        </div>
        <div className="container-content mt-10 max-w-2xl">
          <CareersForm />
        </div>
      </section>
    </>
  );
}
