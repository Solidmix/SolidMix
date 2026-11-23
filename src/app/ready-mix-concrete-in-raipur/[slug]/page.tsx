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
import { pageMetadata, breadcrumbLd, faqPageLd, productLd, metaDescriptionFrom, resolveDisplayH1 } from "@/lib/seo";
import { PRODUCTS_BASE, menu, site } from "@/content/site";
import { productAnswers } from "@/data/productAnswers";
import { nav as navData, cta as bookUsCta } from "@/data/navigation";

// seo-kit Phase 5 template A "Related products": 3 links from the same
// navigation.ts group as this slug, excluding itself. Groups with fewer
// than 3 other links (Fiber Reinforced, Decorative & Bagged) fall back to
// the next groups in the same order until 3 are collected.
function getRelatedProducts(slug: string): { overview: { label: string; href: string }; related: { label: string; href: string }[] } {
  const productsNavItem = navData.find((item) => item.href === `${PRODUCTS_BASE}/`);
  const groups = productsNavItem?.groups ?? [];
  const selfHref = `${PRODUCTS_BASE}/${slug}/`;
  const ownGroupIndex = groups.findIndex((g) => g.links.some((l) => l.href === selfHref));
  // Same group first (brief: "3 links from the same group"), then the
  // nearest other groups in nav order (wrapping) when a group has fewer
  // than 3 other members (Fiber Reinforced, Decorative & Bagged).
  const orderedGroups =
    ownGroupIndex === -1
      ? groups
      : [groups[ownGroupIndex], ...groups.slice(ownGroupIndex + 1), ...groups.slice(0, ownGroupIndex)];
  const related = orderedGroups
    .flatMap((g) => g.links)
    .filter((l) => l.href !== selfHref)
    .slice(0, 3);
  return { overview: productsNavItem?.overview ?? { label: "All products", href: `${PRODUCTS_BASE}/` }, related };
}

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
  const displayH1 = resolveDisplayH1(`${PRODUCTS_BASE}/${slug}/`, h1);
  // Phase 5 new sections use the clean CSV product name (displayH1 minus
  // " in Raipur"), not the raw scrape h1: a few scrape h1 fields are
  // garbled (e.g. permeable-concrete-in-kotni-raipur) or still carry the
  // slug's place name (e.g. "... in Bhanpuri, Raipur"), which the brief
  // says must never appear in new copy. The visible breadcrumb and
  // BreadcrumbList JSON-LD use displayH1 for the same reason (below); h1
  // itself is kept only for stripChrome() and productLd()'s name.
  const productName = displayH1.replace(/ in Raipur$/, "");
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

  const answer = productAnswers[slug];
  const { overview: relatedOverview, related: relatedProducts } = getRelatedProducts(slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: "/" },
            { name: "Products", url: `${PRODUCTS_BASE}/` },
            { name: displayH1 },
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
        title={displayH1}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: `${PRODUCTS_BASE}/` },
          { label: displayH1 },
        ]}
      />
      {answer && (
        <section className="py-10">
          <div className="container-content max-w-3xl">
            <p className="text-lg text-ink">
              {productName} is {answer.definition}. SolidMix RMC supplies it in Raipur.
            </p>
            <div className="mt-6 overflow-hidden rounded-lg border border-grey-line">
              <table className="w-full border-collapse text-left text-base">
                <tbody>
                  <tr className="odd:bg-tint-cyan-2/50">
                    <th scope="row" className="w-40 border-b border-grey-line px-4 py-2.5 font-semibold text-ink">
                      Product
                    </th>
                    <td className="border-b border-grey-line px-4 py-2.5 text-grey">{productName}</td>
                  </tr>
                  {answer.typicalUses && (
                    <tr className="odd:bg-tint-cyan-2/50">
                      <th scope="row" className="w-40 border-b border-grey-line px-4 py-2.5 align-top font-semibold text-ink">
                        Typical uses
                      </th>
                      <td className="border-b border-grey-line px-4 py-2.5 text-grey">{answer.typicalUses.join(", ")}</td>
                    </tr>
                  )}
                  <tr className="odd:bg-tint-cyan-2/50">
                    <th scope="row" className="w-40 border-b border-grey-line px-4 py-2.5 font-semibold text-ink">
                      Supplied in
                    </th>
                    <td className="border-b border-grey-line px-4 py-2.5 text-grey">Raipur</td>
                  </tr>
                  <tr className="odd:bg-tint-cyan-2/50">
                    <th scope="row" className="w-40 border-b border-grey-line px-4 py-2.5 font-semibold text-ink">
                      How to order
                    </th>
                    <td className="border-b border-grey-line px-4 py-2.5 text-grey">
                      Call <a href={site.phoneHref} className="text-primary hover:underline">{site.phoneDisplay}</a>,{" "}
                      <a href={site.whatsappHref} className="text-primary hover:underline">WhatsApp</a>, or the{" "}
                      <Link href={bookUsCta.href} className="text-primary hover:underline">
                        Book Us form
                      </Link>
                    </td>
                  </tr>
                  <tr className="odd:bg-tint-cyan-2/50">
                    <th scope="row" className="w-40 px-4 py-2.5 font-semibold text-ink">
                      Contact
                    </th>
                    <td className="px-4 py-2.5 text-grey">
                      SolidMix RMC, {site.phoneDisplay}, info@solidmixrmc.com
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
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
      {answer && (
        <section className="py-6">
          <div className="container-content max-w-3xl text-center">
            <h2 className="text-[28px] font-semibold text-ink">How do I order {productName} from SolidMix RMC?</h2>
            <p className="mt-3 text-lg text-grey">
              Call <a href={site.phoneHref} className="text-primary hover:underline">{site.phoneDisplay}</a>,{" "}
              <a href={site.whatsappHref} className="text-primary hover:underline">WhatsApp</a>, or use the{" "}
              <Link href={bookUsCta.href} className="text-primary hover:underline">Book Us form</Link>.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={bookUsCta.href}
                className="inline-block rounded-md bg-primary px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-primary/90"
              >
                Book Us
              </Link>
              <Link
                href="/calculator/"
                className="inline-block rounded-md bg-secondary px-8 py-4 text-xl font-medium text-white transition-colors hover:bg-secondary/90"
              >
                Use the Concrete Calculator
              </Link>
            </div>
          </div>
        </section>
      )}
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
      {answer && (
        <section className="py-12">
          <div className="container-content max-w-3xl">
            <h2 className="text-[22px] font-semibold text-ink">Related products</h2>
            <ul className="mt-4 flex flex-wrap gap-4">
              {relatedProducts.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="text-primary hover:underline">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <Link href={relatedOverview.href} className="text-primary hover:underline">
                {relatedOverview.label}
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
