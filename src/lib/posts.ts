// Blog post listing helpers built on top of src/content/index.json (the
// extracted page inventory) — no new content, only read access.

import indexData from "@/content/index.json";

export type PostSummary = {
  slug: string;
  path: string;
  kind: string;
  title: string;
  h1: string;
  date: string;
  category: string;
  excerpt: string;
  featuredImage: string;
};

export function getAllPosts(): PostSummary[] {
  return (indexData as PostSummary[]).filter((d) => d.kind === "post");
}

export function getAllPostsSorted(): PostSummary[] {
  return [...getAllPosts()].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}
