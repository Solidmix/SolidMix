// One-off enrichment: reads each blog post's published time (IST) from the
// original site's capture and stores it as a new "time" field on the matching
// src/content/pages/<slug>.json — no other field is touched, no wording changes.
// Usage: node scripts/add-post-times.mjs

import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "src/content/pages");
const ORIG_DIR = path.join(ROOT, "docs/reference/original-site/pages");
const INDEX_JSON = path.join(ROOT, "src/content/index.json");

function formatTime(hour, minute) {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? "am" : "pm";
  return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
}

async function run() {
  const index = JSON.parse(await readFile(INDEX_JSON, "utf8"));
  const postSlugs = index.filter((p) => p.kind === "post").map((p) => p.slug);

  let updated = 0;
  for (const slug of postSlugs) {
    const jsonPath = path.join(PAGES_DIR, `${slug}.json`);
    const htmlPath = path.join(ORIG_DIR, slug, "page.html");
    if (!existsSync(jsonPath) || !existsSync(htmlPath)) {
      console.warn(`SKIP (missing file): ${slug}`);
      continue;
    }
    const html = await readFile(htmlPath, "utf8");
    const m = html.match(/"datePublished":"(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):\d{2}\+05:30"/);
    if (!m) {
      console.warn(`SKIP (no datePublished found): ${slug}`);
      continue;
    }
    const [, , hourStr, minuteStr] = m;
    const time = formatTime(Number(hourStr), Number(minuteStr));

    const data = JSON.parse(await readFile(jsonPath, "utf8"));
    if (data.time === time) continue; // already set, idempotent
    data.time = time;
    await writeFile(jsonPath, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`${slug}: time = "${time}"`);
    updated += 1;
  }
  console.log(`TOTAL: ${updated} post(s) updated`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
