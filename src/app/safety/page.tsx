import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1, getFaqItems } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";

const content = getPageContent("safety");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);
const faqs = getFaqItems(blocks);

export const metadata: Metadata = pageMetadata(content, "/safety/");

export default function SafetyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: "/" }, { name: "Safety" }]),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Safety" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl">
          {/* These two level-2 headings are plain inline <h2> in the
              original (inside a text-editor widget, not a heading widget),
              so they inherit the page's dark body colour, not primary. */}
          <BlockRenderer
            blocks={blocks}
            darkHeadings={[
              "Safety – Commitment to Safe Construction & Concrete Operations",
              "Our Modern Safety Practices",
            ]}
          />
        </div>
      </section>
    </>
  );
}
