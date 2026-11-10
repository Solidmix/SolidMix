// Typed access to the extracted page content (src/content/pages/*.json) plus
// shared helpers used by PageHero/BlockRenderer/CardGrid across Batch B2 pages.
// Content is copied exactly from the original site; these helpers only
// restructure JSON blocks for rendering, they never change wording.

import { readFileSync } from "node:fs";
import path from "node:path";

export type HeadingBlock = { type: "heading"; level: number; text: string };
export type ParaBlock = { type: "p"; text: string };
export type ListBlock = { type: "list"; items: string[] };
export type ImageBlock = {
  type: "image";
  src: string;
  source?: string;
  alt: string;
  href?: string;
};
export type LinkBlock = { type: "link"; text: string; href: string };
export type ButtonBlock = { type: "button"; text: string };
export type TableBlock = { type: "table"; rows: string[][] };
export type EmbedBlock = { type: "embed"; src: string };
export type FormBlock = { type: "form"; [key: string]: unknown };
export type LabelBlock = { type: "label"; text?: string };

export type Block =
  | HeadingBlock
  | ParaBlock
  | ListBlock
  | ImageBlock
  | LinkBlock
  | ButtonBlock
  | TableBlock
  | EmbedBlock
  | FormBlock
  | LabelBlock;

export type PageKind =
  | "home"
  | "page"
  | "product"
  | "team-member"
  | "post"
  | "category"
  | "author";

