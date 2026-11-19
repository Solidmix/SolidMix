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

// The live original (rmc-gallery-in-raipur, gallery widget e9e9ec7) shows
// exactly these 21 photos in this order — it repeats 3 of its own source
// files (1/14/21, 3/19, 15/17 are byte-identical pairs/triples) so all 21
// are kept as-is. Dimensions are each file's own real natural size (the
// originals, not the smaller srcset size the live page happened to load).
const images: LightboxImage[] = [
  { src: "/images/gallery/rmc-gallery-01-whatsapp-image-2025-03-24-at-19.07.10-2.webp", alt: "SolidMix RMC transit mixer delivering ready mix concrete to construction site in Raipur", width: 1236, height: 1600 },
  { src: "/images/gallery/rmc-gallery-02-whatsapp-image-2025-04-10-at-4.09.01-pm-1-e1758811233899.webp", alt: "Ready mix concrete being poured for slab construction — SolidMix RMC Raipur", width: 643, height: 726 },
  { src: "/images/gallery/rmc-gallery-03-whatsapp-image-2025-04-10-at-4.15.12-pm-1.webp", alt: "Concrete placement at residential construction site, Raipur — SolidMix RMC", width: 645, height: 685 },
  { src: "/images/gallery/rmc-gallery-04-whatsapp-image-2025-03-07-at-5.49.09-pm.webp", alt: "SolidMix RMC concrete delivery at project site, Raipur Chhattisgarh", width: 1024, height: 1280 },
  { src: "/images/gallery/rmc-gallery-05-road-map-thumb-nail-2.webp", alt: "Ready mix concrete delivery route and coverage area — SolidMix RMC, Raipur", width: 1080, height: 1350 },
  { src: "/images/gallery/rmc-gallery-06-2-scaled.webp", alt: "Large-scale concrete pour for commercial construction — SolidMix RMC Raipur", width: 2560, height: 1440 },
  { src: "/images/gallery/rmc-gallery-07-whatsapp-image-2025-03-07-at-10.52.34-am.webp", alt: "SolidMix RMC batching plant operations — RMC plant Serikhedi Raipur", width: 591, height: 920 },
  { src: "/images/gallery/rmc-gallery-08-whatsapp-image-2025-03-20-at-10.41.11.webp", alt: "Ready mix concrete M25 column casting at construction site in Raipur", width: 1280, height: 1600 },
  { src: "/images/gallery/rmc-gallery-09-whatsapp-image-2025-03-20-at-10.41.11-1.webp", alt: "Transit mixer unloading ready mix concrete at building site, Chhattisgarh", width: 1280, height: 1600 },
  { src: "/images/gallery/rmc-gallery-10-whatsapp-image-2025-03-20-at-10.41.12.webp", alt: "Concrete pump placement for multi-storey construction — SolidMix RMC", width: 1280, height: 1600 },
  { src: "/images/gallery/rmc-gallery-11-whatsapp-image-2025-03-26-at-13.17.10.webp", alt: "SolidMix RMC concrete delivery — M30 grade pour for structural construction Raipur", width: 1236, height: 1600 },
  { src: "/images/gallery/rmc-gallery-12-whatsapp-image-2025-03-24-at-23.13.56-e1744134405682.webp", alt: "Night-time ready mix concrete delivery by SolidMix RMC — 24x7 availability", width: 1236, height: 1250 },
  { src: "/images/gallery/rmc-gallery-13-whatsapp-image-2025-03-20-at-10.49.14.webp", alt: "SolidMix RMC transit mixer fleet — on-time concrete delivery across Raipur", width: 2048, height: 2560 },
  { src: "/images/gallery/rmc-gallery-14-whatsapp-image-2025-03-24-at-19.07.10-1.webp", alt: "Concrete slab construction using ready mix concrete supplied by SolidMix RMC Raipur", width: 1236, height: 1600 },
  { src: "/images/gallery/rmc-gallery-15-whatsapp-image-2025-03-24-at-19.25.29-1.webp", alt: "Ready mix concrete for foundation work — SolidMix RMC project Raipur", width: 1236, height: 1600 },
  { src: "/images/gallery/rmc-gallery-16-whatsapp-image-2025-03-25-at-22.25.34-e1745574522767.webp", alt: "SolidMix RMC concrete plant in Serikhedi — batching and quality control", width: 1280, height: 1060 },
  { src: "/images/gallery/rmc-gallery-17-whatsapp-image-2025-03-29-at-14.47.02.webp", alt: "M20 grade ready mix concrete pour for residential project, Raipur", width: 1236, height: 1600 },
  { src: "/images/gallery/rmc-gallery-18-whatsapp-image-2025-03-29-at-19.16.07-scaled-1.webp", alt: "Large volume concrete delivery by SolidMix RMC for commercial structure", width: 1978, height: 2560 },
  { src: "/images/gallery/rmc-gallery-19-whatsapp-image-2025-04-10-at-4.15.12-pm.webp", alt: "Concrete placement at infrastructure project — SolidMix RMC Chhattisgarh", width: 645, height: 685 },
  { src: "/images/gallery/rmc-gallery-20-whatsapp-image-2025-04-10-at-4.09.01-pm.webp", alt: "SolidMix RMC ready mix concrete — quality controlled batching for construction", width: 643, height: 801 },
  { src: "/images/gallery/rmc-gallery-21-whatsapp-image-2025-03-24-at-19.07.10.webp", alt: "Ready mix concrete delivery and site operations — SolidMix RMC Raipur", width: 1236, height: 1600 },
];

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
        <div className="mt-10">
          <Lightbox images={images} />
        </div>
      </section>
    </>
  );
}
