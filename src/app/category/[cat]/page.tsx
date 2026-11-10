import type { Metadata } from "next";
import { CategoryListing } from "@/components/CategoryListing";
import { getCategoryDefs, getCategoryPageContent } from "@/lib/categories";
import { pageMetadata } from "@/lib/seo";

const CATEGORY_SLUGS = getCategoryDefs().map((d) => d.slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_SLUGS.map((cat) => ({ cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  if (!CATEGORY_SLUGS.includes(cat)) return {};
  const content = getCategoryPageContent(cat, 1);
  return pageMetadata(content, `/category/${cat}/`);
}

export default async function CategoryPage({ params }: { params: Promise<{ cat: string }> }) {
  const { cat } = await params;
  return <CategoryListing cat={cat} page={1} />;
}
