import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPageContent, stripChrome, resolvePageH1, getFaqItems } from "@/lib/content";
import { BlockRenderer } from "@/components/BlockRenderer";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd, faqPageLd, articleLd } from "@/lib/seo";
import { getPostSlugs, formatPostDate } from "@/lib/posts";

const POST_SLUGS = getPostSlugs();

export const dynamicParams = false;

export function generateStaticParams() {
  return POST_SLUGS.map((post) => ({ post }));
}

function loadPost(slug: string) {
  if (!POST_SLUGS.includes(slug)) return null;
  try {
    const content = getPageContent(slug);
    return content.kind === "post" ? content : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ post: string }>;
}): Promise<Metadata> {
  const { post } = await params;
  const content = loadPost(post);
  if (!content) return {};
  return pageMetadata(content, `/${post}/`, content.featuredImage?.src);
}

export default async function PostPage({ params }: { params: Promise<{ post: string }> }) {
  const { post } = await params;
  const content = loadPost(post);
  if (!content) notFound();

  const h1 = resolvePageH1(content);
  const stripped = stripChrome(content.blocks, h1);
  const bodyBlocks =
    stripped[0]?.type === "image" && stripped[0].src === content.featuredImage?.src
      ? stripped.slice(1)
      : stripped;
  const faqs = getFaqItems(bodyBlocks);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: "/" },
            { name: "Blog", url: "/concrete-blog-in-raipur/" },
            { name: h1 },
          ]),
          ...(content.date && content.featuredImage
            ? [
                articleLd({
                  headline: h1,
                  datePublished: content.date,
                  image: content.featuredImage.src,
                  url: `/${post}/`,
                }),
              ]
            : []),
          ...(faqs.length ? [faqPageLd(faqs)] : []),
        ]}
      />
      <section className="py-10 md:py-14">
        <div className="container-content max-w-3xl">
          {content.featuredImage && (
            <div className="overflow-hidden rounded-lg">
              <Image
                src={content.featuredImage.src}
                alt={content.featuredImage.alt || h1}
                width={1200}
                height={700}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          <h1 className="mt-6 text-[28px] font-semibold text-primary md:text-[40px]">{h1}</h1>
          <p className="mt-3 text-sm font-medium text-grey-2">
            admin
            {content.date && <> · {formatPostDate(content.date)}</>}
            {content.time && <> · {content.time}</>}
          </p>
          {/* Post body only: headings read ink (not primary/teal), inline
              links read the original's #cc3366, and body copy (paragraphs/
              list items) is 20px — scoped here via CSS, not a BlockRenderer
              default, since other pages keep their own colours/sizes. */}
          <div className="mt-6 [&_a]:text-[#cc3366] [&_h2]:text-[#292929] [&_h3]:text-[#292929] [&_li]:text-[20px] [&_p]:text-[20px]">
            <BlockRenderer
              blocks={bodyBlocks}
              faqMode="plain"
              resetTables={post === "bulking-of-sand" ? [["Grade", "Mix Ratio", "Usage"]] : []}
            />
          </div>
        </div>
      </section>
    </>
  );
}
