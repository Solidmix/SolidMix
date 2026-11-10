import type { Metadata } from "next";
import { CategoryListing } from "@/components/CategoryListing";
import { getCategoryDefs, getCategoryPageContent } from "@/lib/categories";
import { pageMetadata } from "@/lib/seo";

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
  return pageMetadata(content, `/category/${cat}/page/${page}/`);
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
