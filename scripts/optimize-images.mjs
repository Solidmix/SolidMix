// Converts the reference images used by Batch B1 into optimized WebP files
// under public/images with clean kebab-case names, and copies the hero/logo
// video with a poster. PNG transparency is preserved as WebP alpha.
//
// Source images are reference-only material (docs/reference/original-site/assets);
// no WordPress/Elementor code is imported — only the raw media is re-encoded.

import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "docs/reference/original-site/assets");
const OUT_IMG = path.join(ROOT, "public/images");
const OUT_VID = path.join(ROOT, "public/videos");

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
];

const videos = [["LOGO-ORTHO-Linked-Comp-01-1.mp4", "logo-ortho.mp4"]];

async function run() {
  await mkdir(OUT_IMG, { recursive: true });
  await mkdir(OUT_VID, { recursive: true });

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

  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
