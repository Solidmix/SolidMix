import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { PostGrid } from "@/components/PostGrid";
import { getCategoryDefs, getCategoryPageCount, getCategoryPagePosts } from "@/lib/categories";

function categoryPageHref(cat: string, page: number) {
  return page <= 1 ? `/category/${cat}/` : `/category/${cat}/page/${page}/`;
}

export function CategoryListing({ cat, page }: { cat: string; page: number }) {
  const def = getCategoryDefs().find((d) => d.slug === cat);
  const totalPages = getCategoryPageCount(cat);
  if (!def || page < 1 || page > totalPages) notFound();

  const posts = getCategoryPagePosts(cat, page);

  return (
    <>
      <PageHero
        title={`Category: ${def.label}`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/concrete-blog-in-raipur/" },
          { label: def.label },
        ]}
      />
      <section className="py-10 md:py-14">
        <div className="container-content">
          <PostGrid posts={posts} />
          {totalPages > 1 && (
            <nav aria-label="Category pagination" className="mt-10 flex items-center justify-center gap-6">
              {page > 1 && (
                <Link
                  href={categoryPageHref(cat, page - 1)}
                  className="font-semibold text-secondary hover:underline"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-grey-2">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={categoryPageHref(cat, page + 1)}
                  className="font-semibold text-secondary hover:underline"
                >
                  Next →
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
