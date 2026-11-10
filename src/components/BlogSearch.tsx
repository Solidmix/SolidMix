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
      <section className="overflow-x-clip bg-gradient-to-br from-primary to-secondary pb-28 pt-16 text-center text-white md:pb-36 md:pt-20">
        <div className="container-content">
          <h1 className="text-4xl font-extrabold md:text-5xl">{h1}</h1>
          <p className="mt-4 text-lg">Insights, Updates, and Industry Stories</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-8 flex max-w-xl overflow-hidden rounded-md bg-white shadow-lg"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to start searching..."
              aria-label="Search blog posts"
              className="w-full px-4 py-3.5 text-ink placeholder:text-grey-2 focus:outline-none"
            />
            <button type="submit" className="bg-dark px-6 py-3.5 font-semibold text-white">
              Search
            </button>
          </form>
        </div>
      </section>
      <section className="-mt-16 pb-14 md:-mt-20 md:pb-20">
        <div className="container-content">
          <div className="rounded-2xl bg-white p-6 shadow-xl md:p-10">
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-grey">No posts match “{query}”.</p>
            ) : (
              <PostGrid posts={filtered} />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
