import Link from "next/link";

// Resolves markdown-style [text](href) inline links from extracted content
// into next/link (internal) or <a> (external/mailto/tel). Plain text passes
// through untouched — content wording is never altered.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function InlineText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  LINK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = LINK_RE.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, label, href] = match;
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={key++} href={href} className="text-primary underline underline-offset-2">
          {label}
        </Link>,
      );
    } else if (href.startsWith("mailto:") || href.startsWith("tel:")) {
      nodes.push(
        <a key={key++} href={href} className="text-primary underline underline-offset-2">
          {label}
        </a>,
      );
    } else {
      nodes.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {label}
        </a>,
      );
    }
    lastIndex = LINK_RE.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return <>{nodes}</>;
}
