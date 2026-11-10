// Converts the reference images used by the build batches into optimized WebP
// files under public/images with clean kebab-case names, and copies hero/logo
// videos with posters. PNG transparency is preserved as WebP alpha.
//
// Source images are reference-only material (docs/reference/original-site/assets);
// no WordPress/Elementor code is imported — only the raw media is re-encoded.

import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "docs/reference/original-site/assets");
const OUT_IMG = path.join(ROOT, "public/images");
const OUT_VID = path.join(ROOT, "public/videos");
const OUT_CONTENT = path.join(OUT_IMG, "content");
const OUT_GALLERY = path.join(OUT_IMG, "gallery");
const OUT_HERO = path.join(OUT_IMG, "hero");
const OUT_FILES = path.join(ROOT, "public/files");
const APP_DIR = path.join(ROOT, "src/app");

// B2: every image referenced by the extracted page content (src/content/pages/*.json).
const imagesNeeded = JSON.parse(
  await readFile(path.join(ROOT, ".local-tools/content/images-needed.json"), "utf8"),
);
const filesNeeded = JSON.parse(
  await readFile(path.join(ROOT, ".local-tools/content/files-needed.json"), "utf8"),
);

// B2: Gallery grid — promotional/project photos that were never parsed into page
// blocks (an Elementor gallery widget), captured separately in the asset dump.
const galleryImages = [
  "2.webp",
  "DJI_0574.webp",
  "Frame-283-2-1-e1755338174321.webp",
  "Screenshot_3.webp",
  "Solidmix-image.webp",
  "WhatsApp-Image-2025-03-07-at-10.52.34-AM.webp",
  "WhatsApp-Image-2025-03-07-at-5.49.09-PM.webp",
  "WhatsApp-Image-2025-03-20-at-10.41.11-1.webp",
  "WhatsApp-Image-2025-03-20-at-10.41.12.webp",
  "WhatsApp-Image-2025-03-20-at-10.49.14.webp",
  "WhatsApp-Image-2025-03-24-at-19.07.10-1.webp",
  "WhatsApp-Image-2025-03-24-at-19.07.10-2.webp",
  "WhatsApp-Image-2025-03-24-at-19.07.10.webp",
  "WhatsApp-Image-2025-03-24-at-19.25.29-1.webp",
  "WhatsApp-Image-2025-03-24-at-23.13.56-e1744134405682.webp",
  "WhatsApp-Image-2025-03-26-at-13.17.10.webp",
  "WhatsApp-Image-2025-03-29-at-14.47.02.webp",
  "WhatsApp-Image-2025-03-29-at-19.16.07-scaled-1.webp",
  "WhatsApp-Image-2025-04-05-at-15.08.02.webp",
  "WhatsApp-Image-2025-04-10-at-4.15.12-PM-1.webp",
  "WhatsApp-Image-2025-12-12-at-1.08.27-PM.webp",
  "road-map-Thumb-nail-2.webp",
  "sl_022120_28320_29-scaled-1.webp",
  "solidmixrmc.webp",
  "solidmixrmc-1.webp",
  "solidmixrmc-2.webp",
  "solidmixrmc-3.webp",
  "solidmixrmc-4.webp",
  "solidmixrmc-5.webp",
  "solidmixrmc-6.webp",
  "solidmixrmc-7.webp",
  "solidmixrmc-8.webp",
  "solidmixrmc-9.webp",
  "solidmixrmc-10.webp",
  "solidmixrmc-11.webp",
  "sustanibilityBgImg.webp",
];

// B2: Home hero slider — 3 original slides, same order as on solidmixrmc.com.
const heroSlides = [
  "WhatsApp-Image-2026-06-16-at-6.49.28-PM.jpeg",
  "WhatsApp-Image-2026-06-16-at-6.49.28-PM-1.jpeg",
  "WhatsApp-Image-2026-06-16-at-6.49.29-PM.jpeg",
];

// B2: product/CEO videos with real extracted poster frames.
const contentVideos = [
  { from: "Cuboid-1.mp4", to: "cuboid.mp4", poster: "cuboid-poster.webp" },
  { from: "CEO-VINIT-SOLIDMIX-1.mp4", to: "ceo-vinit.mp4", poster: "ceo-vinit-poster.webp" },
];

// source file (in assets) -> output name (in public/images)
const images = [
  ["Solidmix-Logo-Photoroom-1.webp", "solidmix-logo.webp"],
  ["Solidmix-Logo-e1773131751527-1024x548.webp", "solidmix-logo-footer.webp"],
  ["WhatsApp_Image_2026-06-16_at_3.43.53_PM-removebg-preview.png", "mixer-truck.webp"],
  ["WhatsApp-Image-2026-06-16-at-3.39.08-PM.jpeg", "faq-first-pour.webp"],
  ["Screenshot_12-removebg-preview-150x150-1.webp", "service-icon-1.webp"],
  ["Screenshot_15-removebg-preview.webp", "service-icon-2.webp"],
  ["Screenshot_18-removebg-preview.webp", "service-icon-3.webp"],
  ["Screenshot_17-removebg-preview.webp", "service-icon-4.webp"],
  ["Screenshot_22-removebg-preview.webp", "service-icon-5.webp"],
  // B3 visual fix: the dark concrete-texture background used behind every
  // inner-page title banner on the original (page-title section).
  ["Frame-283-2-1-e1755338174321.webp", "page-hero-bg.webp"],
];

const videos = [["LOGO-ORTHO-Linked-Comp-01-1.mp4", "logo-ortho.mp4"]];

