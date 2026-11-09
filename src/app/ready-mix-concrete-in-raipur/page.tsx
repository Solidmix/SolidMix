import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1, extractCards } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { CardGrid } from "@/components/CardGrid";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { PRODUCTS_BASE } from "@/content/site";

const content = getPageContent("ready-mix-concrete-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const cardsStart = blocks.findIndex((b) => b.type === "image");
let cardsEnd = blocks.findIndex(
  (b) => b.type === "heading" && b.text.startsWith("Get the Right Concrete"),
);
// Guard against a trailing orphan image (e.g. an FAQ icon) with no heading
// after it — extractCards would otherwise misread the next heading as a title.
if (blocks[cardsEnd - 1]?.type === "image") cardsEnd -= 1;
const before = blocks.slice(0, cardsStart);
const cards = extractCards(blocks.slice(cardsStart, cardsEnd));
const after = blocks.slice(cardsEnd);

export const metadata: Metadata = pageMetadata(content, `${PRODUCTS_BASE}/`, cards[0]?.image?.src);

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Products" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Products" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-3xl">
          <BlockRenderer blocks={before} />
        </div>
        <div className="container-content mt-10">
          <CardGrid cards={cards} columns={3} imageAspect="square" />
        </div>
        <div className="container-content mt-10 max-w-3xl">
          <BlockRenderer blocks={after} />
        </div>
      </section>
    </>
  );
}
