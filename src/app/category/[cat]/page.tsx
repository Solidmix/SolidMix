import type { Metadata } from "next";
import { CategoryListing } from "@/components/CategoryListing";
import { getCategoryDefs, getCategoryPageContent } from "@/lib/categories";
import { getCategoryPage1Posts } from "@/lib/blogData";
import { pageMetadata } from "@/lib/seo";

const CATEGORY_SLUGS = getCategoryDefs().map((d) => d.slug);

// true (not false): with trailingSlash, revalidatePath("/category/x/") on a
// dynamicParams=false route throws NoFallbackError and serves 404 until the
// next build. Unknown categories still 404 via notFound() in CategoryListing.
export const dynamicParams = true;

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
  if (!CATEGORY_SLUGS.includes(cat)) return <CategoryListing cat={cat} page={1} />;
  const posts = await getCategoryPage1Posts(cat);
  return <CategoryListing cat={cat} page={1} posts={posts} />;
}
