import type { Metadata } from "next";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  type ImageBlock,
  type HeadingBlock,
  type ParaBlock,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { WorkTabs, type WorkPanel } from "@/components/work/WorkTabs";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";

const content = getPageContent("our-work");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const intro = blocks.slice(0, 2);
const residential = blocks.slice(4, 15);
const roads = blocks.slice(15, 26);
const tail = blocks.slice(26);

function buildPanel(key: string, label: string, run: typeof blocks): WorkPanel {
  const image = run[0] as ImageBlock;
  const heading = run[1] as HeadingBlock;
  const paraBlock = run[2] as ParaBlock;
  const stats: WorkPanel["stats"] = [];
  for (let i = 3; i < run.length; i += 2) {
    const h = run[i] as HeadingBlock | undefined;
    const p = run[i + 1] as ParaBlock | undefined;
    if (h?.type === "heading" && p?.type === "p") stats.push({ title: h.text, body: p.text });
  }
  return {
    key,
    label,
    image: { src: image.src, alt: image.alt || label },
    heading: heading.text,
    intro: paraBlock.text,
    stats,
  };
}

const panels: WorkPanel[] = [
  buildPanel("residential", "Residential Concrete Solutions", residential),
  buildPanel("roads", "Road & Infrastructure Projects", roads),
];

export const metadata: Metadata = pageMetadata(content, "/our-work/", panels[0]?.image.src);

export default function OurWorkPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Our Work" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Work" }]} />
      <section className="py-12 md:py-16 text-center">
        <div className="container-content max-w-2xl">
          <BlockRenderer blocks={intro} />
        </div>
        <div className="container-content mt-10">
          <WorkTabs panels={panels} />
        </div>
        <div className="container-content mt-12 max-w-2xl">
          <BlockRenderer blocks={tail} />
        </div>
      </section>
    </>
  );
}
