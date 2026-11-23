import type { Metadata } from "next";
import { CategoryListing } from "@/components/CategoryListing";
import { getCategoryDefs, getCategoryPageContent } from "@/lib/categories";
import { pageMetadata, metaDescriptionFrom } from "@/lib/seo";
import { seoMetaOverrides } from "@/content/seoMeta";

const CATEGORY_DEFS = getCategoryDefs();

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_DEFS.flatMap((def) =>
    Array.from({ length: def.pages - 1 }, (_, i) => ({ cat: def.slug, n: String(i + 2) })),
  );
}

function resolve(cat: string, n: string) {
  const def = CATEGORY_DEFS.find((d) => d.slug === cat);
  const page = Number(n);
  if (!def || !Number.isInteger(page) || page < 2 || page > def.pages) return null;
  return page;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string; n: string }>;
}): Promise<Metadata> {
  const { cat, n } = await params;
  const page = resolve(cat, n);
  if (!page) return {};
  const content = getCategoryPageContent(cat, page);
  const base = pageMetadata(content, `/category/${cat}/page/${page}/`);
  // The scraped title/description for page 2+ of a category archive is
  // byte-identical across every page (no per-page CSV row exists), which
  // Phase 8's audit flags as a duplicate. Use the category's own confirmed
  // page-1 title/description (seo-kit/01-seo-meta.csv) with "Page N"
  // appended — the real page number, not new copy.
  const page1Override = seoMetaOverrides[`/category/${cat}/`];
  const baseTitle = page1Override?.title ?? getCategoryPageContent(cat, 1).title;
  const baseDescription = page1Override?.description;
  const title = `${baseTitle} – Page ${page}`;
  const description = baseDescription
    ? `${baseDescription} (Page ${page})`
    : metaDescriptionFrom(content);
  return {
    ...base,
    title,
    description,
    openGraph: { ...base.openGraph, title, description },
  };
}

export default async function CategoryPagedPage({
  params,
}: {
  params: Promise<{ cat: string; n: string }>;
}) {
  const { cat, n } = await params;
  const page = resolve(cat, n) ?? 2;
  return <CategoryListing cat={cat} page={page} />;
}
