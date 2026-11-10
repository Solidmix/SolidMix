import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1 } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { Calculator } from "@/components/forms/Calculator";

const content = getPageContent("calculator");
const h1 = resolvePageH1(content);
const stripped = stripChrome(content.blocks, h1);
const labelStart = stripped.findIndex((b) => b.type === "label");
const introBlocks = labelStart === -1 ? stripped : stripped.slice(0, labelStart);

export const metadata: Metadata = pageMetadata(content, "/calculator/");

export default function CalculatorPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Calculator" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Calculator" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content grid gap-10 lg:grid-cols-2">
          <div>
            <BlockRenderer blocks={introBlocks} />
            <div className="mt-8">
              <Calculator />
            </div>
          </div>
          <video
            controls
            preload="metadata"
            poster="/images/cuboid-poster.webp"
            className="aspect-video w-full rounded-lg bg-dark"
          >
            <source src="/videos/cuboid.mp4" type="video/mp4" />
          </video>
        </div>
      </section>
    </>
  );
}
