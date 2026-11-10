// Category archive helpers. The page count and the exact post order per page
// are read directly from src/content/pages/category-*.json (kind "category")
// — the same files the original WordPress category widget produced — so the
// replica never has to guess pagination or ordering.

import { getPageContent, type HeadingBlock } from "@/lib/content";
import { getAllPosts, type PostSummary } from "@/lib/posts";

export type CategoryDef = { slug: string; pages: number; label: string };

// slug -> number of pages that exist in src/content/pages for that category.
const CATEGORY_PAGE_COUNTS: Record<string, number> = {
  construction: 4,
  "concrete-101": 1,
  "rmc-plant": 1,
};

function categoryFileSlug(cat: string, page: number) {
  return page <= 1 ? `category-${cat}` : `category-${cat}-page-${page}`;
}

export function getCategoryPageContent(cat: string, page: number) {
  return getPageContent(categoryFileSlug(cat, page));
}

export function getCategoryDefs(): CategoryDef[] {
  return Object.entries(CATEGORY_PAGE_COUNTS).map(([slug, pages]) => {
    const content = getPageContent(categoryFileSlug(slug, 1));
    const label = content.h1.replace(/^Category:\s*/i, "").trim();
    return { slug, pages, label };
  });
}

export function getCategoryPageCount(cat: string): number {
  return CATEGORY_PAGE_COUNTS[cat] ?? 0;
}

const POST_LINK_RE = /^\[([^\]]+)\]\(\/([^/]+)\/\)$/;

// Ordered post slugs for one category page, read from that page's own
// heading blocks (the pattern the original listing produced).
export function getCategoryPageSlugs(cat: string, page: number): string[] {
  const content = getPageContent(categoryFileSlug(cat, page));
  const slugs: string[] = [];
  for (const b of content.blocks) {
    if (b.type === "heading" && (b as HeadingBlock).level === 2) {
      const m = POST_LINK_RE.exec(b.text);
      if (m) slugs.push(m[2]);
    }
  }
  return slugs;
}

export function getCategoryPagePosts(cat: string, page: number): PostSummary[] {
  const slugs = getCategoryPageSlugs(cat, page);
  const posts = getAllPosts();
  return slugs
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter((p): p is PostSummary => Boolean(p));
}
