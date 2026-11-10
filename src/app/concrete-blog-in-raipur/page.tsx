import type { Metadata } from "next";
import { getPageContent, resolvePageH1 } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { getAllPostsSorted } from "@/lib/posts";
import { BlogSearch } from "@/components/BlogSearch";

const content = getPageContent("concrete-blog-in-raipur");
const h1 = resolvePageH1(content);
const posts = getAllPostsSorted();

export const metadata: Metadata = pageMetadata(content, "/concrete-blog-in-raipur/");

export default function BlogIndexPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", url: "/" }, { name: "Blog" }])]} />
      <BlogSearch h1={h1} posts={posts} />
    </>
  );
}
