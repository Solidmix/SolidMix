import Link from "next/link";

// Resolves markdown-style [text](href) inline links from extracted content
// into next/link (internal) or <a> (external/mailto/tel), and [[b]]...[[/b]]
// markers (added by scripts/enrich-bold.py) into <strong>. Plain text passes
// through untouched — content wording is never altered. Links work both
// outside and inside bold spans. Link colour #cc3366 matches the theme's
// global default link colour (confirmed in the captured reset.css: `a{color:
// #c36}`), measured consistently across every page's parity rows — not
// text-primary, which round 1 had used as the catch-all link colour.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_RE = /\[\[b\]\]([\s\S]*?)\[\[\/b\]\]/g;

function renderLinks(text: string, keyRef: { current: number }): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  LINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, label, href] = match;
    const key = keyRef.current++;
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={key} href={href} className="text-[#cc3366] underline underline-offset-2">
          {label}
        </Link>,
      );
    } else if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      nodes.push(
        <a key={key} href={href} className="text-[#cc3366] underline underline-offset-2">
          {label}
        </a>,
      );
    } else {
      nodes.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#cc3366] underline underline-offset-2"
        >
          {label}
        </a>,
      );
    }
    lastIndex = LINK_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function InlineText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  const keyRef = { current: 0 };
  BOLD_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BOLD_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(...renderLinks(text.slice(lastIndex, match.index), keyRef));
    nodes.push(<strong key={keyRef.current++}>{renderLinks(match[1], keyRef)}</strong>);
    lastIndex = BOLD_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(...renderLinks(text.slice(lastIndex), keyRef));
  return <>{nodes}</>;
}
