import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1, getFaqItems } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd } from "@/lib/seo";

const content = getPageContent("privacy-policy");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);
const faqs = getFaqItems(blocks);

export const metadata: Metadata = pageMetadata(content, "/privacy-policy/");

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Home", url: "/" }, { name: "Privacy Policy" }]),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={blocks} />
        </div>
      </section>
    </>
  );
}
