"use client";

import { useMemo, useState } from "react";
import type { PostSummary } from "@/lib/posts";
import { PostGrid } from "@/components/PostGrid";

export function BlogSearch({ h1, posts }: { h1: string; posts: PostSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) => p.h1.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q),
    );
  }, [posts, query]);

  return (
    <>
      {/* Light, left-aligned header on the original — not a dark gradient
          banner with centered white text (measured: #333333 text, start
          alignment, 24px mobile / 40px desktop heading). */}
      <section className="overflow-x-clip pb-10 pt-16 text-left md:pb-14 md:pt-20">
        <div className="container-content">
          <h1 className="text-[24px] font-medium text-[#333333] md:text-[40px]">{h1}</h1>
          <p className="mt-4 text-lg font-light text-[#333333]">Insights, Updates, and Industry Stories</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex max-w-xl overflow-hidden rounded-md border border-grey-line bg-white shadow-lg"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to start searching..."
              aria-label="Search blog posts"
              className="w-full px-4 py-3.5 text-ink placeholder:text-grey-2 focus:outline-none"
            />
            <button type="submit" className="px-6 py-3.5 text-[16px] font-normal text-[#333333]">
              Search
            </button>
          </form>
        </div>
      </section>
      <section className="pb-14 md:pb-20">
        <div className="container-content">
          <div className="rounded-2xl bg-white p-6 shadow-xl md:p-10">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-grey">No posts match “{query}”.</p>
            ) : (
              <PostGrid
                posts={filtered}
                titleClassName="text-[18px] font-medium text-ink md:text-[32px]"
                excerptColor="#777777"
                readMoreClassName="mt-3 inline-block text-sm font-normal text-[#cc3366] hover:underline"
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
