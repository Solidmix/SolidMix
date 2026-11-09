import Image from "next/image";
import Link from "next/link";
import { segmentBlocks, type Block } from "@/lib/content";
import { InlineText } from "@/components/InlineText";
import { FaqAccordion } from "@/components/FaqAccordion";

// Renders a flat run of JSON content blocks (already stripped of PageHero
// chrome) as the plain long-form sections used by product, safety, legal and
// privacy pages: headings, paragraphs, lists, images, CTA links and FAQs.
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  const segments = segmentBlocks(blocks);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === "faq") {
          return (
            <div key={`faq-${i}`} className="my-8">
              <FaqAccordion items={seg.items} />
            </div>
          );
        }
        return (
          <div key={`blocks-${i}`}>
            {seg.blocks.map((b, j) => (
              <BlockItem key={j} block={b} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function BlockItem({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const text = <InlineText text={block.text} />;
      if (block.level <= 2) {
        return <h2 className="mt-10 text-2xl font-extrabold text-primary md:text-3xl">{text}</h2>;
      }
      if (block.level === 3) {
        return <h3 className="mt-7 text-lg font-semibold text-secondary md:text-xl">{text}</h3>;
      }
      return <h4 className="mt-5 text-base font-semibold text-ink">{text}</h4>;
    }
    case "p":
      return (
        <p className="mt-4 leading-relaxed text-grey">
          <InlineText text={block.text} />
        </p>
      );
    case "list":
      return (
        <ul className="mt-4 list-disc space-y-2 pl-6 text-grey">
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      );
    case "image": {
      const img = (
        <Image
          src={block.src}
          alt={block.alt || ""}
          width={960}
          height={600}
          className="h-auto w-full rounded-lg object-cover"
        />
      );
      return (
        <div className="mt-6 overflow-hidden rounded-lg">
          {block.href ? (
            <Link href={block.href} className="block">
              {img}
            </Link>
          ) : (
            img
          )}
        </div>
      );
    }
    case "link":
      return (
        <div className="mt-6">
          <Link
            href={block.href}
            className="inline-block rounded-md bg-primary px-6 py-3.5 font-semibold text-white transition-colors hover:bg-primary/90"
          >
            {block.text}
          </Link>
        </div>
      );
    case "table":
      return (
        <div className="mt-6 overflow-x-auto rounded-lg border border-grey-line">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="odd:bg-tint-cyan-2/50">
                  {row.map((cell, j) => (
                    <td key={j} className="border-b border-grey-line px-4 py-2.5 text-grey">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "button":
      return (
        <span className="mt-4 mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
          {block.text}
        </span>
      );
    default:
      return null;
  }
}
