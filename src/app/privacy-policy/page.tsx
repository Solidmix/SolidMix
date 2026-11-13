import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1 } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";

const content = getPageContent("privacy-policy");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

export const metadata: Metadata = pageMetadata(content, "/privacy-policy/");

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Privacy policy" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Privacy policy" }]} />
      <section className="py-12 md:py-16">
        {/* This page's body text measures weight 600 (bold phrases compute
            "bolder" from that to 900, per the global b,strong CSS rule) and
            its h2/h3 are a different size/colour than BlockRenderer's
            generic defaults. "What Are Cookies?"/"Need Help?" end in "?"
            but aren't real Q&A — noFaq stops them being swept into an
            accordion. */}
        <div className="container-content max-w-3xl [&_h2]:text-[32px] [&_h2]:text-[#292929] [&_h3]:text-[28px] [&_li]:font-semibold [&_p]:font-semibold">
          <BlockRenderer blocks={blocks} noFaq />
        </div>
      </section>
    </>
  );
}
