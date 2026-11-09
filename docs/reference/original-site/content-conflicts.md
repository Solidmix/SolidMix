# Content Conflicts — Original Site

Captured 2026-11-09 from https://solidmixrmc.com/ (GET-only reference capture). Every item below is a place where the live site contradicts itself or contains a data-entry error. Exact quotes are copied verbatim, including typos. These are flagged for Saidul's decision — do NOT "fix" silently in the replica without approval, but the replica should use one consistent value per field.

## 1. Phone numbers

- **Primary (site-wide):** `+91 9893111201` — appears in the top bar, footer, and ~800+ times across pages. This is the canonical number.
- **Stray second number on Contact page only:** on `/ready-mix-concrete-contact-in-raipur/` the two numbers are concatenated with no separator:
  - Quote (content.md line 308): `+91 9893111201+91 9111109642`
  - `+91 9111109642` appears **once on the entire site** and only here. Likely an unlabelled alternate/secondary line rendered without spacing.
  - ACTION NEEDED: confirm with Saidul whether `9111109642` is a real secondary number and, if so, label it ("Sales", "Alt") and space it correctly.

## 2. PIN codes / addresses (two real locations — not a true conflict, but formatted inconsistently)

The company has two addresses that both appear in the footer on nearly every page:

- **Plant:** `PH No. 77, Khasra No. 365/5, Serikhedi, Raipur, Chhattisgarh – 492101`
- **Office:** `Office no.418, 4th floor, Lalganga Business Park, Pachpedi Naka, Raipur, C.G. 492001`

Because both appear together, **134 pages contain `492101` and 33 pages contain `492001`** — this is expected, not a contradiction. The real problems are formatting inconsistencies:

- Plant address is written at least three different ways:
  - `PH No. 77, Khasra No. 365/5, Serikhedi, Raipur, Chhattisgarh – 492101`
  - `PH. NO. 77,KH. NO. 365/5Serikhedi, Raipur, Chhattisgarh, 492101` (missing spaces/commas)
  - `Ph.no.77, Kh.no.365/5, Serikhedi, Raipur, Chhattisgarh 492101`
- Office address on the Contact page has a run-together typo (content.md line 448):
  - `Address : Office no.418, 4th floor, Lalganga Business ParkPachpedi naka Raipur C.G Pin code 492001`
  - "Business Park" and "Pachpedi" are joined with no space; "naka" lowercased.
- ACTION NEEDED: standardise ONE canonical string for each of the plant and office addresses and reuse it everywhere in the replica.

## 3. Concrete grade range

The headline grade range is inconsistent across the site:

- Meta description + hero (site-wide, 30 occurrences): **"M20 to M40"**
- One page states **"M15 to M40"**
- One page states **"M10 to M40"**
- Body copy also references M10, M15, M30, M35, M45, M50 in various places (M25 appears 108 times, M40 72 times, M35 35 times, M50 once, M45 once).
- ACTION NEEDED: confirm the actual offered range with Saidul and use one consistent headline (likely "M20 to M40") while keeping specific grades only where technically accurate.

## 4. Founding / "since" year

- `since 2023` appears **30 times** and is consistent across the site. No conflict found — recorded here as the authoritative establishment year for the replica (verify with Saidul).

## 5. Email addresses

- `info@solidmixrmc.com` — primary, ~839 occurrences.
- `support@solidmixrmc.com` — appears 32 times (Privacy/Legal pages).
- One run-together typo observed: `info@solidmixrmc.comsupport` (an `info@` and a following `support` with no separator in rendered text).
- ACTION NEEDED: both addresses appear intentional (general vs support); fix the run-together rendering in the replica.

## Notes / method

- "Occurrence" counts come from grepping the captured `content.md` files, which include header/footer text repeated on every page; treat counts as a signal of where a value lives (footer vs body), not as independent mentions.
- No contradictions were found in company name ("SolidMix RMC" / "Solid Mix"), city (Raipur), or state (Chhattisgarh) beyond casing/spacing.
