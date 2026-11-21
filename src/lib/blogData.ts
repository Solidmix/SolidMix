// Server-only blog data layer. Public pages read posts from Convex; on any
// error or an empty result they fall back to the existing JSON files
// (src/lib/posts.ts, src/lib/content.ts, src/lib/categories.ts) unchanged,
// so the site never serves an empty blog. Return shapes match the JSON
// helpers exactly so BlogSearch/PostGrid/CategoryListing need no changes.

import { api } from "../../convex/_generated/api";
import { getPageContent, type PageContent } from "@/lib/content";
import {
  getAllPostsSorted as getAllPostsSortedJson,
  getPostSlugs as getPostSlugsJson,
  type PostSummary,
} from "@/lib/posts";
import { getCategoryPagePosts } from "@/lib/categories";
import { getServerConvexClient as getClient } from "@/lib/convexServer";

export type PostPageContent = PageContent & { updatedAt?: string };

export type PostLookup =
  | { kind: "found"; content: PostPageContent }
  | { kind: "redirect"; to: string }
  | { kind: "not_found" };

type ConvexPostSummary = PostSummary & { legacy: boolean; updatedAt: number };

// Sitemap needs updatedAt (ms epoch) when available; legacy JSON posts have
// none, so callers fall back to `date`.
export type PostSummaryWithUpdatedAt = PostSummary & { updatedAt?: number };

// Returns null (never throws) when Convex is unreachable or has nothing —
// the single place every other function here falls back from.
async function listPublishedSafe(): Promise<ConvexPostSummary[] | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const rows = await client.query(api.posts.listPublished, {});
    if (!rows || rows.length === 0) return null;
    return rows as ConvexPostSummary[];
  } catch {
    return null;
  }
}

export async function getPostSlugs(): Promise<string[]> {
  const rows = await listPublishedSafe();
  if (!rows) return getPostSlugsJson();
  return rows.map((r) => r.slug);
}

export async function getAllPostsSorted(): Promise<PostSummaryWithUpdatedAt[]> {
  const rows = await listPublishedSafe();
  if (!rows) return getAllPostsSortedJson();
  return [...rows].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getLatestPosts(n: number): Promise<PostSummary[]> {
  const client = getClient();
  if (client) {
    try {
      const rows = await client.query(api.posts.latestPublished, { n });
      if (rows && rows.length > 0) return rows;
    } catch {
      // fall through to JSON
    }
  }
  return getAllPostsSortedJson().slice(0, n);
}

export async function getPost(slug: string): Promise<PostLookup> {
  const client = getClient();
  if (client) {
    try {
      const res = await client.query(api.posts.getPublishedBySlug, { slug });
      if (res.found && res.post) {
        return { kind: "found", content: res.post as PostPageContent };
      }
      if (res.redirectTo) {
        return { kind: "redirect", to: res.redirectTo };
      }
      // Not in Convex yet (not migrated) — fall through to the JSON file.
    } catch {
      // Convex unreachable — fall through to the JSON file.
    }
  }
  try {
    const content = getPageContent(slug);
    if (content.kind !== "post") return { kind: "not_found" };
    return { kind: "found", content };
  } catch {
    return { kind: "not_found" };
  }
}

// Category page 1 only: new (non-legacy) published posts in this category
// go first, newest first; the legacy posts keep their exact existing order
// from category-*.json. Pages beyond 1 are pure legacy and untouched by
// this file — see src/lib/categories.ts.
export async function getCategoryPage1Posts(cat: string): Promise<PostSummary[]> {
  const legacyPosts = getCategoryPagePosts(cat, 1);
  const rows = await listPublishedSafe();
  if (!rows) return legacyPosts;
  const legacySlugs = new Set(legacyPosts.map((p) => p.slug));
  const newPosts = rows
    .filter((r) => r.category === cat && !r.legacy && !legacySlugs.has(r.slug))
    .sort((a, b) => b.date.localeCompare(a.date));
  return [...newPosts, ...legacyPosts];
}
