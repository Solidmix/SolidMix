import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.slug}
          className="hover-bob overflow-hidden rounded-lg bg-white shadow-md"
        >
          <Link href={`/${post.slug}/`} className="block aspect-[4/3]">
            <Image
              src={post.featuredImage}
              alt={post.h1}
              width={400}
              height={300}
              className="h-full w-full object-cover"
            />
          </Link>
          <div className="p-5">
            <h3 className="text-base font-medium text-ink">
              <Link href={`/${post.slug}/`} className="hover:text-primary hover:underline">
                {post.h1}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-grey">{post.excerpt}</p>
            <Link
              href={`/${post.slug}/`}
              className="mt-3 inline-block text-sm font-semibold text-secondary hover:underline"
            >
              Read More »
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
