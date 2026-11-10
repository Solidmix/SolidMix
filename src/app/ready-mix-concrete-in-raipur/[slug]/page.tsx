import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  getFaqItems,
  findFirstImage,
} from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd, productLd, metaDescriptionFrom } from "@/lib/seo";
import { PRODUCTS_BASE, menu } from "@/content/site";

const PRODUCT_SLUGS =
  menu.find((item) => item.label === "Products")?.children?.map((c) => c.href.split("/").filter(Boolean).pop()!) ??
  [];

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

function loadProduct(slug: string) {
  if (!PRODUCT_SLUGS.includes(slug)) return null;
  try {
    return getPageContent(`ready-mix-concrete-in-raipur-${slug}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = loadProduct(slug);
  if (!content) return {};
  const image = findFirstImage(content.blocks);
  return pageMetadata(content, `${PRODUCTS_BASE}/${slug}/`, image?.src);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = loadProduct(slug);
  if (!content) notFound();

  const h1 = resolvePageH1(content);
  const blocks = stripChrome(content.blocks, h1);
  const faqs = getFaqItems(blocks);
  const image = findFirstImage(content.blocks);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: "/" },
            { name: "Products", url: `${PRODUCTS_BASE}/` },
            { name: h1 },
          ]),
          productLd({
            name: h1,
            description: metaDescriptionFrom(content),
            image: image?.src ?? "/images/solidmix-logo.webp",
          }),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <PageHero
        title={h1}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: `${PRODUCTS_BASE}/` },
          { label: h1 },
        ]}
      />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={blocks} />
        </div>
      </section>
    </>
  );
}
