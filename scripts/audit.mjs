// Phase 8 quality-gate crawl (seo-kit/00-CLAUDE-BUILD-BRIEF.md). Plain Node,
// no new dependencies: fetch the sitemap, then breadth-first crawl every
// sitemap URL plus every internal link found on them, against an already
// running `next start` server (BASE env var, default http://localhost:3100).
//
// Reports: internal links not returning 200, redirect chains (>1 hop),
// duplicate <title>/meta-description, pages with 0 or >1 <h1>, and sitemap
// URLs not returning 200. Exits 1 if any issue is found.

const BASE = process.env.AUDIT_BASE_URL || "http://localhost:3100";
const LOCAL_ORIGIN = new URL(BASE).origin;
const MAX_HOPS = 10;

// The site's metadataBase/sitemap always use the production canonical origin
// (https://solidmixrmc.com), even when crawling a local build. We must never
// send requests to the real reference site (CLAUDE.md: read-only, never
// touched), so every URL is kept in "canonical" form for identity/reporting
// and only swapped onto LOCAL_ORIGIN at the moment of fetching.
let CANONICAL_ORIGIN = null;

function toCanonical(urlStr, baseUrl) {
  const resolved = new URL(urlStr, baseUrl);
  resolved.hash = "";
  if (CANONICAL_ORIGIN && resolved.origin === LOCAL_ORIGIN) {
    resolved.protocol = new URL(CANONICAL_ORIGIN).protocol;
    resolved.host = new URL(CANONICAL_ORIGIN).host;
  }
  return resolved;
}

function toFetchable(canonicalUrl) {
  const local = new URL(canonicalUrl);
  local.protocol = new URL(LOCAL_ORIGIN).protocol;
  local.host = new URL(LOCAL_ORIGIN).host;
  return local.toString();
}

function isInternal(urlStr, baseUrl) {
  const resolved = new URL(urlStr, baseUrl);
  return resolved.origin === CANONICAL_ORIGIN || resolved.origin === LOCAL_ORIGIN;
}

async function followRedirects(canonicalUrl) {
  let current = canonicalUrl;
  const hops = [];
  for (let i = 0; i < MAX_HOPS; i++) {
    const res = await fetch(toFetchable(current), { redirect: "manual" });
    hops.push({ url: current, status: res.status });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { hops, finalStatus: res.status, finalUrl: current, res };
      current = toCanonical(loc, current).toString();
      continue;
    }
    return { hops, finalStatus: res.status, finalUrl: current, res };
  }
  return { hops, finalStatus: hops[hops.length - 1].status, finalUrl: current };
}

function extractLinks(html, pageCanonicalUrl) {
  const links = new Set();
  const re = /<a\b[^>]*href="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (/^(mailto:|tel:|javascript:|data:|#)/i.test(raw)) continue;
    let resolved;
    try {
      resolved = new URL(raw, pageCanonicalUrl);
    } catch {
      continue;
    }
    if (!isInternal(raw, pageCanonicalUrl)) continue;
    if (CANONICAL_ORIGIN && resolved.origin === LOCAL_ORIGIN) {
      resolved.protocol = new URL(CANONICAL_ORIGIN).protocol;
      resolved.host = new URL(CANONICAL_ORIGIN).host;
    }
    resolved.hash = "";
    links.add(resolved.toString());
  }
  return [...links];
}

function extractOne(html, re) {
  const m = re.exec(html);
  return m ? m[1].trim() : null;
}

