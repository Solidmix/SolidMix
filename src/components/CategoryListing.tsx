import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PostGrid } from "@/components/PostGrid";
import { JsonLd } from "@/components/JsonLd";
import { getCategoryDefs, getCategoryPageCount, getCategoryPagePosts } from "@/lib/categories";
import type { PostSummary } from "@/lib/posts";
import { breadcrumbLd, resolveDisplayH1 } from "@/lib/seo";

function categoryPageHref(cat: string, page: number) {
  return page <= 1 ? `/category/${cat}/` : `/category/${cat}/page/${page}/`;
}

// `posts` is passed in only by page 1 (new published posts prepended ahead
// of the legacy order); every other page keeps calling the legacy-only
// getCategoryPagePosts itself, unchanged.
export function CategoryListing({
  cat,
  page,
  posts: postsOverride,
}: {
  cat: string;
  page: number;
  posts?: PostSummary[];
}) {
  const def = getCategoryDefs().find((d) => d.slug === cat);
  const totalPages = getCategoryPageCount(cat);
  if (!def || page < 1 || page > totalPages) notFound();

  const posts = postsOverride ?? getCategoryPagePosts(cat, page);
  // seo-kit/01-seo-meta.csv Phase 2: the H1 is the plain category name, no
  // "Category: " prefix (that prefix was never in the CSV's h1 column).
  const displayH1 = resolveDisplayH1(`/category/${cat}/`, def.label);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/concrete-blog-in-raipur/" },
            { name: def.label },
          ]),
        ]}
      />
      <PageHero
        title={displayH1}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/concrete-blog-in-raipur/" },
          { label: def.label },
        ]}
      />
      <section className="py-10 md:py-14">
        <div className="container-content">
          <PostGrid posts={posts} layout="list" />
          {totalPages > 1 && (
            <nav aria-label="Category pagination" className="mt-10 flex items-center justify-between">
              <span>
                {page > 1 && (
                  <Link href={categoryPageHref(cat, page - 1)} className="hover:underline">
                    ← Previous
                  </Link>
                )}
              </span>
              <span>
                {page < totalPages && (
                  <Link href={categoryPageHref(cat, page + 1)} className="hover:underline">
                    Next →
                  </Link>
                )}
              </span>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
