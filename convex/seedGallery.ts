import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { sha256Hex } from "./authData";

// The 21 photos currently hardcoded in src/app/rmc-gallery-in-raipur/page.tsx
// (same order, src, alt, width, height) — copied here only as one-time seed
// data for the new galleryPhotos table.
const LEGACY_PHOTOS = [
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

type SeedResult = { ok: true; inserted: number } | { ok: false; reason: string };

// One-time, secret-protected: inserts the 21 legacy photos only if the
// table is empty, so re-running it after real edits is a no-op.
export const seedGalleryFromLocal = mutation({
  args: { secret: v.string() },
  handler: async (ctx, { secret }): Promise<SeedResult> => {
    const expected = process.env.DASHBOARD_BOOTSTRAP_SECRET;
    if (!expected) return { ok: false, reason: "not_configured" };
    if ((await sha256Hex(secret)) !== (await sha256Hex(expected))) {
      return { ok: false, reason: "invalid_secret" };
    }

    const existing = await ctx.db.query("galleryPhotos").take(1);
    if (existing.length > 0) return { ok: false, reason: "not_empty" };

    const now = Date.now();
    for (let i = 0; i < LEGACY_PHOTOS.length; i++) {
      const p = LEGACY_PHOTOS[i];
      await ctx.db.insert("galleryPhotos", {
        src: p.src,
        alt: p.alt,
        width: p.width,
        height: p.height,
        order: i,
        deleted: false,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { ok: true, inserted: LEGACY_PHOTOS.length };
  },
});
