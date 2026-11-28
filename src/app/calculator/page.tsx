import type { Metadata } from "next";
import { getPageContent, resolvePageH1 } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, resolveDisplayH1 } from "@/lib/seo";

const content = getPageContent("calculator");
const h1 = resolvePageH1(content);
const displayH1 = resolveDisplayH1("/calculator/", h1);

export const metadata: Metadata = pageMetadata(content, "/calculator/");

export default function CalculatorPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Calculator" }])]} />
      <PageHero title={displayH1} crumbs={[{ label: "Home", href: "/" }, { label: "Calculator" }]} />
      <section className="py-16 text-center md:py-24">
        <div className="container-content">
          <h2 className="text-[28px] font-semibold text-primary md:text-[40px]">Coming Soon</h2>
        </div>
      </section>
    </>
  );
}