async function main() {
  const sitemapRes = await fetch(`${BASE}/sitemap.xml`);
  if (!sitemapRes.ok) {
    console.error(`FATAL: could not fetch ${BASE}/sitemap.xml (status ${sitemapRes.status})`);
    process.exit(1);
  }
  const sitemapXml = await sitemapRes.text();
  const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (sitemapUrls.length === 0) {
    console.error("FATAL: sitemap.xml had no <loc> entries");
    process.exit(1);
  }
  CANONICAL_ORIGIN = new URL(sitemapUrls[0]).origin;

  const visited = new Map(); // url -> { status, title, description, h1Count, isHtml }
  const linkSources = new Map(); // url -> Set(pages that link to it)
  const redirectChains = []; // { page, link, chain: [{url,status}] }
  const queued = new Set();
  const queue = [];

  function enqueue(url, fromPage) {
    if (fromPage) {
      if (!linkSources.has(url)) linkSources.set(url, new Set());
      linkSources.get(url).add(fromPage);
    }
    if (queued.has(url) || visited.has(url)) return;
    queued.add(url);
    queue.push(url);
  }

  for (const u of sitemapUrls) enqueue(u, null);

  while (queue.length) {
    const url = queue.shift();
    if (visited.has(url)) continue;

    const { hops, finalStatus, finalUrl, res } = await followRedirects(url);
    const redirectHops = hops.filter((h) => h.status >= 300 && h.status < 400).length;
    if (redirectHops > 1) {
      redirectChains.push({ page: url, chain: hops });
    }

    const contentType = res?.headers.get("content-type") || "";
    const isHtml = finalStatus === 200 && contentType.includes("text/html");
    let title = null;
    let description = null;
    let h1Count = 0;

    if (isHtml) {
      const html = await res.text();
      title = extractOne(html, /<title>([^<]*)<\/title>/i);
      description = extractOne(
        html,
        /<meta\s+name="description"\s+content="([^"]*)"/i,
      );
      h1Count = (html.match(/<h1[\s>]/gi) || []).length;

      for (const link of extractLinks(html, finalUrl)) {
        enqueue(link, url);
      }
    }

    // A redirect source (e.g. an old URL that 301s elsewhere) inherits its
    // destination's title/description/H1 in this crawl's final response —
    // that's expected, not a real duplicate-content page, so it's excluded
    // from the title/description/H1 checks below.
    const wasRedirect = hops.length > 1;
    visited.set(url, { status: finalStatus, title, description, h1Count, isHtml, wasRedirect });
  }

  // Broken internal links: any discovered link whose crawled status isn't 200.
  const brokenLinks = [];
  for (const [link, pages] of linkSources) {
    const v = visited.get(link);
    const status = v ? v.status : "uncrawled";
    if (status !== 200) {
      for (const page of pages) brokenLinks.push({ page, link, status });
    }
  }

  // Sitemap URLs not returning 200.
  const sitemapNotOk = sitemapUrls
    .map((u) => ({ url: u, status: visited.get(u)?.status ?? "uncrawled" }))
    .filter((r) => r.status !== 200);

  // Duplicate titles / descriptions among crawled HTML 200 pages.
  const titleMap = new Map();
  const descMap = new Map();
  const h1Issues = [];
  for (const [url, v] of visited) {
    if (!v.isHtml || v.status !== 200 || v.wasRedirect) continue;
    if (v.title) {
      if (!titleMap.has(v.title)) titleMap.set(v.title, []);
      titleMap.get(v.title).push(url);
    }
    if (v.description) {
      if (!descMap.has(v.description)) descMap.set(v.description, []);
      descMap.get(v.description).push(url);
    }
    if (v.h1Count !== 1) h1Issues.push({ url, h1Count: v.h1Count });
  }
  const duplicateTitles = [...titleMap].filter(([, urls]) => urls.length > 1);
  const duplicateDescriptions = [...descMap].filter(([, urls]) => urls.length > 1);

  // ---- Report ----
  let issueCount = 0;

  console.log(`Crawled ${visited.size} URLs from ${sitemapUrls.length} sitemap entries.\n`);

  console.log(`## Broken internal links (${brokenLinks.length})`);
  for (const b of brokenLinks) {
    console.log(`  ${b.page}  ->  ${b.link}  [${b.status}]`);
    issueCount++;
  }

  console.log(`\n## Redirect chains >1 hop (${redirectChains.length})`);
  for (const c of redirectChains) {
    console.log(`  ${c.page}:`);
    for (const h of c.chain) console.log(`    ${h.status}  ${h.url}`);
    issueCount++;
  }

  console.log(`\n## Sitemap URLs not returning 200 (${sitemapNotOk.length})`);
  for (const s of sitemapNotOk) {
    console.log(`  ${s.url}  [${s.status}]`);
    issueCount++;
  }

  console.log(`\n## Pages with 0 or >1 <h1> (${h1Issues.length})`);
  for (const h of h1Issues) {
    console.log(`  ${h.url}  [h1 count: ${h.h1Count}]`);
    issueCount++;
  }

  console.log(`\n## Duplicate <title> (${duplicateTitles.length})`);
  for (const [title, urls] of duplicateTitles) {
    console.log(`  "${title}"`);
    for (const u of urls) console.log(`    ${u}`);
    issueCount++;
  }

  console.log(`\n## Duplicate meta description (${duplicateDescriptions.length})`);
  for (const [desc, urls] of duplicateDescriptions) {
    console.log(`  "${desc.slice(0, 80)}${desc.length > 80 ? "..." : ""}"`);
    for (const u of urls) console.log(`    ${u}`);
    issueCount++;
  }

  console.log(`\n${issueCount === 0 ? "PASS" : "FAIL"}: ${issueCount} issue group(s) found.`);
  process.exit(issueCount === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
