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
import { PdfIcon } from "@/components/icons";

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

const brochureHeading = tail.find((b) => b.type === "heading") as HeadingBlock | undefined;
const brochureLink = tail.find((b) => b.type === "link") as { text: string; href: string } | undefined;

export default function OurWorkPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Our Work" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Our Work" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-2xl text-center">
          <BlockRenderer blocks={intro} />
        </div>
        <div className="container-content mt-10">
          <WorkTabs panels={panels} />
        </div>
        {brochureHeading && brochureLink && (
          <div className="container-content mt-12 max-w-2xl">
            <div className="flex flex-col items-center gap-5 rounded-lg border border-grey-line p-6 sm:flex-row sm:justify-between">
              <div className="flex items-center gap-4">
                <PdfIcon className="h-10 w-10 flex-shrink-0 text-primary" />
                <h2 className="text-xl font-semibold text-ink md:text-2xl">{brochureHeading.text}</h2>
              </div>
              <a
                href={brochureLink.href}
                className="w-full flex-shrink-0 rounded-md bg-secondary px-6 py-3.5 text-center text-xl font-medium text-white transition-colors hover:bg-secondary/90 sm:w-auto"
              >
                {brochureLink.text}
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
