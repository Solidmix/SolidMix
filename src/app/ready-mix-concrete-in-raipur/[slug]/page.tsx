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
  segmentBlocks,
  type LinkBlock,
  type ImageBlock,
  type HeadingBlock,
  type ParaBlock,
  type ListBlock,
} from "@/lib/content";
import { InlineText } from "@/components/InlineText";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { FaqAccordion } from "@/components/FaqAccordion";
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
  const withoutPhoto =
    mainPhotoIndex === -1
      ? withoutCtas
      : [...withoutCtas.slice(0, mainPhotoIndex), ...withoutCtas.slice(mainPhotoIndex + 1)];

  // The "Frequently asked question" heading + intro paragraph are centered
  // on the original (unlike the rest of the body) — pulled out so they can
  // get that treatment, with the main body and the FAQ accordion rendered
  // separately around them instead of one flat BlockRenderer flow. The FAQ
  // icon (FAQ_Icon.svg) always sits immediately before that heading on the
  // original — pulled out too so it never renders full-width through the
  // generic image block.
  const faqHeadingIndex = withoutPhoto.findIndex(
    (b) => b.type === "heading" && b.text === "Frequently asked question",
  );
  const faqIconIndex = faqHeadingIndex > 0 && withoutPhoto[faqHeadingIndex - 1]?.type === "image" ? faqHeadingIndex - 1 : -1;
  const faqIcon = faqIconIndex === -1 ? undefined : (withoutPhoto[faqIconIndex] as ImageBlock);
  const faqHeading = faqHeadingIndex === -1 ? undefined : (withoutPhoto[faqHeadingIndex] as HeadingBlock);
  const faqIntroIndex = faqHeadingIndex === -1 ? -1 : faqHeadingIndex + 1;
  const faqIntro =
    faqIntroIndex !== -1 && withoutPhoto[faqIntroIndex]?.type === "p"
      ? (withoutPhoto[faqIntroIndex] as ParaBlock)
      : undefined;
  const bodyBlocks =
    faqHeadingIndex === -1 ? withoutPhoto : withoutPhoto.slice(0, faqIconIndex !== -1 ? faqIconIndex : faqHeadingIndex);
  const faqQaBlocks =
    faqHeadingIndex === -1 ? [] : withoutPhoto.slice(faqIntro ? faqIntroIndex + 1 : faqHeadingIndex + 1);

  // Level-2 headings whose entire text is wrapped in [[b]]...[[/b]] (e.g.
  // "Applications of Modern X Concrete") are plain inline <h2> on the
  // original — inside a text-editor widget, not a heading widget — so they
  // inherit the page's dark body colour instead of the primary heading
  // colour used by the page's real heading widgets (e.g. "X – Reliable
  // Solution for..."), which never carry bold markers.
  const darkHeadings = bodyBlocks
    .filter((b): b is HeadingBlock => b.type === "heading" && b.level === 2 && /^\[\[b\]\].*\[\[\/b\]\]$/.test(b.text))
    .map((b) => b.text);

  // A bullet list trailing a FAQ answer (e.g. standard-concrete's "Where is
  // standard concrete used?") belongs inside that answer's panel, not as a
  // separate block after the accordion — fold it into the item here.
  const faqSegments = faqQaBlocks.length > 0 ? segmentBlocks(faqQaBlocks) : [];
  const faqAccordionItems: Array<{ q: string; a: string; list?: string[] }> = [];
  faqSegments.forEach((seg, i) => {
    if (seg.kind !== "faq") return;
    seg.items.forEach((item, j) => {
      const isLast = j === seg.items.length - 1;
      const next = isLast ? faqSegments[i + 1] : undefined;
      const list =
        next && next.kind === "blocks" && next.blocks.length === 1 && next.blocks[0].type === "list"
          ? (next.blocks[0] as ListBlock).items
          : undefined;
      faqAccordionItems.push({ ...item, list });
    });
  });

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
                priority
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          )}
          {/* Body H2/H3 sizes measured from standard-concrete.md: 32px H2,
              28px H3, weight 500 (not BlockRenderer's generic 28/22 at
              weight 600) — scoped here, not a BlockRenderer default, since
              other pages keep their own sizes. */}
          <div className="[&_h2]:text-[32px] [&_h2]:font-medium [&_h3]:text-[28px] [&_h3]:font-medium">
            <BlockRenderer blocks={bodyBlocks} darkHeadings={darkHeadings} />
          </div>
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
      {faqHeading && (
        <section className="bg-[#292929] p-[100px]">
          <div className="mx-auto flex w-full max-w-[1140px] flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
            <div className="flex w-full flex-col items-center text-center md:w-[40%]">
              {faqIcon && (
                <div className="w-[14%]">
                  <NextImage
                    src={faqIcon.src}
                    alt={faqIcon.alt || "FAQ"}
                    width={112}
                    height={112}
                    className="h-auto w-full"
                  />
                </div>
              )}
              <h2 className="mt-4 text-[28px] font-semibold text-primary md:text-[40px]">{faqHeading.text}</h2>
              {faqIntro && (
                <p className="mt-4 max-w-md text-white">
                  <InlineText text={faqIntro.text} />
                </p>
              )}
            </div>
            <div className="w-full md:w-[60%]">
              <FaqAccordion items={faqAccordionItems} variant="filled" />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