export type PageContent = {
  slug: string;
  path: string;
  kind: PageKind;
  title: string;
  description?: string;
  canonicalOriginal?: string;
  blocks: Block[];
  h1: string;
  // Present on "post" kind JSON only.
  category?: string;
  date?: string;
  excerpt?: string;
  featuredImage?: ImageBlock;
  // Present on pages that embed a self-hosted video (contact, calculator).
  videos?: string[];
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/pages");

export function getPageContent(slug: string): PageContent {
  const raw = readFileSync(path.join(CONTENT_DIR, `${slug}.json`), "utf8");
  return JSON.parse(raw) as PageContent;
}

// A handful of pages (e.g. legal.json) were authored with no true H1 in the
// original markup — SEO requires exactly one, so fall back to the first
// heading block, then the <title>, in that order. Never invents new text.
export function resolvePageH1(content: PageContent): string {
  if (content.h1 && content.h1.trim()) return content.h1.trim();
  const first = content.blocks.find((b) => b.type === "heading") as HeadingBlock | undefined;
  return first ? stripBoldMarkers(first.text) : content.title;
}

const BREADCRUMB_HEADING_RE = /^\[?Home\s*[/-]/i;
const TRUCK_IMAGE_MARK = "whatsapp-image-2026-06-16-at-3-43-53-pm-removebg-preview";

export function isBreadcrumbHeading(b: Block): boolean {
  return b.type === "heading" && BREADCRUMB_HEADING_RE.test(b.text);
}

export function isTruckImage(b: Block): boolean {
  return b.type === "image" && b.src.includes(TRUCK_IMAGE_MARK);
}

/**
 * Removes the breadcrumb heading block ("[Home / X](/)"), the mixer-truck
 * graphic, and the first heading matching the page H1 — PageHero renders all
 * three already, so BlockRenderer/CardGrid never see them twice.
 */
export function stripChrome(blocks: Block[], pageH1: string): Block[] {
  const out: Block[] = [];
  let h1Consumed = false;
  for (const b of blocks) {
    if (!h1Consumed && b.type === "heading" && stripBoldMarkers(b.text) === pageH1) {
      h1Consumed = true;
      continue;
    }
    if (isBreadcrumbHeading(b)) continue;
    if (isTruckImage(b)) continue;
    out.push(b);
  }
  return out;
}

export type FaqItem = { q: string; a: string };
export type Segment = { kind: "blocks"; blocks: Block[] } | { kind: "faq"; items: FaqItem[] };

function isQuestionHeading(b: Block): b is HeadingBlock {
  if (b.type !== "heading") return false;
  // Strip [[b]] markers before testing: a bold-enriched question heading
  // (e.g. "[[b]]Q: ...?[[/b]]") must still be recognised as a question.
  const text = stripBoldMarkers(b.text);
  return /\?\s*$/.test(text) || /^Q:/i.test(text);
}

/**
 * Splits a block list into plain-render runs and FAQ runs. A heading that
 * reads as a question (ends with "?" or starts with "Q:") followed by
 * paragraph(s) becomes one FAQ item; a contiguous run of such items becomes
 * one <FaqAccordion> segment (and feeds FAQPage JSON-LD).
 */
export function segmentBlocks(blocks: Block[]): Segment[] {
  const segments: Segment[] = [];
  let plain: Block[] = [];
  let i = 0;

  const flushPlain = () => {
    if (plain.length) {
      segments.push({ kind: "blocks", blocks: plain });
      plain = [];
    }
  };

  while (i < blocks.length) {
    const b = blocks[i];
    if (isQuestionHeading(b)) {
      const items: FaqItem[] = [];
      while (i < blocks.length && isQuestionHeading(blocks[i])) {
        const q = (blocks[i] as HeadingBlock).text;
        i += 1;
        const answerParts: string[] = [];
        while (i < blocks.length && blocks[i].type === "p") {
          answerParts.push((blocks[i] as ParaBlock).text);
          i += 1;
        }
        items.push({ q, a: answerParts.join(" ") });
      }
      flushPlain();
      segments.push({ kind: "faq", items });
      continue;
    }
    plain.push(b);
    i += 1;
  }
  flushPlain();
  return segments;
}

export function getFaqItems(blocks: Block[]): FaqItem[] {
  return segmentBlocks(blocks)
    .filter((s): s is { kind: "faq"; items: FaqItem[] } => s.kind === "faq")
    .flatMap((s) => s.items);
}

export type Card = {
  image?: ImageBlock;
  title: string;
  titleHref?: string;
  body?: string;
};

const MD_LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;

/**
 * Groups a flat block run into cards of the shape [image?] heading [p?] —
 * the repeating pattern behind the team grid, product grid, and service icon
 * grid widgets on the original site. Anything that doesn't fit the pattern is
 * skipped by the caller (callers pass in a pre-sliced run of only card blocks).
 */
export function extractCards(blocks: Block[]): Card[] {
  const cards: Card[] = [];
  let i = 0;
  while (i < blocks.length) {
    let image: ImageBlock | undefined;
    if (blocks[i]?.type === "image") {
      image = blocks[i] as ImageBlock;
      i += 1;
    }
    if (blocks[i]?.type === "heading") {
      const heading = blocks[i] as HeadingBlock;
      i += 1;
      let title = heading.text;
      let titleHref: string | undefined;
      const m = MD_LINK_RE.exec(heading.text);
      if (m) {
        title = m[1];
        titleHref = m[2];
      }
      let body: string | undefined;
      if (blocks[i]?.type === "p") {
        body = (blocks[i] as ParaBlock).text;
        i += 1;
      }
      cards.push({ image, title, titleHref, body });
    } else {
      i += 1;
    }
  }
  return cards;
}

export function findFirstImage(blocks: Block[]): ImageBlock | undefined {
  return blocks.find((b): b is ImageBlock => b.type === "image");
}

export function parseMdLink(text: string): { label: string; href?: string } {
  const m = MD_LINK_RE.exec(text);
  return m ? { label: m[1], href: m[2] } : { label: text };
}

// Removes the [[b]]/[[/b]] bold markers added by scripts/enrich-bold.py
// (rendered as <strong> by InlineText) — for plain-text contexts such as
// meta descriptions and JSON-LD where no markup should ever appear.
export function stripBoldMarkers(text: string): string {
  return text.replace(/\[\[b\]\]|\[\[\/b\]\]/g, "");
}
