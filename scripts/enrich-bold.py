#!/usr/bin/env python3
"""Restores <b>/<strong> emphasis lost when the original site's content was
extracted into src/content/pages/*.json, by wrapping the same phrases with
[[b]]...[[/b]] markers (never **, since some original text already contains
literal ** characters that must stay as plain text).

Idempotent: running it twice reports 0 new markers on the second run, and for
every block it changes, stripping the markers back out reproduces the exact
original block text (only markers are added — no word is ever changed).

Usage: python3 scripts/enrich-bold.py
"""
import json
import re
from html.parser import HTMLParser
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PAGES_DIR = REPO / "src/content/pages"
ORIG_DIR = REPO / "docs/reference/original-site/pages"
HOME_TS = REPO / "src/content/home.ts"

OPEN, CLOSE = "[[b]]", "[[/b]]"
MARKER_RE = re.compile(re.escape(OPEN) + r"(.*?)" + re.escape(CLOSE), re.S)
# Markdown-style [label](href) links (see InlineText.tsx) — phrase-matching
# must never land inside one, or it would corrupt the link's bracket syntax.
MD_LINK_RE = re.compile(r"\[[^\]]+\]\([^)]+\)")
MIN_PHRASE_LEN = 3  # skip near-noise single letters/punctuation


class BoldExtractor(HTMLParser):
    """Collects the text inside every <b>/<strong> element in document order."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack: list[list[str]] = []
        self.phrases: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in ("b", "strong"):
            self.stack.append([])

    def handle_endtag(self, tag):
        if tag in ("b", "strong") and self.stack:
            buf = self.stack.pop()
            text = " ".join("".join(buf).split())
            if text:
                self.phrases.append(text)
            if self.stack:
                self.stack[-1].append(" " + text)

    def handle_data(self, data):
        for buf in self.stack:
            buf.append(data)


def extract_bold_phrases(html: str) -> list[str]:
    parser = BoldExtractor()
    parser.feed(html)
    # Longest first so a longer phrase is wrapped whole before a shorter
    # phrase that happens to be one of its substrings is considered.
    seen = []
    for p in sorted(set(parser.phrases), key=len, reverse=True):
        if len(p) >= MIN_PHRASE_LEN:
            seen.append(p)
    return seen


def split_protected(text: str) -> list[tuple[str, bool]]:
    """Turns text into a list of (segment, protected) where "protected"
    covers both (a) [[b]] spans already wrapped by a previous run — so
    re-running the script never re-matches or nests inside a span it
    already wrapped — and (b) existing [label](href) markdown links, so a
    bold phrase can never land inside one and corrupt its bracket syntax."""
    segments: list[tuple[str, bool]] = []
    pos = 0
    # Merge both kinds of spans in document order.
    spans = [(m.start(), m.end(), m.group(1), True) for m in MARKER_RE.finditer(text)]
    spans += [(m.start(), m.end(), m.group(0), False) for m in MD_LINK_RE.finditer(text)]
    spans.sort(key=lambda s: s[0])
    for start, end, content, is_bold_marker in spans:
        if start < pos:
            continue  # overlapping span (shouldn't happen) — keep the first
        if start > pos:
            segments.append((text[pos:start], False))
        segments.append((content, True) if is_bold_marker else (content, None))
        pos = end
    if pos < len(text):
        segments.append((text[pos:], False))
    if not segments:
        segments.append((text, False))
    return segments


def wrap_phrases(text: str, phrases: list[str]) -> tuple[str, int]:
    """Wraps every still-unwrapped, unprotected occurrence of each phrase
    with [[b]]...[[/b]]. Returns (new_text, markers_added).

    Each segment is (text, state): state True = already [[b]]-wrapped,
    None = inside an existing markdown link (protected, never touched),
    False = plain text eligible for wrapping.
    """
    segments = split_protected(text)
    added = 0
    for phrase in phrases:
        next_segments: list[tuple[str, object]] = []
        for seg_text, state in segments:
            if state is not False or phrase not in seg_text:
                next_segments.append((seg_text, state))
                continue
            remaining = seg_text
            parts: list[tuple[str, object]] = []
            while True:
                idx = remaining.find(phrase)
                if idx == -1:
                    if remaining:
                        parts.append((remaining, False))
                    break
                if idx > 0:
                    parts.append((remaining[:idx], False))
                parts.append((phrase, True))
                added += 1
                remaining = remaining[idx + len(phrase) :]
            next_segments.extend(parts)
        segments = next_segments
    new_text = "".join(f"{OPEN}{t}{CLOSE}" if s is True else t for t, s in segments)
    return new_text, added


def strip_markers(text: str) -> str:
    return text.replace(OPEN, "").replace(CLOSE, "")


def enrich_block_field(text: str, phrases: list[str]) -> tuple[str, int]:
    original = text
    new_text, added = wrap_phrases(text, phrases)
    if added:
        assert strip_markers(new_text) == original, (
            "enrich-bold.py produced a text change beyond markers: " f"{original!r} -> {new_text!r}"
        )
    return new_text, added


def enrich_json_page(json_path: Path, phrases: list[str]) -> int:
    data = json.loads(json_path.read_text(encoding="utf-8"))
    total = 0
    for block in data.get("blocks", []):
        btype = block.get("type")
        if btype in ("heading", "p") and isinstance(block.get("text"), str):
            new_text, added = enrich_block_field(block["text"], phrases)
            if added:
                block["text"] = new_text
                total += added
        elif btype == "list" and isinstance(block.get("items"), list):
            new_items = []
            changed = False
            for item in block["items"]:
                if isinstance(item, str):
                    new_text, added = enrich_block_field(item, phrases)
                    if added:
                        changed = True
                        total += added
                    new_items.append(new_text)
                else:
                    new_items.append(item)
            if changed:
                block["items"] = new_items
    if total:
        json_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return total


# home.ts: only the two plain (non dangerouslySetInnerHTML) body fields that
# measurement showed had lost bold phrases (buildTogether.body, coreSkills.body).
# Matched by field name via a narrow regex so no other string in the file can
# ever be touched, and the whole-file assert still guards against surprises.
HOME_TS_FIELDS = ["buildTogether", "coreSkills"]


def enrich_home_ts(phrases: list[str]) -> int:
    if not HOME_TS.exists():
        return 0
    src = HOME_TS.read_text(encoding="utf-8")
    original_src = src
    total = 0
    for field in HOME_TS_FIELDS:
        block_m = re.search(rf"export const {field} = \{{.*?\n\}};", src, re.S)
        if not block_m:
            continue
        block = block_m.group(0)
        body_m = re.search(r'body:\s*\n?\s*"((?:[^"\\]|\\.)*)"', block)
        if not body_m:
            continue
        value = body_m.group(1)
        new_value, added = enrich_block_field(value, phrases)
        if added:
            total += added
            new_block = block[: body_m.start(1)] + new_value + block[body_m.end(1) :]
            src = src[: block_m.start()] + new_block + src[block_m.end() :]
    if total:
        assert strip_markers(src) == original_src, "enrich-bold.py changed more than markers in home.ts"
        HOME_TS.write_text(src, encoding="utf-8")
    return total


def main():
    grand_total = 0
    pages_touched = 0
    for json_path in sorted(PAGES_DIR.glob("*.json")):
        slug = json_path.stem
        html_path = ORIG_DIR / slug / "page.html"
        if not html_path.exists():
            continue
        html = html_path.read_text(encoding="utf-8", errors="ignore")
        phrases = extract_bold_phrases(html)
        if not phrases:
            continue
        count = enrich_json_page(json_path, phrases)
        if count:
            print(f"{slug}: {count} bold marker(s) added")
            grand_total += count
            pages_touched += 1

    home_html_path = ORIG_DIR / "home" / "page.html"
    if home_html_path.exists():
        phrases = extract_bold_phrases(home_html_path.read_text(encoding="utf-8", errors="ignore"))
        count = enrich_home_ts(phrases)
        if count:
            print(f"home.ts: {count} bold marker(s) added")
            grand_total += count
            pages_touched += 1

    print(f"TOTAL: {grand_total} new bold marker(s) across {pages_touched} file(s)")


if __name__ == "__main__":
    main()
