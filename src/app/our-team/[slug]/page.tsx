import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPageContent, resolvePageH1, type HeadingBlock, type ParaBlock, type ImageBlock } from "@/lib/content";
import { InlineText } from "@/components/InlineText";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";

const MEMBER_SLUGS = [
  "anand-sharma",
  "pitabas-sahoo",
  "pratham-bafna",
  "purnendu-poddar",
  "samrat-gupta",
  "vinit-tiwari",
];

export const dynamicParams = false;

export function generateStaticParams() {
  return MEMBER_SLUGS.map((slug) => ({ slug }));
}

function loadMember(slug: string) {
  if (!MEMBER_SLUGS.includes(slug)) return null;
  try {
    return getPageContent(`our-team-${slug}`);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = loadMember(slug);
  if (!content) return {};
  const image = content.blocks.find((b): b is ImageBlock => b.type === "image");
  return pageMetadata(content, `/our-team/${slug}/`, image?.src);
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = loadMember(slug);
  if (!content) notFound();

  const h1 = resolvePageH1(content);
  const image = content.blocks.find((b): b is ImageBlock => b.type === "image");
  const role = content.blocks.find(
    (b): b is HeadingBlock => b.type === "heading" && b.level === 2,
  );
  const bio = content.blocks.find((b): b is ParaBlock => b.type === "p");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", url: "/" },
            { name: "Our Team", url: "/our-team/" },
            { name: h1 },
          ]),
        ]}
      />
      <section className="py-12 md:py-16">
        <div className="container-content grid items-start gap-10 md:grid-cols-[320px_1fr]">
          {image && (
            <div className="overflow-hidden rounded-lg bg-tint-cyan-2">
              <Image
                src={image.src}
                alt={image.alt || h1}
                width={400}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-primary md:text-4xl">{h1}</h1>
            {role && <h2 className="mt-2 text-lg font-semibold text-secondary">{role.text}</h2>}
            {bio && (
              <p className="mt-6 leading-relaxed text-grey">
                <InlineText text={bio.text} />
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
