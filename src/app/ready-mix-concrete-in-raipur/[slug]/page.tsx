import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import {
  getPageContent,
  stripChrome,
  resolvePageH1,
  getFaqItems,
  findFirstImage,
  type LinkBlock,
  type ImageBlock,
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

  // The trailing "Book Now" + "Contact us" pair sits side by side on the
  // original (not stacked, generic CTA links) — pull them out of the plain
  // BlockRenderer flow so they can get that treatment.
  const lastTwo = blocks.slice(-2);
  const hasBottomCtas =
    lastTwo.length === 2 && lastTwo.every((b): b is LinkBlock => b.type === "link");
  const withoutCtas = hasBottomCtas ? blocks.slice(0, -2) : blocks;
  const bottomCtas = hasBottomCtas ? (lastTwo as LinkBlock[]) : [];

  // The main product photo is shown at its natural size (not full-bleed,
  // not cropped) on the original — pull the first image out of the plain
  // BlockRenderer flow so it can get that treatment.
  const mainPhotoIndex = withoutCtas.findIndex((b) => b.type === "image");
  const mainPhoto = mainPhotoIndex === -1 ? undefined : (withoutCtas[mainPhotoIndex] as ImageBlock);
  const bodyBlocks =
    mainPhotoIndex === -1
      ? withoutCtas
      : [...withoutCtas.slice(0, mainPhotoIndex), ...withoutCtas.slice(mainPhotoIndex + 1)];

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
          {mainPhoto && (
            <div className="mx-auto mb-6 w-full max-w-[715px]">
              <NextImage
                src={mainPhoto.src}
                alt={mainPhoto.alt || h1}
                width={715}
                height={500}
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          )}
          <BlockRenderer blocks={bodyBlocks} />
          {bottomCtas.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              {bottomCtas.map((cta, i) => (
                <Link
                  key={cta.href + cta.text}
                  href={cta.href}
                  className={
                    i === 0
                      ? "inline-block rounded-md bg-primary px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-primary/90"
                      : "inline-block rounded-md bg-secondary px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-secondary/90"
                  }
                >
                  {cta.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