async function run() {
  await mkdir(OUT_IMG, { recursive: true });
  await mkdir(OUT_VID, { recursive: true });
  await mkdir(OUT_CONTENT, { recursive: true });
  await mkdir(OUT_GALLERY, { recursive: true });
  await mkdir(OUT_HERO, { recursive: true });
  await mkdir(OUT_FILES, { recursive: true });

  for (const [from, to] of images) {
    const srcPath = path.join(SRC, from);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing source): ${from}`);
      continue;
    }
    const buf = await readFile(srcPath);
    const out = await sharp(buf)
      .webp({ quality: 82, alphaQuality: 100, effort: 5 })
      .toBuffer();
    await writeFile(path.join(OUT_IMG, to), out);
    console.log(`image: ${from} -> images/${to}`);
  }

  for (const [from, to] of videos) {
    const srcPath = path.join(SRC, from);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing source): ${from}`);
      continue;
    }
    await copyFile(srcPath, path.join(OUT_VID, to));
    console.log(`video: ${from} -> videos/${to}`);
  }

  // Poster for the logo-ortho video: a dark branded frame built from the logo.
  const logoSrc = path.join(SRC, "Solidmix-Logo-e1773131751527-1024x548.webp");
  if (existsSync(logoSrc)) {
    const logo = await sharp(await readFile(logoSrc))
      .resize({ width: 520, withoutEnlargement: true })
      .toBuffer();
    const poster = await sharp({
      create: {
        width: 1280,
        height: 720,
        channels: 4,
        background: { r: 14, g: 14, b: 14, alpha: 1 },
      },
    })
      .composite([{ input: logo, gravity: "centre" }])
      .webp({ quality: 80 })
      .toBuffer();
    await writeFile(path.join(OUT_IMG, "logo-ortho-poster.webp"), poster);
    console.log("poster: images/logo-ortho-poster.webp");
  }

  // B2: content images referenced by every page's extracted blocks.
  for (const { source, out } of imagesNeeded) {
    const srcPath = path.join(SRC, source);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing content source): ${source}`);
      continue;
    }
    const outPath = path.join(ROOT, "public", out.replace(/^\//, ""));
    const buf = await readFile(srcPath);
    const resized = await sharp(buf)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 78, alphaQuality: 100, effort: 4 })
      .toBuffer();
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, resized);
  }
  console.log(`content images: ${imagesNeeded.length} processed -> public/images/content`);

  // B2: brochure / other PDFs.
  for (const { source, out } of filesNeeded) {
    const srcPath = path.join(SRC, source);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing file source): ${source}`);
      continue;
    }
    const outPath = path.join(ROOT, "public", out.replace(/^\//, ""));
    await mkdir(path.dirname(outPath), { recursive: true });
    await copyFile(srcPath, outPath);
    console.log(`file: ${source} -> ${out}`);
  }

  // B2: Gallery grid images.
  let galleryCount = 0;
  for (const [i, source] of galleryImages.entries()) {
    const srcPath = path.join(SRC, source);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing gallery source): ${source}`);
      continue;
    }
    const buf = await readFile(srcPath);
    const out = await sharp(buf)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 76, effort: 4 })
      .toBuffer();
    await writeFile(path.join(OUT_GALLERY, `gallery-${i + 1}.webp`), out);
    galleryCount += 1;
  }
  console.log(`gallery: ${galleryCount} images -> public/images/gallery`);

  // B2: Home hero slider slides.
  for (const [i, source] of heroSlides.entries()) {
    const srcPath = path.join(SRC, source);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing hero source): ${source}`);
      continue;
    }
    const buf = await readFile(srcPath);
    const out = await sharp(buf)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
    await writeFile(path.join(OUT_HERO, `slide-${i + 1}.webp`), out);
    console.log(`hero: ${source} -> images/hero/slide-${i + 1}.webp`);
  }

  // B2: product/CEO videos with real extracted poster frames (via ffmpeg).
  for (const { from, to, poster } of contentVideos) {
    const srcPath = path.join(SRC, from);
    if (!existsSync(srcPath)) {
      console.warn(`SKIP (missing video source): ${from}`);
      continue;
    }
    const outPath = path.join(OUT_VID, to);
    await copyFile(srcPath, outPath);
    console.log(`video: ${from} -> videos/${to}`);

    const framePath = path.join(OUT_VID, `_frame-${to}.png`);
    try {
      execFileSync("ffmpeg", ["-y", "-ss", "1", "-i", srcPath, "-frames:v", "1", framePath], {
        stdio: "ignore",
      });
      const posterBuf = await sharp(framePath)
        .resize({ width: 1280, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();
      await writeFile(path.join(OUT_IMG, poster), posterBuf);
      await (await import("node:fs/promises")).unlink(framePath);
      console.log(`poster: images/${poster}`);
    } catch (e) {
      console.warn(`SKIP (ffmpeg poster failed for ${from}): ${e.message}`);
    }
  }

  // B2: favicon + apple touch icon from the original cropped favicon.
  const faviconSrc = path.join(SRC, "cropped-Fav-icon.webp");
  if (existsSync(faviconSrc)) {
    const buf = await readFile(faviconSrc);
    await sharp(buf).resize(192, 192).png().toFile(path.join(APP_DIR, "icon.png"));
    await sharp(buf).resize(180, 180).png().toFile(path.join(APP_DIR, "apple-icon.png"));
    console.log("favicon: src/app/icon.png (192x192), src/app/apple-icon.png (180x180)");
  }

  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
