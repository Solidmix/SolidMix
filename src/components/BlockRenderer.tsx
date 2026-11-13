import Image from "next/image";
import Link from "next/link";
import { segmentBlocks, type Block } from "@/lib/content";
import { InlineText } from "@/components/InlineText";
import { FaqAccordion } from "@/components/FaqAccordion";

// Renders a flat run of JSON content blocks (already stripped of PageHero
// chrome) as the plain long-form sections used by product, safety, legal and
// privacy pages: headings, paragraphs, lists, images, CTA links and FAQs.
export function BlockRenderer({
  blocks,
  faqQuestionColor,
  faqMode = "accordion",
  noFaq = false,
  darkHeadings = [],
  resetTables = [],
}: {
  blocks: Block[];
  faqQuestionColor?: "ink" | "primary" | "secondary";
  // Blog posts show their "Q: ... / A: ..." pairs as plain always-open text,
  // not a collapsible widget — every other page keeps the accordion.
  faqMode?: "accordion" | "plain";
  // Some headings end in "?" without being real Q&A content (e.g. privacy
  // policy's "What Are Cookies?", "Need Help?") — segmentBlocks would still
  // sweep them into a one-item FAQ accordion. noFaq bypasses that sweep
  // entirely and renders every block as plain content.
  noFaq?: boolean;
  // Exact text of level-2 headings that are plain inline <h2> in the
  // original (inside a text-editor widget, not a heading widget) and so
  // inherit the page's dark body colour instead of the primary heading
  // colour. Empty by default — only the caller's explicit list is affected.
  darkHeadings?: string[];
  // Header rows (exact match) of tables that use the site's bare reset.css
  // table styling (bordered cells, bold th, odd-row grey tint) instead of
  // this component's default grey-header/cyan-stripe styling. Empty by
  // default — only the caller's explicit list is affected.
  resetTables?: string[][];
}) {
  const segments = noFaq ? [{ kind: "blocks" as const, blocks }] : segmentBlocks(blocks);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.kind === "faq") {
          if (faqMode === "plain") {
            return (
              <div key={`faq-${i}`} className="my-8">
                {seg.items.map((item) => (
                  <div key={item.q} className="mt-7">
                    <h3 className="text-[22px] font-semibold text-ink">
                      <InlineText text={item.q} />
                    </h3>
                    <p className="mt-2 leading-relaxed text-grey">
                      <InlineText text={item.a} />
                    </p>
                  </div>
                ))}
              </div>
            );
          }
          return (
            <div key={`faq-${i}`} className="my-8">
              <FaqAccordion items={seg.items} questionColor={faqQuestionColor} />
            </div>
          );
        }
        return (
          <div key={`blocks-${i}`}>
            {seg.blocks.map((b, j) => (
              <BlockItem key={j} block={b} darkHeadings={darkHeadings} resetTables={resetTables} />
            ))}
          </div>
        );
      })}
    </>
  );
}

function BlockItem({
  block,
  darkHeadings = [],
  resetTables = [],
}: {
  block: Block;
  darkHeadings?: string[];
  resetTables?: string[][];
}) {
  switch (block.type) {
    case "heading": {
      const text = <InlineText text={block.text} />;
      if (block.level <= 2) {
        const isDark = darkHeadings.includes(block.text);
        return (
          <h2 className={`mt-10 text-[28px] font-semibold ${isDark ? "text-ink" : "text-primary"}`}>{text}</h2>
        );
      }
      if (block.level === 3) {
        return <h3 className="mt-7 text-[22px] font-semibold text-ink">{text}</h3>;
      }
      return <h4 className="mt-5 text-[20px] font-semibold text-ink">{text}</h4>;
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
        <div className="mt-6 text-center">
          <Link
            href={block.href}
            className="inline-block rounded-md bg-secondary px-6 py-3.5 text-xl font-medium text-white transition-colors hover:bg-secondary/90"
          >
            {block.text}
          </Link>
        </div>
      );
    case "table": {
      const [headerRow, ...bodyRows] = block.rows;
      // "Mix Ratio" is right-aligned on the original (the blog post mix-ratio
      // table); every other column stays left-aligned — matched by header
      // text rather than a fixed index, since it's the only column this
      // applies to anywhere on the site.
      const mixRatioCol = headerRow?.indexOf("Mix Ratio") ?? -1;
      const useReset = resetTables.some((h) => JSON.stringify(h) === JSON.stringify(headerRow));
      if (useReset) {
        // Bare reset.css table styling (css/reset.css.css): 1px solid
        // hsla(0,0%,50%,.502) border + 15px padding on every cell, bold th,
        // odd body rows tinted hsla(0,0%,50%,.071) — no grey header fill, no
        // cyan stripe.
        return (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left text-[18px]">
              {headerRow && (
                <thead>
                  <tr>
                    {headerRow.map((cell, j) => (
                      <th
                        key={j}
                        className={`border border-[rgba(128,128,128,0.502)] p-[15px] align-top font-bold leading-[1.5] text-grey ${j === mixRatioCol ? "text-right" : ""}`}
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-[rgba(128,128,128,0.071)]" : ""}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`border border-[rgba(128,128,128,0.502)] p-[15px] align-top leading-[1.5] text-grey ${j === mixRatioCol ? "text-right" : ""}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return (
        <div className="mt-6 overflow-x-auto rounded-lg border border-grey-line">
          <table className="w-full min-w-[480px] border-collapse text-left text-[18px]">
            {headerRow && (
              <thead>
                <tr>
                  {headerRow.map((cell, j) => (
                    <th
                      key={j}
                      className={`border-b border-grey-line bg-[#808080] px-4 py-2.5 font-semibold text-white ${j === mixRatioCol ? "text-right" : ""}`}
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row, i) => (
                <tr key={i} className="odd:bg-tint-cyan-2/50">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`border-b border-grey-line px-4 py-2.5 text-grey ${j === mixRatioCol ? "text-right" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
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
