import type { Metadata } from "next";
import { getPageContent, stripChrome, resolvePageH1 } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";

const content = getPageContent("rmc-gallery-in-raipur");
const h1 = resolvePageH1(content);
const blocks = stripChrome(content.blocks, h1);

const GALLERY_COUNT = 36;
// Measured directly from the actual public/images/gallery/*.webp files
// (natural width/height), so the masonry grid never crops or stretches a
// photo — the original's data-width/data-height only covers its first 21
// items, so our own files' real dimensions are the sourced value here.
const GALLERY_DIMS: [number, number][] = [
  [1200, 675], [1200, 675], [1000, 303], [1200, 611], [1200, 675], [591, 920],
  [1024, 1280], [1200, 1500], [1200, 1500], [1200, 1500], [1200, 1553], [1200, 1553],
  [1200, 1553], [1200, 1553], [1200, 1214], [1200, 1553], [1200, 1553], [1200, 1553],
  [1024, 627], [645, 685], [1200, 1445], [1080, 1350], [1200, 430], [635, 380],
  [635, 380], [635, 380], [635, 380], [635, 380], [635, 380], [635, 380],
  [635, 380], [635, 380], [635, 380], [635, 380], [635, 380], [1200, 617],
];
const images: LightboxImage[] = Array.from({ length: GALLERY_COUNT }, (_, i) => ({
  src: `/images/gallery/gallery-${i + 1}.webp`,
  alt: `SolidMix RMC project gallery photo ${i + 1}`,
  width: GALLERY_DIMS[i][0],
  height: GALLERY_DIMS[i][1],
}));

export const metadata: Metadata = pageMetadata(content, "/rmc-gallery-in-raipur/", images[0]?.src);

export default function GalleryPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Gallery" }])]} />
      <PageHero title={h1} crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]} />
      <section className="py-12 md:py-16">
        <div className="container-content max-w-2xl text-center">
          <BlockRenderer blocks={blocks} />
        </div>
        <div className="container-content mt-10">
          <Lightbox images={images} />
        </div>
      </section>
    </>
  );
}
