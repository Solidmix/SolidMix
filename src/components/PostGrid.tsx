import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";

// 24px on the Appointments teaser, 32px on category pages (measured from the
// original: card titles are bigger there). Category pages also measure a
// distinct #333333 excerpt colour (vs the usual body ink). The blog index
// measures a different responsive pair (18px mobile / 32px desktop) plus its
// own excerpt colour and "Read More »" weight/colour, passed via
// titleClassName/readMoreClassName since they don't fit the flat px prop.
export function PostGrid({
  posts,
  titleSize = "24px",
  titleClassName,
  excerptColor,
  readMoreClassName,
}: {
  posts: PostSummary[];
  titleSize?: "24px" | "32px";
  titleClassName?: string;
  excerptColor?: string;
  readMoreClassName?: string;
}) {
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
            <h3
              className={titleClassName ?? "font-medium text-ink"}
              style={titleClassName ? undefined : { fontSize: titleSize }}
            >
              <Link href={`/${post.slug}/`} className="hover:text-primary hover:underline">
                {post.h1}
              </Link>
            </h3>
            <p
              className={`mt-2 text-sm leading-relaxed ${excerptColor ? "" : "text-grey"}`}
              style={excerptColor ? { color: excerptColor } : undefined}
            >
              {post.excerpt}
            </p>
            <Link
              href={`/${post.slug}/`}
              className={readMoreClassName ?? "mt-3 inline-block text-sm font-medium text-secondary hover:underline"}
            >
              Read More »
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
