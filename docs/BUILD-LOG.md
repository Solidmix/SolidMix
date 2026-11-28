# Build log — Book Us page (seo-kit Phase 5B/5C)

Branch `seo-build`. Design: `docs/superpowers/specs/2026-11-21-book-us-page-design.md` (Build 1 backend, Build 2 frontend).

Removed Purnendu Poddar per client request (2026-11-23); old URLs redirect to /our-team/.

## Build 1 (backend/data layer)

- `src/data/plants.ts`, `src/data/bookingOptions.ts`, `src/lib/leadId.ts`, `src/lib/validateBooking.ts` copied from `seo-kit/contact-form/src/` unchanged (plants.ts adds optional `mapLink`/`mapQuery` per plant, from Ma'am's confirmed map links and the resolved Plant 2 coordinate pair; no plant/area data changed).
- `src/lib/leadStore.ts` implemented against Convex (`convex/leads.ts`, new `leads` table in `convex/schema.ts`). `notifyTeam` is a documented no-op — no email/WhatsApp; a CRM will be connected later (Ma'am, 2026-11-21).
- `src/app/api/book-us/route.ts` copied from the kit unchanged.
- `CLAUDE.md` appended with an `@seo-kit/00-CLAUDE-BUILD-BRIEF.md` import line; nothing else in it changed.
- Pushed to the Convex **dev** deployment (`small-squid-55`) only. No production deploy.

## Build 2 (frontend)

- `src/components/book-us/BookUsForm.tsx`, `PlantCards.tsx` copied from the kit, restyled to the site's existing theme tokens (`primary`, `secondary`, `ink`, `grey-line`, `grey-2`, `tint-cyan-2`, `tint-pink`) and to match `ContactForm.tsx`'s look. Every field, label, option, helper text, status line, validation message, the "Use my location" behaviour, the honeypot, the Lead ID confirmation state and the `dataLayer` push are unchanged from the kit. `PlantCards` now reads `plant.mapQuery`/`plant.mapLink` (added in Build 1) for the map embed and the "Open in Google Maps" link.
- `src/app/ready-mix-concrete-contact-in-raipur/page.tsx` merged (same URL kept): H1 "Contact SolidMix RMC in Raipur" and metadata title/description from `01-seo-meta.csv`'s contact row (fixes the pre-existing duplicated-brand title bug); kit order (answer line + Call/WhatsApp, booking form, plant cards, FAQ, JSON-LD); then the existing Phone Number card, Office Email card (now `info@solidmixrmc.com` only — `support@` dropped from this page, the array itself in `site.ts` is untouched since Footer/TopBar already only use its first entry), Office Address card, office map, and the CEO video section kept exactly as they were. Removed from the page: the old `ContactForm`, the "Working Hour / We Are Open 24*7" card, and the old single plant-address card + old plant map (replaced by `PlantCards`).
- `/appointments/` removed: deleted `src/app/appointments/page.tsx`, `src/components/forms/AppointmentForm.tsx`, `src/content/pages/appointments.json`, and its `src/content/index.json` entry. Added 3 permanent redirects in `next.config.ts` (`/appointments/`, `/appointment/`, `/book-appointment/` → the contact page). Removed `/appointments/` from `src/app/sitemap.ts`, `public/llms.txt`, the revalidate allow-list in `src/app/api/revalidate-blog/route.ts`, and the path lists in `PostEditor.tsx`/`BlogTab.tsx`. `src/content/site.ts`'s Contact Us dropdown now reads Book Us (→ the contact page) + Careers, replacing the old Appointments entry. `convex/`'s `appointments` table and `submitAppointment` mutation are untouched — historical records stay.
- `tsconfig.json`: added `"seo-kit"` to `exclude` so the read-only kit's own reference files aren't type-checked as part of this build.
- Fix: added the Phase 5B "Nearest plant" helper text ("Choose the plant nearest your site. Our team will confirm availability.") under the plant select in `BookUsForm.tsx` — missing from the kit's own `BookUsForm.tsx`, required by `00-CLAUDE-BUILD-BRIEF.md` Phase 5B.

## Phase 0 — baseline (menu/metadata workstream, 2026-11-23)

Inspected before Phase 1/2 work (seo-kit brief Phase 0). Branch `seo-build`, HEAD `a11de3c`.

- Stack: Next.js 15.5.29 (App Router), React 19, Tailwind CSS v4, Convex ^1.48.0, Poppins via `next/font/google` (`src/app/layout.tsx`). No new dependencies.
- `npm run build`: succeeded, 85 routes. Static (`○`): Home, product overview, 12 product pages, About, Our Team, Services, Our Work, Safety, Gallery, Legal, Privacy, Blog index, Contact (Book Us), Careers, Calculator, robots.txt, sitemap.xml, icons. SSG (`●`, `generateStaticParams`): `/[post]` (36 posts), `/category/[cat]` (3), `/category/[cat]/page/[n]` (3 paginated), `/our-team/[slug]` (6 members). Dynamic (`ƒ`): `/api/book-us`, `/api/revalidate-blog`, `/api/revalidate-gallery`.
- Warnings: only the 3 pre-existing `@typescript-eslint/no-unused-vars` warnings in `src/lib/leadStore.ts` (`notifyTeam`'s unused params, inherited from the kit's own stub signature) — no new warnings.
- `noindex`/robots source: `src/app/robots.ts` returns `disallow: "/"` unless `process.env.INDEXING === "on"`; `src/app/layout.tsx`'s root `metadata.robots` uses the same `INDEXING` env var for `index`/`follow`. `INDEXING` is not set to `"on"` in this environment, so the current build is correctly in review/noindex mode. Neither is touched by Phase 1/2 work (brief hard rule #2 — launch is a human step).
- `next.config.ts` already has `trailingSlash: true` (set in Build 1/earlier batches) — Phase 2's requirement is already met, nothing to duplicate.
- Theme tokens confirmed present in `src/app/globals.css`: `primary` `#9f1481`, `secondary` `#167484`, `ink` `#292929`, `grey-line` `#dad8d8`, `tint-pink` `#ffd7f6`, `tint-cyan` `#dff9fd` — match the brief's Phase 0 list exactly.
- Current header/footer: `src/components/Header.tsx` + `src/components/TopBar.tsx` (desktop dropdown + mobile drawer, driven by `src/content/site.ts`'s `menu` array) and `src/components/Footer.tsx` (logo, blurb, `footerUsefulLinks`, Phone/Email/Office/Plant address blocks, no WhatsApp link, no Products/Calculator/Projects/Guides/Team/Legal Information links, copyright line hardcoded to "2025" not dynamic) — these are what Phase 1 replaces/extends.

## Phase 2 — metadata (2026-11-23)

Root layout already had `metadataBase`, `title.template: "%s | SolidMix RMC"`, a default title, and `trailingSlash: true` (set in earlier batches) — confirmed, not duplicated.

New `src/content/seoMeta.ts`: one override map, keyed by path, holding `01-seo-meta.csv`'s `title_base`/`description`/`h1` for every CSV row that is both (a) live in this build and (b) not a blog post (blog posts keep `generateMetadata` using the post's own description, unchanged) and not a planned page. `src/lib/seo.ts`'s `pageMetadata()` now reads this map first, falling back to the scraped content JSON's title/description when no row exists — this fixed every page that uses `pageMetadata()` centrally, with no edits to any content JSON. A new `resolveDisplayH1(path, originalH1)` helper does the same for the on-page `<h1>` only; every page still passes its own original (scrape-derived) H1 to `stripChrome()` so the duplicate heading is still correctly removed from the body.

Confirmed empirically (before and after, via the built `.next/server/app/*.html` output):
- Fixed 5 real "SolidMix RMC | SolidMix RMC" duplicates: `/rmc-gallery-in-raipur/`, `/concrete-blog-in-raipur/`, `/trusted-concrete-supplier-in-raipur/`, `/rmc-services-in-raipur/`, `/ready-mix-concrete-in-raipur/`.
- Fixed the weak legacy titles the CSV flagged ("Standard Concrete - Solidmixrmc", "Safety - Solidmixrmc", "Privacy Policy - Solidmixrmc", "Concrete 101 - Solidmixrmc", etc.) across all 27 overridden pages.
- Found and fixed a real H1 bug in `src/components/CategoryListing.tsx` (not explicitly flagged in the brief): it rendered `` `Category: ${def.label}` `` — prepending "Category: ", which is not in the CSV's `h1` column at all — and `def.label` for `/category/rmc-plant/` was "Rmc Plant" (wrong casing, from the original scrape). Now renders the override's exact H1: "Concrete 101", "Construction", "RMC Plant".
- Home (`src/app/page.tsx`, own metadata, not via `pageMetadata()`): title and description replaced with the CSV's row-1 text (title no longer gets the template suffix, same as before — confirmed in the built HTML). `src/content/home.ts`'s `hero.h1` (the on-page `<h1>`) changed from the long scrape title to the CSV's "Ready Mix Concrete in Raipur"; the subtitle underneath is untouched (see the body-copy list below).
- Root layout's fallback `description` (`src/app/layout.tsx`) replaced with the same clean Home description — it contained the "24/7"/"M20 to M40" sentence and is the sitewide fallback, so Phase 2's "default title" checklist item extended naturally to it.
- Book Us page (`/ready-mix-concrete-contact-in-raipur/`) metadata confirmed unchanged and already matching the CSV exactly (set in the Phase 5C build) — title "Contact SolidMix RMC Raipur | SolidMix RMC" (single brand), description verbatim from the CSV.
- 2 rows have no description override: `/rmc-services-in-raipur/` and `/safety/` — their CSV `meta_description` contains a `[CLIENT TO CONFIRM ...]` placeholder (service list / safety practices), which hard rule #1 forbids publishing. Both pages' title/H1 were still fixed; their description stays whatever the content JSON already produces, unchanged.

**CSV descriptions outside 120–155 characters** (per your instruction: used exactly as the CSV has them, not rewritten):
`/ready-mix-concrete-in-raipur/self-compacting-concrete-in-bhanpuri-raipur/` (119), `/lightweight-concrete-in-sejbahar-raipur/` (107), `/steel-fiber-concrete/` (100), `/pp-fiber-concrete-in-kumhari-raipur/` (110), `/waterproof-concrete-in-mandir-hasaud-raipur/` (93), `/heat-resistant-concrete-2/` (106), `/permeable-concrete-in-kotni-raipur/` (103), `/eco-friendly-concrete-in-saddu-raipur/` (112), `/stamped-concrete-in-atal-nagar-raipur/` (91), `/bagged-concrete-in-farfaud-raipur/` (81); `/our-work/` (78); `/rmc-gallery-in-raipur/` (71); `/concrete-blog-in-raipur/` (109); `/category/concrete-101/` (53), `/category/construction/` (47), `/category/rmc-plant/` (52); `/trusted-concrete-supplier-in-raipur/` (105); `/our-team/` (107); `/careers/` (47); `/privacy-policy/` (65); `/legal/` (53); `/ready-mix-concrete-contact-in-raipur/` (98, already live since the Phase 5C build, listed here for completeness).

**"24/7" / "M20 to M40" — full occurrence list (2026-11-23).** Metadata occurrences (3) are fixed in this commit. Every other occurrence is **visible body copy** and is listed only — nothing below is changed without a separate OK:

Fixed (metadata):
- `src/app/page.tsx:28,33` — Home's `description`/`openGraph.description`: *"RMC Plant in Raipur – SolidMix RMC delivers premium M20 to M40 ready mix concrete with 24/7 supply across Raipur, Naya Raipur & Chhattisgarh. Trusted for quality, strength, and on-time delivery. Call +91 9893111201"* — replaced with the CSV text.
- `src/app/layout.tsx:31` — root fallback `description`, same sentence — replaced with the same CSV text.

Pending (body copy, not changed):
1. `src/content/home.ts:14` — hero subtitle: *"Raipur's #1 ready mix concrete plant delivering M20 to M40 grade high-strength concrete directly to your construction site — 24×7 delivery, zero compromise on quality."*
2. `src/content/home.ts:148` — Home FAQ answer: *"We supply M20, M25, M30, M35, and M40 grade ready mix concrete. Free consultation is available to help you choose the right grade for your project."*
3. `src/content/home.ts:179` — `hours: "24*7 Hours Open"` (Home "Working hours" section)
4. `src/content/pages/home.json:16` — same sentence as #1 (raw scrape; `home.ts` is the rendered source)
5. `src/content/pages/home.json:301` — *"We supply M20, M25, M30, M35, and M40 grade ready mix concrete. [Free consultation](/appointments/) is available..."* (also has the already-flagged `/appointments/` link, content-locked)
6. `src/content/pages/home.json:363` — *"24*7 Hours Open"* (raw scrape dup of #3)
7. `src/content/pages/our-work.json:69` — *"24/7 Quality Service"* (Our Work feature/tab label)
8. `src/components/work/WorkTabs.tsx:27` — `"24/7 Quality Service": ClockIcon` (code mapping key tied to #7 — would need updating together)
9. `src/content/pages/legal.json:93` — *"24/7 On Time Support"* (Legal page body — part of the mismatched-widget content already noted in `current-state.md`)
10. `src/content/pages/rmc-services-in-raipur.json:58` — *"24x7 On-Time Concrete Delivery"* (RMC Services feature list)
11. `src/content/pages/trusted-concrete-supplier-in-raipur.json:61` — *"24/7 On-Time Support"* (About page flip-card back text)
12. `src/content/pages/trusted-concrete-supplier-in-raipur.json:287` — *"We supply M15, M20, M25, M30, M35, and M40 grade concrete, as well as custom mixes for specialized structural requirements."*
13. `src/content/pages/trusted-concrete-supplier-in-raipur.json:314` — same FAQ sentence as #5, also has the `/appointments/` link
14. `src/content/pages/ready-mix-concrete-in-raipur.json:212` — *"SolidMix Standard Concrete Mix is available in M15, M20, M25, M30, M35, and M40 grades..."* (Standard Concrete product page body — directly conflicts with the M5–M80 grade list already confirmed for the Book Us form)
15. `src/content/pages/ready-mix-concrete-contact-in-raipur.json:49` — *"We Are Open 24*7 ‎"* — dead text: this card was already removed from rendering in the Phase 5C Book Us merge, but the sentence still sits in the JSON
16. `src/app/rmc-gallery-in-raipur/page.tsx:34` — image `alt` text: *"Night-time ready mix concrete delivery by SolidMix RMC — 24x7 availability"*

Not a publishing concern: `src/data/bookingOptions.ts:13` is a code comment ("...the website says M20-M40") — accurate and intentional, not published anywhere.

## Waiting for client

- **Grade list wording**: this form offers M5–M80 (per Ma'am's 2026-11-21 answer and the kit); other existing pages on the site still say "M20 to M40". Not changed elsewhere in this build — flagged as a site-wide inconsistency for a future pass. See the full body-copy list in Phase 2 above — items 1, 2, 5, 12, 13, 14 are the M20–M40 claims specifically.
- **Browser pin check**: Plant 1 (Serikhedi) and Plant 3 (Mana) map links are `share.google` short links that only resolve via a real browser (confirmed not resolvable with `curl` during the audit). Saidul checks all 3 pins before launch, per the kit's own README-PLACEMENT.md step 6 — confirm Plant 3 is not the forbidden Plus Code `5PJ6+FHJ`.
- **CSV descriptions outside 120–155 characters**: used as-is per instruction (list above) — not rewritten; flag if any should be tightened later.

## "24/7" body-copy removal (2026-11-23)

Per hard rule #1, removed only the "24/7" claim words (no rewriting, no added words) from items 1, 3, 9, 10, 11, 16 of the Phase 2 list above:
1. `src/content/home.ts` hero subtitle — *"...delivering M20 to M40 grade high-strength concrete directly to your construction site — 24×7 delivery, zero compromise on quality."* → *"...delivering high-strength concrete directly to your construction site, zero compromise on quality."*
2. `src/content/home.ts` `contactBlock` + `src/app/page.tsx` — removed the "Working Hours" / "24*7 Hours Open" heading+value pair entirely (both the JSX block and the `hoursHeading`/`hours` fields); no empty box left.
3. `src/content/pages/our-work.json` + `src/components/work/WorkTabs.tsx` — "24/7 Quality Service" → "Quality Service" (icon mapping key updated to match, icon still shows).
4. `src/content/pages/legal.json` — "24/7 On Time Support" → "On Time Support". `src/content/pages/rmc-services-in-raipur.json` — "24x7 On-Time Concrete Delivery" → "On-Time Concrete Delivery". `src/content/pages/trusted-concrete-supplier-in-raipur.json` — "24/7 On-Time Support" → "On-Time Support".
5. `src/app/rmc-gallery-in-raipur/page.tsx` image alt — *"Night-time ready mix concrete delivery by SolidMix RMC — 24x7 availability"* → *"Night-time ready mix concrete delivery by SolidMix RMC"*.

Not touched, as instructed: the grade sentences (list items 2, 5, 12, 13, 14) and the raw/dead JSON copies (items 4, 6, 15 — `home.json`'s duplicate scrape text and the dead Book Us "We Are Open 24*7" line).

- **Waiting for client — grade sentences**: Home FAQ (`home.ts:148`), About FAQ (`trusted-concrete-supplier-in-raipur.json:314`) and the Standard Concrete product page (`ready-mix-concrete-in-raipur.json:212`) still say M15/M20–M40, while Ma'am confirmed M5–M80 for the Book Us form (2026-11-21) — needs a decision on which grade list the site states.

## Remaining "24×7" claims removed (2026-11-23)

The verification grep's original regex (`24/7|24\*7|24x7`) missed the "×" multiplication-sign character, so these 4 were found only on re-check with `24\s*[*/x×]\s*7`. Fixed the same way — claim words only, nothing else changed:
1. `src/content/home.ts:93` (FAQ answer) — *"...within 60–90 minutes. Available 24×7, including weekends and public holidays."* → *"...within 60–90 minutes. Available, including weekends and public holidays."*
2. `src/content/home.ts:159` (FAQ answer) — *"Yes. We operate 24×7, 365 days a year — including Sundays, Diwali, and all public holidays..."* → *"Yes. We operate 365 days a year — including Sundays, Diwali, and all public holidays..."* ("365 days a year" is a separate claim, not "24×7"-shaped, left untouched per scope)
3. `public/llms.txt:13` — *"- Hours: Open 24×7, every day"* — whole line removed (it was only an hours claim).
4. `src/content/pages/ready-mix-concrete-in-raipur.json:222` — *"...Precision batching, guaranteed grades, and 24×7 delivery support."* → *"...Precision batching, guaranteed grades, and delivery support."* (the M-grade sentence on the same page, line 212, left untouched).

Re-ran `grep -rniE "24\s*[*/x×]\s*7|M20 to M40" src public` after this round: only code comments and the already-flagged raw/dead copies remain (`home.json:6,16,177,319,363` — the scrape duplicate of content now fixed in `home.ts`/the "Working Hours" box that no longer renders — and `ready-mix-concrete-contact-in-raipur.json:49`, the dead Book Us line). Nothing live and unaddressed remains.

## Phase 3 — structured data (2026-11-23)

- `src/components/CategoryListing.tsx` was the only template missing `BreadcrumbList` JSON-LD (every other page already had it, confirmed by a repo-wide grep before changing anything). Added it with the same items as the page's existing visible `PageHero` breadcrumb (Home / Blog / category label) — shared by both `/category/[cat]/` and `/category/[cat]/page/[n]/` since they both render this component.
- `src/lib/seo.ts`: `organizationLd()` + `localBusinessLd()` (two separate top-level entities, no shared `@id`) merged into one `organizationLd()` returning `[Organization+LocalBusiness @id https://solidmixrmc.com/#organization, WebSite @id .../#website referencing it]`. `src/app/page.tsx` updated to spread it (`...organizationLd()`); `localBusinessLd` removed (no other callers). Still only one Organization block on the whole site.
- **Removed `areaServed` name**: `"Pachpedi Naka"` — not present in `src/data/plants.ts`'s client-confirmed `areaGroups` (which this task's instruction set as the filter for the LocalBusiness JSON-LD areaServed list). It stays untouched in the office-address body copy (`home.ts`, `site.ts`, etc.) — only the JSON-LD list was pruned. All other existing names (Raipur, Naya Raipur, Atal Nagar, Bhilai, Durg, Kumhari, Charoda, Mandir Hasaud, Tatibandh, Telibandha, Shankar Nagar, Mowa, Pandri, Tikrapara, Chhattisgarh) are each present verbatim or as part of a confirmed compound name (e.g. "Naya Raipur (Atal Nagar)") somewhere in `plants.ts`, so kept.
- Product pages checked against the brief: already had Product + BreadcrumbList + conditional FAQPage (only when the page has visible FAQs) since an earlier batch — no change needed.
- Added `webApplicationLd()` to `src/lib/seo.ts` (from `seo-kit/schema/article-and-webapp.json`'s confirmed fields: name, url, applicationCategory, operatingSystem, a 0 INR offer since the tool is genuinely free, publisher referencing the organization `@id`) and wired it into `src/app/calculator/page.tsx` alongside the existing BreadcrumbList.

## Phase 4 — robots, sitemap, indexing switch (2026-11-23)

- `src/app/robots.ts` and `src/app/layout.tsx`'s root `metadata.robots`: replaced the old `INDEXING === "on"` env check (only reference to `INDEXING` in the repo) with `process.env.VERCEL_ENV === "production" && process.env.SITE_INDEXABLE === "true"`, per the brief's Phase 4. When indexable: `allow: "/"`, `disallow: ["/api/", "/mi-team-dashboard-7q4x/"]`, a separate rule allowing GPTBot/OAI-SearchBot/ChatGPT-User/PerplexityBot/Google-Extended/Bingbot, plus the sitemap line. Otherwise `Disallow: /` and `{ index: false, follow: false }`, same as before. No static `public/robots.txt` existed, so nothing to delete.
- `src/app/sitemap.ts` already builds its route list from the same page data as the routes (no dashboard, no `/api/`, no thank-you states) — confirmed unchanged, nothing to fix.
- Verified empirically: plain `npm run build` → `robots.txt` = `Disallow: /`, `/safety/` meta = `noindex, nofollow`. `VERCEL_ENV=production SITE_INDEXABLE=true npm run build` → `robots.txt` = `Allow: /` + the two disallow paths + the AI-bot rule + sitemap/host lines, `/safety/` meta = `index, follow`. Rebuilt plain afterward so the working tree is back in review/noindex mode.
- `docs/LAUNCH.md` created with the brief's section 9 human steps (using `SITE_INDEXABLE=true`, not the old `INDEXING=on`).

## Ma'am's changes 2026-11-23 — Book Us form layout

Source: `seo-kit/CHANGES-2026-11-23.md` section 3 ("Book Us form in detail") plus the updated kit files (`seo-kit/contact-form/src/{components/book-us/BookUsForm.tsx,data/bookingOptions.ts,lib/validateBooking.ts,README-PLACEMENT.md}`).

- `src/data/bookingOptions.ts` and `src/lib/validateBooking.ts` copied byte-for-byte from the updated kit (adds `organisation`/`designation` to `BookingInput`, updates the grade/pump confirmation comments). No validation rule changed.
- Convex (dev `small-squid-55` only): added optional `organisation` (max 120) and `designation` (max 80) to the `leads` table in `convex/schema.ts`, the `saveLead` mutation args/insert in `convex/leads.ts` (trimmed to the same limits), and passed through in `src/lib/leadStore.ts`. Pushed with `npx convex dev --once`.
- `src/components/book-us/BookUsForm.tsx` rearranged into the doc's four blocks, each with its own `<h3>` heading and exact field labels: **About you** (Your name *, Mobile number *, Email, Organisation name, Designation); **What you need** (What is this about? as two real radio-input buttons — Ready Mix Concrete / Others, with "Tell us what you expect" for Others; I am a; Grade, concrete only; Pump needed? as four real radio-input buttons); **Your site** (Nearest plant, Your area, Site location + Use my location, with the feasibility status line shown once plant+area are picked); **When and how much (optional)** (How much (m³), Pour date and time, Anything else?). The two button groups are `<fieldset>`/`<legend>` with native `<input type="radio">` (visually hidden) wrapped by a label styled with the site's `primary` token when selected and `grey-line` border when not — real radios give native keyboard/arrow-key and screen-reader semantics for free, so no manual `aria-checked` was added (would be redundant on a real `<input type="radio">`, only needed on custom `role="radio"` widgets). Every option list, helper text, status line, validation message, honeypot and the `generate_lead` dataLayer push (still no `organisation`/`designation`, no name/phone/email) are unchanged from the kit. Added a Call button (`tel:+919893111201`, from `plants.ts`'s `mainPhoneHref`) next to the Lead ID on the confirmation state, per the doc's "shows a Lead ID and a Call button".
- Field labels at the time followed the doc literally (only name/mobile/topic starred) — **superseded the same evening**, see "Ma'am decisions 2026-11-23 (evening)" below.
- No other page, the menu/header/footer, `plants.ts`, or any other form changed.

## Ma'am decisions 2026-11-23 (evening)

Source: `seo-kit/CHANGES-2026-11-23.md` (v2) and `seo-kit/MENU-AND-CONTACT-FORM-2026-11-23.md`, plus the updated kit's `README-PLACEMENT.md`/`BookUsForm.tsx`/`leadStore.ts`.

- **Seven required fields, marked \*** on `src/components/book-us/BookUsForm.tsx`: Your name, Mobile number, What is this about?, I am a, Grade, Pump needed?, Nearest plant. Also starred when they apply: Your area (once a plant is chosen), Tell us what you expect (Others), Write the grade you need (Other grade) — validation itself is unchanged, these are label changes only. The "Pump needed?" button group's native radio inputs now also carry the HTML `required` attribute (one required radio in the group is enough) so the browser blocks submit until a pump is chosen; "What is this about?" already defaults to "Ready Mix Concrete" so no `required` attribute was needed there.
- **CEO video stays, below the FAQ, with nothing in between**: removed the Phone Number / Office Email / Office Address cards section and the separate office map iframe section from `src/app/ready-mix-concrete-contact-in-raipur/page.tsx` entirely (Ma'am's doc flagged 4 maps on the live preview where 3 plant cards were specified — `PlantCards` already carries each plant's map). The intro heading/paragraph + CEO video `BgSection` now sits directly after the FAQ section. Removed the now-unused `site`, `PhoneIcon`/`MailIcon`/`MapIcon` imports and the `officeMapSrc`/`OFFICE_MAP_LINK` constants.
- **Footer "Book Us"**: `src/content/site.ts`'s `footerUsefulLinks` label "Contact" → "Book Us" (same `/ready-mix-concrete-contact-in-raipur/` href) — Ma'am's doc flagged the preview footer still said "Contact".
- **Removed "#1"**: `src/content/home.ts` hero subtitle — "Raipur's #1 ready mix concrete plant..." → "Raipur's ready mix concrete plant..." (kit hard rule #1, no unconfirmed ranking claim).
- **Leads go to the CRM via our Convex leads table**: confirmed decision is that enquiries are saved to the `leads` table already built in Convex (`convex/leads.ts`, dev `small-squid-55`), which the CRM being built will read from — no new service invented. `src/lib/leadStore.ts` already targets this table unchanged; `notifyTeam` remains the documented no-op (the `Lead ID | Plant | Topic | Pump` email subject stays built but unused until email/CRM wiring is confirmed).

**Resolved (removed from Waiting for client above):** which fields should be marked required; where the office cards/map/CEO video section should sit.

**Still open:**
- Who are Sales 1, 2 and 3 (one per plant)? Who gets "Not sure"/"Other area" leads? — needed for the CRM's auto-assign step.
- Grade list steps of 5 (M5, M10, M15 ... M80) still assumed, not yet confirmed; website product pages still say M20–M40.
- Plants 2 and 3 need full addresses and map coordinates; check the Plant 3 map pin is not the forbidden Plus Code `5PJ6+FHJ`.
- Page email address and working hours still not confirmed.
- The Bhilai order number 98271-22406 is not matched to any plant in `plants.ts`.

## Phase 5 — product page template (2026-11-23)

Template A applied to all 12 product pages (`src/app/ready-mix-concrete-in-raipur/[slug]/page.tsx`, one shared template; content JSON untouched). New data file `src/data/productAnswers.ts` holds the per-slug definition/typical-uses facts, each checked against that page's own body copy — nothing invented.

**Answer-first paragraph** (`"<Product> is <definition>. SolidMix RMC supplies it in Raipur."`) — `<definition>` is the predicate of each page's own first sentence, quoted here:
- Standard Concrete: *"Standard Concrete is one of the most widely used construction materials in modern residential, commercial, and infrastructure development projects."*
- High Strength Concrete: *"High Strength Concrete is specially designed to handle much higher loads than standard concrete."*
- Self Compacting Concrete: *"Self Compacting Concrete (SCC) is a highly flowable concrete mix that spreads easily into formwork and around reinforcement without the need for vibration."*
- Lightweight Concrete: *"Lightweight Concrete is a specially designed concrete mix made using lightweight aggregates that reduce the overall weight of the structure without sacrificing essential strength and durability."*
- Steel Fiber Concrete: *"Steel Fiber Concrete is a modern high-performance concrete specially designed by adding small steel fibers uniformly throughout the concrete mix."*
- PP Fiber Concrete: *"PP Fiber Concrete is a modern reinforced concrete solution manufactured by adding polypropylene (PP) fibers uniformly throughout the concrete mix."*
- Waterproof Concrete: *"Waterproof Concrete is a modern high-performance concrete specially developed to prevent water penetration, leakage, and moisture-related damage in structures exposed to wet or humid conditions."*
- Heat Resistant Concrete: *"Heat Resistant Concrete is a specially engineered concrete designed to withstand extremely high temperatures, thermal shock, and continuous heat exposure without losing its structural integrity."*
- Permeable Concrete: *"Permeable Concrete is a specially designed concrete mix that allows water to pass through its surface and drain into the ground below."*
- Eco Friendly Concrete: *"Eco Friendly Concrete is a sustainable construction material designed to reduce environmental impact while maintaining strength and durability."*
- Stamped Concrete: *"Stamped Concrete is an advanced decorative concrete solution that enhances the appearance of outdoor and indoor spaces while maintaining the strength and durability of traditional concrete."*
- Bagged Concrete: *"Bagged Concrete is a ready-to-use dry concrete mix packed in bags for convenience and easy handling."*

No grade range is published on any product page (Ma'am, 2026-11-23).

**Product name source bug found and avoided**: the new sections use a clean `productName` derived from the CSV-based `displayH1` (minus " in Raipur"), not the raw scrape `h1`. The raw `h1` field is garbled for `permeable-concrete-in-kotni-raipur` (literally `"Permeable-concrete-in-kotni-raipur"`, a slugified string) and still carries the slug's place name for `self-compacting-concrete-in-bhanpuri-raipur` ("... in Bhanpuri, Raipur"), `lightweight-concrete-in-sejbahar-raipur` ("... in Sejbahar, Raipur"), `eco-friendly-concrete-in-saddu-raipur` ("... in Saddu Raipur") and `bagged-concrete-in-farfaud-raipur` ("... in Farfaud Raipur") — all of which the brief forbids in new copy. `h1` itself is untouched and still feeds the existing JSON-LD/breadcrumbs exactly as before; only the new Phase 5 sections use the clean name.

**Facts box**: Product / Supplied in: Raipur / How to order (call/WhatsApp/Book Us form, linked) / Contact — on every page. **Typical uses** row added only where the page's own body already lists uses as a real bullet list (reused verbatim, not rewritten):
- Standard Concrete — body paragraph "This type of concrete is commonly used in:" + its list (9 items).
- Steel Fiber Concrete, PP Fiber Concrete, Waterproof Concrete, Heat Resistant Concrete — each has a body paragraph "Modern X is widely used in:" + its list.
- High Strength, Self Compacting, Lightweight, Permeable, Eco Friendly, Bagged Concrete — each has an "Applications" heading immediately followed by a bullet list (6 items each).
- **Stamped Concrete has no "Typical uses" row**: its applications section is written as prose H3 subheadings (Driveways, Patios and Courtyards, Walkways and Pathways, Pool Surrounds, Garden Landscapes, Commercial Entrances and Outdoor Areas) with sentences, not a bullet list — there is no single set of exact words to quote, so the row is left out per the brief's "leave the line out" rule rather than paraphrasing the subheadings into a list.

**"How do I order" H2 + buttons**: added on every product page with only Call / WhatsApp / Book Us form links (no invented process steps), plus "Book Us" (→ `/ready-mix-concrete-contact-in-raipur/`) and "Use the Concrete Calculator" (→ `/calculator/`) buttons styled like the site's existing CTA buttons.

**Related products**: 3 links read from `src/data/navigation.ts`'s "Ready Mix Concrete" groups (Structural / Fiber Reinforced / Special Purpose / Decorative & Bagged), same group first, falling back to the next groups in nav order for the two 2-item groups (Fiber Reinforced, Decorative & Bagged), plus an "All Ready Mix Concrete Products" link. Read-only use of `navigation.ts` — the file itself was not edited.

All existing page content, FAQs, Product/BreadcrumbList/FAQPage JSON-LD and the breadcrumb/JSON-LD `h1` were kept exactly as they were. `tsc --noEmit` clean, lint clean (only the pre-existing `leadStore.ts` stub warnings), `npm run build`: 84 routes, all 12 product pages still static (`●`), verified the other 11 pages render byte-identical to before until their data was added.

**Products overview** (`/ready-mix-concrete-in-raipur/`, template B): already has an intro paragraph above the card grid and a real card (name, link, one-sentence description) for every one of the 12 product pages — confirmed all 12 hrefs present in the built HTML. Meets template B as-is; no changes made.

**Home template F gap list** (read-only audit, no changes made — `src/app/page.tsx`):
1. No Book Us / Call / WhatsApp buttons directly under the H1 — the hero section has only the H1 + subtitle (sitewide header/mobile bar has these buttons, but not next to the H1 itself as template F specifies).
2. No dedicated "4 product group cards" section — the Services carousel covers RMC services, not a product-category grid linking into Products.
3. "Why Raipur's Contractors Choose" section exists but has no proof elements (plant photo, certificates) — would need client-supplied images/documents.
4. No "Projects strip" (3 real projects) section.
5. No dedicated "How ordering works" (3 steps) section on Home (the new per-product "How do I order" section only exists on product pages).
6. No Google reviews section — needs the client's Google Business Profile link (already tracked in section 8 of the brief as a client-confirm item).
7. FAQ section (4–6 items) with JSON-LD already present — meets template F.
8. Contact block has NAP text (address/number/email) but no map embed.

## Waiting for client (added 2026-11-23, Phase 5)

- Stamped Concrete "Typical uses": no bullet list exists on the page to quote; needs either a client-approved uses list or confirmation to leave the facts box without that row permanently.
- Ordering process steps: kept to "Call, WhatsApp, or the Book Us form" only on every product page, per the brief's hard rule #1 — no numbered process (advance notice, confirmation steps, etc.) is published anywhere.
- Product-page FAQs: not added or changed — the brief's instruction was to keep existing FAQs only and not add generic ones to product pages.
- Home template F gaps (list above): product-group cards, projects strip, "how ordering works", Google reviews link, proof elements for "Why SolidMix", and a contact-block map all need client input or an explicit decision before building.

## Phase 5 follow-up — breadcrumb/BreadcrumbList place-name fix (2026-11-23)

Found during review: the 12 product pages' visible breadcrumb last crumb and `breadcrumbLd` JSON-LD last item were still using the raw scrape `h1`, which is garbled for `permeable-concrete-in-kotni-raipur` (`"Permeable-concrete-in-kotni-raipur"`) and carries the slug's place name for `self-compacting-concrete-in-bhanpuri-raipur`, `lightweight-concrete-in-sejbahar-raipur`, `eco-friendly-concrete-in-saddu-raipur` and `bagged-concrete-in-farfaud-raipur` — the same issue already fixed in the new Phase 5 answer/facts-box copy, just missed in the pre-existing breadcrumb. `src/app/ready-mix-concrete-in-raipur/[slug]/page.tsx`: both the `PageHero`'s `crumbs` last entry and `breadcrumbLd`'s last item now use `displayH1` (the CSV H1, e.g. "Bagged Concrete in Raipur") instead of `h1`. `h1` is kept for `stripChrome()` and `productLd()`'s `name` (unchanged, out of scope for this fix). Verified in the built HTML for all 12 pages: visible breadcrumb and JSON-LD now both read e.g. "Bagged Concrete in Raipur" / "Permeable Concrete in Raipur" instead of the garbled/place-named text; `productLd`'s own `name` field is untouched as instructed.

## Phase 5 follow-up — Product JSON-LD name fix (2026-11-23)

`productLd({ name: h1, ... })` had the same raw-scrape-`h1` problem as the breadcrumb fix above (garbled for permeable-concrete-in-kotni-raipur, place-named for 4 others). Changed to `productLd({ name: displayH1, ... })` so the Product JSON-LD's `name` matches the visible H1 on every page. Verified in the built HTML: all 12 pages' Product JSON-LD now reads the clean CSV H1 (e.g. "Bagged Concrete in Raipur", "Permeable Concrete in Raipur"). Nothing else in this file changed.

## Menu — parent labels not clickable (2026-11-23)

Ma'am 2026-11-23: parent menu labels are not clickable (overrides kit "parent labels link to overview"); overview is the first submenu link.

`src/components/header/Header.tsx` only. Desktop: a top-level item with `groups` now renders its label as a `<button type="button" aria-expanded aria-controls>` (same classes as the old `<Link>`, chevron moved inside it) instead of a `<Link>` — click toggles, Enter activates natively, hover still opens via the existing `<li>` `onMouseEnter`/`onMouseLeave`, Esc still closes via the existing `onDesktopKey` keydown handler on the parent `<nav>`. The separate small chevron button is gone (merged into the label button). Mobile drawer: the same item's whole row is now one full-width `<button aria-expanded aria-controls>` that only calls `setExpanded`, no navigation; the label text and chevron are both inside it. Home (no `groups`) is unchanged — still a real `<Link>` on both desktop and mobile. The submenu's "overview" link stays the first link inside the dropdown/panel (unchanged, a real `<a href>` in server HTML) and every other submenu link is unchanged. `navigation.ts`, colours, sizes, `NavSchema` and `MobileActionBar` were not touched — only `Header.tsx`. Verified in the built HTML: `Home` renders `<a href="/">`, `Ready Mix Concrete` (and every other item with a submenu) renders `<button aria-expanded="false" aria-controls="submenu-1">`/`<button aria-expanded="false" aria-controls="m-sub-1">` with no `href`, and "All Ready Mix Concrete Products" is still the first `<a>` inside both the desktop and mobile submenus.

## Phase 7 Tracking (2026-11-23)

Built per `seo-kit/00-CLAUDE-BUILD-BRIEF.md` Phase 7 and `seo-kit/05-tracking.md`, no invented IDs.

- `src/app/layout.tsx`: GTM loads only if `process.env.NEXT_PUBLIC_GTM_ID` is set — the `next/script` (`afterInteractive`) snippet plus the `<noscript>` iframe right after `<body>`, both gated on the same env var. If unset, nothing loads and the server logs `console.info("GTM: NEXT_PUBLIC_GTM_ID not set, tracking skipped")` once (confirmed in the `npm run build` output — no GTM script/iframe in the HTML, the console.info line present). No GA4 tag, Meta pixel or other third-party script added.
- `src/lib/track.ts` (new): `pushEvent(event, params)` — the typed `Window.dataLayer` helper, no-op when `window` is undefined (server-safe).
- `src/components/TrackingEvents.tsx` (new, client, mounted once in layout): one delegated `document` click listener pushes `phone_click` (`a[href^="tel:"]`), `whatsapp_click` (href contains `wa.me`) and `file_download` (href ends `.pdf`) — confirmed live links exist for all three (tel: in Header/MobileActionBar/CallButton/PlantCards/InlineText; wa.me in WhatsAppButton/Header/MobileActionBar; `.pdf` brochure links in `our-work` and `Footer`). `location` param is `header`/`mobile_bar`/`page`, read from the closest ancestor's `data-track-location` attribute (set on `<header>` and `MobileActionBar`'s wrapper), defaulting to `page` elsewhere. No PII — only `link_url` and `location`.
- `book_us_click`: pushed directly from the real Book Us `Link`s — desktop header CTA and mobile drawer CTA in `Header.tsx` (`location: 'header'`), and `MobileActionBar.tsx`'s Book Us cell (`location: 'mobile_bar'`, which needed adding `'use client'` since it now has an onClick — no visual change).
- `generate_lead` / `contact_form_submit`: `BookUsForm.tsx`'s existing success handler already matched the brief's params; replaced its local `window.dataLayer` push with the shared `pushEvent` helper and added a second push for `contact_form_submit` with the identical params (`form_name: 'book_us', lead_id, customer_category, pump_requirement, plant, delivery_area`). Still no name/phone/email/message/address in the dataLayer.
- `calculator_used`: `Calculator.tsx`'s Calculate handler pushes `{ calc_shape: 'cuboid' }` on a successful calculation. Note: this calculator has no shape-selector variable (it only ever computes length × width × height, the page's own video is "Cuboid"), so `calc_shape` is a fixed literal rather than a real state variable — flagging this in case the client's brief assumed a multi-shape calculator exists elsewhere.
- No visual change: same markup/classes everywhere; only `data-track-location` attributes and `onClick` handlers were added.
- `npx tsc --noEmit`, `npm run lint` and `npm run build` all pass clean (84/84 pages still static).

Waiting for client: GTM container ID (`NEXT_PUBLIC_GTM_ID`, Vercel Production only), GA4, Search Console, Meta pixel access.

## Phase 8 summary (2026-11-23)

### Done
- `npm run build`: compiles clean, 84/84 pages static (the 3 `/api/*` routes are correctly dynamic/on-demand). Same in a `VERCEL_ENV=production` build with `SITE_INDEXABLE` unset.
- `scripts/audit.mjs` (new, plain Node, no new dependency; `npm run audit`): crawls `/sitemap.xml` plus every internal link found, against a running `next start` build. Checks broken internal links, redirect chains (>1 hop), duplicate `<title>`/meta description, pages with 0 or >1 `<h1>`, and sitemap URLs not returning 200. All canonical identity is kept in `https://solidmixrmc.com/...` form and only swapped onto the local host at the moment of fetching — the sitemap's `<loc>` entries are always the production canonical origin even for a local build, and the script must never actually send requests to the real solidmixrmc.com (first draft of the script had this bug and briefly crawled the real site with read-only GETs before being caught and fixed; no login, form submit or write occurred).
- Audit found two real duplicate-title/description bugs and both were fixed with already-approved text (no invented copy, no URL change):
  - `src/app/category/[cat]/page/[n]/page.tsx`: pages 2–4 of `/category/construction/` had an identical scraped title/description on every page (no per-page CSV row exists). Now reuses the category's own confirmed page-1 title/description (`seo-kit/01-seo-meta.csv` via `seoMetaOverrides`) with "– Page N" appended — the real page number, not new copy.
  - `src/content/seoMeta.ts`: the blog post `/best-ready-mix-concrete-supplier-in-raipur-what-to-look-for/` had a scraped title/description byte-identical to `/ready-mix-concrete/`'s (a pre-existing duplicate on the original WordPress site, inherited by the scrape). This one post now uses its own CSV row (title "Choosing an RMC Supplier in Raipur", description from the CSV) instead of the raw scrape — the other 3 CSV blog posts are untouched and still use their own scraped description, per the existing Phase 2 decision.
  - Re-ran `npm run audit` after both fixes: **0 issues** (0 broken links, 0 redirect chains, 0 sitemap failures, 0 H1 issues, 0 duplicate titles, 0 duplicate descriptions).
- Lighthouse mobile (local `next start`, Playwright's Chromium via `CHROME_PATH`), targets Performance 85+/Accessibility 95+/SEO 100:
  | Page | Performance | Accessibility | Best Practices | SEO |
  |---|---|---|---|---|
  | `/` | 75 (cold run) / 89 (warm re-run) | 97 | 100 | 69 |
  | `/ready-mix-concrete-in-raipur/standard-concrete/` | 90 | 96 | 100 | 69 |
  | `/calculator/` | 91 | 100 | 100 | 69 |

  SEO 69 on every page is caused by exactly one audit, `is-crawlable` ("Page is blocked from indexing") — expected and correct, since the local/non-production build is intentionally `noindex`/`Disallow: /`; it is not a defect. Accessibility already clears the 95 target everywhere (Home's only miss, `target-size`, is the pre-existing hero carousel's small slide-indicator dots — not alt/contrast/label/image-sizing, so left alone per the "safe fixes only" scope; Product's only miss is `color-contrast`, also not touched for the same reason and because A11y already passes at 96). Home's cold-run Performance of 75 was a local image-optimizer cold-start artifact (the hero image already has `priority` correctly set on the first slide only, per Phase 5): a second run against a warm cache scored 89, clearing the 85 target; Product and Calculator both cleared 85 on the first run. No performance "fix" was applied — there was no real code defect to fix, only local cold-cache noise.
- Production-mode robots check: built and started with `VERCEL_ENV=production` and `SITE_INDEXABLE` unset — `robots.txt` still says `User-Agent: *` / `Disallow: /`, and Home's `<meta name="robots">` still says `noindex, nofollow`. Rebuilt normally afterward.
- Secret scan: grepped the working tree (all tracked files) and the full `git log -p --all` for API keys, tokens, passwords, Convex deploy keys (`prod:`/`dev:` prefixed), `DASHBOARD_BOOTSTRAP_SECRET` values, and any committed `.env`/`.env.local`. Nothing found — only `.env.example` is tracked, and every value in it is blank (a template). No `.env*` file with real values was ever committed, in any commit. No STOP needed.
- `docs/LAUNCH.md` updated: added "deploy the leads table to the production Convex deployment `mild-kingfisher-300` before merging" as its own step before the merge, and "make the GitHub repo private" alongside the merge step. The rest of the human steps already matched brief section 9 exactly from the Phase 4 build.

### Skipped
- Opening the `seo-build` → `main` pull request (brief's last Phase 8 bullet): explicitly held back this round per instruction ("No push, no PR yet"). Everything else in Phase 8 is done so the PR can be opened on request.

### Waiting for client (brief section 8, plus Ma'am's pending items)
- Exact address, hours and map position (brief section 8).
- Concrete grades: FAQ doc says M5–M80, website says M20–M40 — which is correct (brief section 8; same open item as the Book Us grade field, Phase 5C).
- Delivery areas (brief section 8) — plants.ts areas are already client-confirmed; this is for any areas beyond those three plants' lists.
- Services, quality and safety practices (brief section 8).
- Team names and titles (brief section 8).
- Prices and delivery times — publish only if approved (brief section 8).
- Google Business Profile and social links (brief section 8).
- Analytics, Search Console and Meta pixel access (brief section 8) — same as the Phase 7 "waiting for client" line: GTM container ID (`NEXT_PUBLIC_GTM_ID`), GA4, Search Console, Meta pixel.
- Sales contacts per plant / CRM connection details (Ma'am).
- Plant 2 and Plant 3 full street addresses (Ma'am) — currently locality-only per `plants.ts`, as confirmed in Phase 5C.
- Page email and working hours (Ma'am).
- Grade sentences on the Home FAQ, About page and Standard Concrete page (Ma'am).
- Stamped Concrete "Typical uses" list (Ma'am) — no source list exists to quote yet (same open item logged earlier in this file).
- Bhilai number 98271-22406 — is this a real, confirmed SolidMix number to publish (Ma'am)?
- Whether the Book Us grade list should really step by 5 from M5 to M80 (Ma'am) — currently unconfirmed free text only, per Phase 5C.
- GTM ID / GA4 / Search Console / Meta pixel access (Ma'am) — duplicate of the brief section 8 item above, listed because Ma'am raised it separately.
- Date-archive URLs (`/YYYY/MM/DD/`) redirect to Home in `next.config.ts` — the brief says no redirect to home as a catch-all. Needs a decision: point to `/concrete-blog-in-raipur/` or let them 404. Not changed.

### Risks
- The audit script's crawl is bounded by what's reachable from the sitemap plus same-origin `<a href>` links found on crawled pages; a page that's unreachable by any link (an orphan) and also missing from the sitemap would not be checked. No such page is currently known.
- The two duplicate-title/description fixes reuse already-confirmed CSV text; if the client later changes that CSV text, both the page-1 category title and the one blog post's override need updating together (they're no longer independent).
- Lighthouse Performance scores on this local WSL box are noisy (cold vs. warm cache gave Home a 14-point swing); real-world Vercel/CDN numbers will differ and should be re-checked on a preview deployment before launch.
- Until the client confirms the grade-list range (M5–M80 vs M20–M40) and the other open items above, those lines stay out of every page per hard rule #1 — several facts boxes and FAQ answers are shorter than the original site's equivalent copy as a result.
- The production Convex deployment (`mild-kingfisher-300`) does not yet have the leads table deployed; `docs/LAUNCH.md` now requires this before merging, but it has not been done as part of this build (no production Convex access from this environment).
- The GitHub repo is not yet private; `docs/LAUNCH.md` now calls for this at launch, but it must be done by a human with repo admin access.

2026-11-23 pushed seo-build to 31a8d3b (Phase 5 + breadcrumb + productLd + menu parents). Frontend done; backend pending.

## Production Convex deploy — leads table (2026-11-24)

`npx convex deploy` run against the production deployment `mild-kingfisher-300` (confirmed target in the CLI output: `[Production] solidmix-rmc:solidmix-website:production`), from `seo-build` at `c7ebaf5` with only `crm-kit/` untracked. Dry run first, then the real deploy — both produced the identical schema diff: added indexes `leads.by_leadId` (`leadId`, `_creationTime`) and `leads.by_phone_createdAt` (`phone`, `createdAt`, `_creationTime`); no indexes removed. Functions pushed: `authData`, `gallery`, `history`, `leads`, `posts`, `seedGallery`, `seedPosts`, `submissions` (Convex runtime) + `auth` (Node.js runtime). Deploy key used only as the `CONVEX_DEPLOY_KEY` env var, never printed or committed. This resolves the Phase 8 risk noted above ("production Convex deployment does not yet have the leads table deployed") — the leads table is now live in production. `docs/LAUNCH.md`'s pre-merge Convex-deploy step is now done; the repo-private step is still outstanding.

## Remove Samrat Gupta + footer plant addresses (2026-11-25)

Removed Samrat Gupta per client request, same pattern as Purnendu Poddar (`855e7ba`): deleted `src/content/pages/our-team-samrat-gupta.json` and `public/images/content/samratgupta.webp`; removed his image/heading/paragraph block from `src/content/pages/our-team.json` and his entry from `src/content/index.json`; removed `"samrat-gupta"` from `MEMBER_SLUGS` in `src/app/our-team/[slug]/page.tsx` and from the team slugs in `src/app/sitemap.ts`; added two 301 redirects in `next.config.ts` (`/our-team/samrat-gupta/` and `/about-us/samrat-gupta/`, both to `/our-team/`), placed before the generic `/about-us/:member` rule, single hop. Verified with `grep -rni "samrat" src/ public/ scripts/ next.config.ts` — only the two new redirect lines (and their comment) remain.

Footer plant addresses: `src/components/Footer.tsx` now imports `plants` from `src/data/plants.ts` and renders all 3 plants under the same "Plant Address" heading, one `<p>` per plant as "Plant 1 – <address>", "Plant 2 – <address>", "Plant 3 – <address>", using each plant's `address` field exactly as written (no new colours/fonts/layout). The old single-address `plantAddress` block in `src/content/site.ts` was removed after confirming by grep it had no other callers.

Verified: `npx tsc --noEmit` and `npm run lint` both pass (output pasted to Saidul). `npm run build` was not run here — Saidul runs that.

Waiting for client:
- Plants 2 and 3 full street addresses (`plants.ts` still only has the short/locality versions for those two).
- The old single Plant 1 (Serikhedi) address wording still appears, unchanged, in `src/lib/seo.ts` (Organization/LocalBusiness JSON-LD), `public/llms.txt`, and `src/content/home.ts` (Home FAQ answer, ~line 139) — out of scope for this change, left as-is.
- Sitemap is now 72 URLs (was 73; one team-member page removed). `.local-tools/regress.sh`'s `EXPECT_URLS` default should be updated to 72 — not touched here since `.local-tools/` is off-limits.

## Team page: 4 new members (2026-11-25)

Added 4 new team-member cards to `/our-team/`: Ramkrishna Mishra (Sales Head), Brijesh Choubey (Project & Corporate Affairs), Akula Laxman Rao (Finance & Account), Jainarayan Tiwari (Plant Manager) — appended after the Pitabas Sahoo card in `src/content/pages/our-team.json`, same image+heading(level 3, plain text, no link)+paragraph block shape as his, no bio text.

Photos: the 4 originals Saidul placed in `.local-tools/incoming/` (`ramkrishna-mishra.jpg`, `brijesh-choubey.png`, `akula-laxman-rao.png`, `jainarayan-tiwari.png`) were converted 1:1 to WebP (sharp, quality 90, no resize/crop/retouch) into `public/images/content/<slug>.webp`. Verified output pixel dimensions equal the source for all 4 (1278x1231, 1241x1268, 1524x1600, 1254x1254).

No code change: `src/app/our-team/page.tsx` and `src/components/sections/TeamGrid.tsx` already build cards generically from any image+heading+paragraph triple via `extractCards()`/`TeamGrid`, and already render a plain (unlinked) name when no markdown link is present in the heading — confirmed by reading both files, so neither was touched. No new page, route, redirect, sitemap entry or `index.json` entry was added for these 4 members (card only, same as Pitabas Sahoo).

Verified: `npx tsc --noEmit` and `npm run lint` both pass (output pasted to Saidul). `npm run build` was not run here — Saidul runs that.

Waiting for client:
- Bios/individual pages for the 4 new members were not requested — card only, as instructed.
- Alt text left empty (`""`) for all 4, same as the existing members; the page's image rendering falls back to the member's name for the `alt` attribute.

2026-11-25 pushed feat/photos-frontend to 9aa4474 (Samrat Gupta removed, footer lists 3 plants, 4 new team members)

## Team photo frame: remove grey strip (2026-11-25)

Fixed a grey strip showing under each team photo on `/our-team/`, `/legal/` and `/trusted-concrete-supplier-in-raipur/` (all three render their team section through the shared `TeamGrid` component). Cause: the `<Image>` had a fixed `width={400} height={500}` and `h-full w-full`, but `h-full`/`w-full` on an `<img>` without `position: relative` on an ancestor and `fill` just keeps the image at its own natural aspect ratio inside the `aspect-[4/5]` frame — any photo not already exactly 4:5 left a gap (grey `bg-grey-line` background) below it.

Changed only `src/components/sections/TeamGrid.tsx`: added `relative` to the frame `div` (kept every other existing class — `hover-bob`, `mx-auto`, `aspect-[4/5]`, `w-[89%]`, `max-w-full`, `overflow-hidden`, `rounded-md`, `bg-grey-line`, `sm:mx-0`, `sm:w-auto`); replaced the `width`/`height` props on `<Image>` with `fill`, added `sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 89vw"`, and changed the className to `object-cover object-top`. `src` and the `alt` fallback logic are unchanged. No other component, the `our-team.json` content, or any photo file was touched.

Display-only trade-off: `object-cover` crops each photo to fill the fixed 4:5 box (cropping from the sides/bottom, anchored to the top via `object-top`) — this only affects on-screen framing, the source WebP files in `public/images/content/` are untouched and still have their original, un-cropped pixel dimensions.

Verified: `npx tsc --noEmit` and `npm run lint` both pass (output pasted to Saidul). No server/build run here — Saidul verifies visually on all three pages.

2026-11-25 pushed feat/photos-frontend to f97a0da (team photo grey strip fix)

2026-11-25 merged feat/photos-frontend into main (--no-ff) at 21c70ce; pushed main

## Home slider: first slide replaced with "No. 1" banner (2026-11-25)

Replaced only the first slide of the home hero slider (previously the Boom Pump slide, `slide-3.webp`) with Ma'am's new banner, `public/images/hero/slide-no1.webp` (1600x749, already in the repo, not created/edited/resized here). Changed only `src/components/home/HeroSlider.tsx`: the first `SLIDES` entry and its alt text, and the comment above `SLIDES`. The other two slides (`slide-1.webp`, `slide-2.webp`) and their order after the new first slide are unchanged. `grep -rn "slide-3"` confirmed the only reference was `HeroSlider.tsx` itself, so `public/images/hero/slide-3.webp` was removed with `git rm`.

Alt text used exactly as given: "SolidMix Ready Mix Concrete. Raipur's No. 1 R.M.C. player. 3,600 cubic metres despatch capacity per day, 3 plants in Raipur. Call 9893111201."

Verified: `npx tsc --noEmit` and `npm run lint` both pass (output pasted to Saidul). No server/build run here — Saidul verifies visually.

Waiting for client:
- Written approval needed from Ma'am for the claims now live in this slide's alt text — "Raipur's No. 1 R.M.C. player", "3,600 m³ despatch capacity per day", and "3 plants" — per the kit's no-unconfirmed-ranking-claims rule. Note the "#1" claim was previously removed from the Home subtitle for the same reason; it is now reintroduced here via Ma'am's own supplied banner image/alt text and needs her explicit sign-off before this is treated as confirmed.

2026-11-25 committed feat/home-banner (No. 1 banner as first slide); tests: banner 28 PASS, run-all ALL PASS; not pushed

2026-11-25 pushed feat/home-banner to ded4ab4; Vercel preview check pending; not merged

2026-11-25 merged feat/home-banner into main (--no-ff) at 0b96474; pushed main; Vercel production check pending

## Team: Vinit Kumar Tiwari name + member order (2026-11-26)

Display name changed from "Vinit Tiwari" to "Vinit Kumar Tiwari" (display text only; URL `/our-team/vinit-tiwari/` unchanged, no redirect needed). Updated: the team-listing link text in `src/content/pages/our-team.json`; the title, h1 and heading on his own page `src/content/pages/our-team-vinit-tiwari.json` (description and body text already said "Vinit Kumar Tiwari", left as-is); the title and h1 in his `src/content/index.json` entry; and the team-card heading (plain text, no link) in `src/content/pages/legal.json` and `src/content/pages/trusted-concrete-supplier-in-raipur.json`.

New team order on `/our-team/` (whole image+heading+p groups moved, content untouched): Vinit Kumar Tiwari, Pratham Bafna, Ramkrishna Mishra (Sales Head), Jainarayan Tiwari (Plant Manager), Akula Laxman Rao (Finance & Account), Pitabas Sahoo (Quality Head), Brijesh Choubey (Project & Corporate Affairs).

Waiting for client:
- The contact-link/copy lines "Vinit Tiwari & Pratham Bafna" (legal.json, trusted-concrete-supplier-in-raipur.json) and "Led by founders Vinit Tiwari and Pratham Bafna" (trusted-concrete-supplier-in-raipur.json) still use the short name — decision needed from Ma'am on whether these should also become "Vinit Kumar Tiwari".

2026-11-26 committed and pushed feat/team-order at 90059ce; tests: team 49 PASS, run-all ALL PASS; Vercel preview check pending; not merged

2026-11-26 merged feat/team-order into main (--no-ff) at b555cf0; pushed main; Vercel production check pending

## Akula Laxman Rao photo replaced (2026-11-27)

2026-11-27 Akula Laxman Rao photo replaced with the new photo from the team (1224x1285 WebP q90, same file name akula-laxman-rao.webp, no code change, 4:5 frame fill unchanged); tests: team 49 PASS, team-visual 114 PASS, run-all ALL PASS; pushed feat/akula-photo at 8253183; Vercel preview check pending; not merged

2026-11-27 merged feat/akula-photo into main (--no-ff) at 305e220; pushed main; Vercel production check pending

## Office address replaced site-wide (2026-11-28)

Old office address "Office no. 418, 4th floor, Lalganga Business Park, Pachpedi Naka, Raipur, C.G. 492001" (also written "Office no.418 ... Pin code 492001") replaced everywhere with the new address: "PH. NO. 77, KH. NO. 365/5, Serikhedi, Raipur, Chhattisgarh 492101". Files changed:
- `src/content/site.ts` — footer office address line.
- `src/content/home.ts` and `src/content/pages/home.json` — contact details block address line and the Home FAQ "Where is the SolidMix RMC concrete plant located" answer. `src/app/page.tsx` imports `src/content/home.ts` for the live Home page; `src/content/pages/home.json` is not imported anywhere in `src/app`, `src/lib`, or `src/components` (checked), so it is currently unused by the site, but both were kept in sync per instruction.
- FAQ answer before: "Our plant is located at Ph.no.77, Kh.no.365/5, Serikhedi, Raipur, Chhattisgarh 492101. Our office is at Lalganga Business Park, Pachpedi Naka, Raipur. Both locations are available on Google Maps." After: "Our plant and office are located at PH. NO. 77, KH. NO. 365/5, Serikhedi, Raipur, Chhattisgarh 492101. This location is available on Google Maps." (the first two sentences were merged into the one required sentence; "Both locations are" was changed to "This location is" — the smallest wording fix so the remaining sentence stays true now that plant and office are the same place; no new claim added).
- `src/content/pages/site-mix-concrete.json` and `src/content/pages/solidmix-readymix-concrete.json` — replaced only the text after "Office:" (kept `[[b]]Office:[[/b]]` and the surrounding contact-email/phone text unchanged).
- `src/lib/seo.ts` — the "Office" `PostalAddress`: `streetAddress` now "PH. NO. 77, KH. NO. 365/5, Serikhedi", `postalCode` now "492101" (`addressLocality`/`addressRegion` unchanged). The existing comment about the removed "Pachpedi Naka" `areaServed` entry was left as-is.
- `public/llms.txt` — "Office address:" line updated.
- `src/content/pages/ready-mix-concrete-contact-in-raipur.json` — the Google Maps embed `q=` parameter changed from the old Lalganga Business Park search text to the URL-encoded new address text; no other query parameter touched; no coordinates or Plus Code added. Before: `q=Lalganga%20Business%20Park%20Raipur%20-%20Abhanpur%20Rd%2C%20Navjeevan%20Society%2C%20Pachpedi%20Naka%2C%20Tikrapara%2C%20Mathpurena%2C%20Chhattisgarh%20492001`. After: `q=PH.%20NO.%2077%2C%20KH.%20NO.%20365%2F5%2C%20Serikhedi%2C%20Raipur%2C%20Chhattisgarh%20492101`.
- Not touched: the "Pachpedi Naka" mentions in the delivery-areas list in `src/content/home.ts`/`home.json` (service-area copy, not the office address) and everything under `src/data/plants.ts`, `seo-kit/`, `crm-kit/`, `convex/`, `docs/reference/`.

Footer `Plant Address` column (`src/components/Footer.tsx`): added `mt-3` spacing between the three plant paragraphs (none above the first), and made only the "Plant N" label bold with `<strong className="font-bold">Plant {i + 1}</strong>` followed by " – " and the address in normal weight. Same `plants.map`, same text and colours; nothing else in the footer changed.

Verified: `npx tsc --noEmit` and `npm run lint` both pass (output pasted to Saidul; lint shows only a pre-existing unrelated warning in `src/lib/leadStore.ts`). `npm run build` was not run here.

Waiting for client:
- Confirm the new office address with Ma'am in writing.
- Check whether the Google Business listing and any outside listings still show the old office address.
- The contact page map (`ready-mix-concrete-contact-in-raipur.json`) was pointed to the new address text without coordinates — check the pin visually.
- Edit the office line in the two Convex posts site-mix-concrete and solidmix-readymix-concrete through the Team Dashboard, first on the Preview (dev Convex), then on production after merge; then re-run .local-tools/office-test.js (also with BASE=https://solidmix-omega.vercel.app)

2026-11-28 committed and pushed feat/office-address at f62a5fa; tests: run-all all PASS except office-test 19 PASS 1 FAIL (the old office address is still inside the Convex content of the two posts /site-mix-concrete/ and /solidmix-readymix-concrete/); not merged.

## Calculator "Coming Soon"; Completed Projects -> Project Gallery, Project Gallery -> Plant Gallery; About team section removed (2026-11-28)

**Calculator page** (`src/app/calculator/page.tsx`): PageHero (title + breadcrumb) kept exactly as-is. The whole body — intro text, `<Calculator />`, the cuboid video — was replaced with one centered "Coming Soon" section (`py-16 md:py-24`, heading styled `text-[28px] font-semibold text-primary md:text-[40px]`, same look as other section headings site-wide). Removed the `WebApplication` JSON-LD (kept the breadcrumb JSON-LD) and the now-unused imports (`stripChrome`, `BlockRenderer`, `webApplicationLd`, `Calculator`). `src/components/forms/Calculator.tsx` and the video/poster files were not touched, and the menu/footer Calculator links are unchanged.

**Page rename**: "Completed Projects" (`/our-work/`) is now "Project Gallery" at `/project-gallery/`; "Project Gallery" (`/rmc-gallery-in-raipur/`) is now "Plant Gallery" at `/plant-gallery/`. `git mv src/app/our-work src/app/project-gallery` and `git mv src/app/rmc-gallery-in-raipur src/app/plant-gallery`; both pages still call `getPageContent("our-work")`/`getPageContent("rmc-gallery-in-raipur")` and the JSON file names are unchanged, per instruction. Updated in both `page.tsx` files: `resolveDisplayH1`, `pageMetadata` path, and the visible breadcrumb/JSON-LD names ("Project Gallery", "Plant Gallery"). Also updated: `src/content/seoMeta.ts` (keys renamed, titles/h1s now "Project Gallery"/"Plant Gallery", descriptions unchanged — this drops "in Raipur" from both, see Waiting for client); `src/data/navigation.ts` ("Our Projects" parent label kept, href now `/project-gallery/`, overview label now "Project Gallery", child link now "Plant Gallery" → `/plant-gallery/`); `src/content/site.ts` (header "Our Work" → "Project Gallery", "Gallery" → "Plant Gallery", footer "Our Projects" label kept with new href); `src/app/sitemap.ts`; `src/content/home.ts` (`OUR_WORK_URL` only — the unused `intro.bodyHtml` export's own embedded `<a href="/our-work/">` was left as-is: it is not imported by `src/app/page.tsx`, same dead-code situation as `home.json` noted in the office-address entry above); `src/content/index.json` (the two `path` fields only, slugs/titles/h1s kept); `src/app/trusted-concrete-supplier-in-raipur/page.tsx` (Elevate Profile href); `src/app/api/revalidate-gallery/route.ts` (`revalidatePath` and the fetch path, both now `/plant-gallery/`); `public/llms.txt` (labels + new URLs); and the href-only link targets in `src/content/pages/legal.json` (3 links), `trusted-concrete-supplier-in-raipur.json` (2 links/1 image href), `solidmix-rmc-supplier.json` and `home.json` (markdown-link hrefs only, visible link text unchanged). `our-work.json`/`rmc-gallery-in-raipur.json` have no internal hrefs to themselves or each other — their own `path`/`canonicalOriginal` fields were left as the original WordPress URLs, since `canonicalOriginal` documents history and neither field is read by any code path.

**Correction (2026-11-28, later same day):** the line above calling `src/content/home.ts`'s `intro.bodyHtml` "unused"/"dead code" was wrong — it IS rendered by the live Home page. Its "hundreds of projects" link has been fixed and now points to `/project-gallery/`.

Visible text mentioning "Gallery"/"Project Gallery" as a name found but NOT changed (not a menu/page name, so left per instruction): `src/content/pages/legal.json` heading "Meet Our Gallery" (a Legal-page section label, unrelated feature — rendered via `src/app/legal/page.tsx`'s `findHeading("Meet Our Gallery")`); the content fields inside `our-work.json`/`rmc-gallery-in-raipur.json` themselves (`title`, `h1: "Gallery"`, breadcrumb text `"[Home / Gallery](/)"`) — these are superseded at render time by the `seoMeta.ts` overrides and stripped as chrome, so not user-visible, and were left alone since item scope only asked for href changes in these two files.

`next.config.ts`: added `/our-work/` → `/project-gallery/` and `/rmc-gallery-in-raipur/` → `/plant-gallery/` (301, single hop), placed right after the other "Section / menu page moves" and before every generic/parameterised rule. No existing redirect pointed at either old URL, so no chain existed to fix.

**About page** (`src/app/trusted-concrete-supplier-in-raipur/page.tsx`): removed the whole "Meet the SolidMix Team" section (eyebrow, "Solidmix Concrete Team" heading, intro paragraphs, team cards) from the rendered page. The JSON content file was deliberately left untouched (its blocks are picked by absolute index; removing blocks there would shift every later section), so only the parsing variables (`teamIntroAll`, `teamEyebrow`, `teamH2`, `teamIntro`, `teamCards`, `teamMembers`) and the JSX section were deleted, along with the now-unused `TeamGrid`/`TeamMember` and `BlockRenderer` imports. "Why Choose" (`py-14`) now sits directly above "Our Services" (`py-14`) — the same two-`py-14`-sections-adjoining pattern already used elsewhere on this page (e.g. "Services" directly above the FAQ section via the intervening `BlocksCta`), so no double padding and no gap.

Verified: `npx tsc --noEmit` — clean in `src/`; 6 errors only in the gitignored `.next/types/` cache (stale references to the pre-rename `our-work`/`rmc-gallery-in-raipur` directories, left over from a build run before this change — self-resolves on the next `npm run build`/`next dev`, not run here). `npm run lint` passes (same pre-existing unrelated warning in `src/lib/leadStore.ts`).

Waiting for client:
- Page titles lost the words "in Raipur" for SEO on these two renamed pages ("Project Gallery" / "Plant Gallery" instead of the old "RMC Projects in Raipur" / "RMC Gallery in Raipur") — confirm this is acceptable, or ask for the longer titles back.
- Request re-indexing of the two new URLs (`/project-gallery/`, `/plant-gallery/`) in Google Search Console after deploy.
- The Convex `RESERVED_SLUGS` list in `convex/posts.ts` does not yet contain `project-gallery` and `plant-gallery` — backend change, not done here (`convex/` was not touched per instruction).
- The earlier office-address text in the two Convex posts (site-mix-concrete, solidmix-readymix-concrete) still needs the dashboard edit (carried over from the previous entry).
- The Convex post `/solidmix-rmc-supplier/` still links to `/our-work/` (works through the 301, but should be edited in the Team Dashboard to `/project-gallery/`).

2026-11-28 committed and pushed calculator/rename/About changes on feat/office-address at c5c7be9; tests: run-all all PASS except office-test 19 PASS 1 FAIL (2 Convex posts still have the old office address) and restructure-test 43 PASS 1 FAIL (Convex post /solidmix-rmc-supplier/ still links to /our-work/); both need a Team Dashboard edit; not merged

## New transparent logos (feat/office-address)

Switched the site to Ma'am's new transparent-background logo files (`public/images/solidmix-logo-v2-header.webp`, `solidmix-logo-v2-footer.webp`, `solidmix-logo-v2-master.webp` — added to the repo by Saidul before this task, not created here):
- `src/components/header/Header.tsx`: logo `src` → `/images/solidmix-logo-v2-header.webp`, intrinsic `width`/`height` → 388/128, added `unoptimized`, kept `priority` and the same `className="h-[52px] w-auto lg:h-[64px]"` and alt text — displayed size unchanged (52px tall on phone, 64px on laptop).
- `src/components/Footer.tsx`: logo `src` → `/images/solidmix-logo-v2-footer.webp`, intrinsic `width`/`height` → 360/192, added `unoptimized`, kept `className="h-auto w-[180px]"` and the white rounded box `<span>` exactly as it was.
- `src/lib/seo.ts`: the 3 `absUrl("/images/solidmix-logo.webp")` calls (Organization `logo`, Organization `image`, blog-post `publisher.logo`) → `absUrl("/images/solidmix-logo-v2-master.webp")`.
- `src/app/ready-mix-concrete-in-raipur/[slug]/page.tsx`: the Product JSON-LD fallback `image` (used only when a product page has no image block) → `/images/solidmix-logo-v2-master.webp`.
- Grepped all of `src`, `public/llms.txt`, `next.config.ts` and `src/content` for `solidmix-logo.webp`/`solidmix-logo-footer.webp` before editing: the only 6 matches were the 4 files above (3 in `seo.ts`) — no other code or content reference existed, so nothing else needed changing.
- Old files `public/images/solidmix-logo.webp` and `public/images/solidmix-logo-footer.webp` were kept on disk, unreferenced by code now, not deleted.
- Not touched: favicons (`icon.png`, `apple-icon.png`) — not part of this logo set; ask Ma'am later whether she wants transparent favicons too. Also not touched: the 4 unused PNG/phone logo variants, `convex/`, `src/content/pages/our-team*.json`, `next.config.ts` redirects, `src/app/project-gallery/`, `src/app/plant-gallery/`, `public/images/hero/`, `package.json`, `.local-tools/`, `crm-kit/`.

Waiting for client:
- Confirm the new transparent logos look right at the kept display sizes (52px/64px header, 180px-wide footer) — `unoptimized` is used because these are already-optimized static assets served as-is.
- Decide whether favicons should also move to a transparent version later.

The `globals.css` `img, video { max-width: 100%; height: auto; }` rule (unlayered) was overriding `h-[52px]`/`lg:h-[64px]` on the header logo, so it never actually rendered at those sizes. Fixed with the Tailwind v4 important modifier on the header logo only — className is now `h-[52px]! w-auto lg:h-[64px]!`. The header logo is now 52px tall on phone and 64px tall on laptop (Ma'am's intended sizes); before this fix it rendered at about 56px tall on both because the sizing class never applied.

2026-11-28 new transparent logos wired on feat/office-address (header 52px/64px tall via ! modifier, footer unchanged size, JSON-LD and product fallback use master); tests: run-all all PASS (logo-test 33 PASS) except office-test 19 PASS 1 FAIL and restructure-test 43 PASS 1 FAIL, both waiting for Team Dashboard edits of Convex posts; not merged

## Our Team page split (feat/office-address)

`src/app/our-team/page.tsx` only — no change to `src/content/pages/our-team.json` or any member's name/photo/role/bio. The page already builds a flat `members` array (in JSON order) via `extractCards()`; `our-team.json`'s existing order is already "2 Founder & Director entries, then 5 team roles" in the exact required order, so the split is done by array position (`members.slice(0, 2)` for directors, `members.slice(2)` for team) rather than adding a `group` field — no JSON edits or reordering needed either way.

New page structure: the existing intro block (eyebrow, "Solidmix Concrete Team" H2, intro paragraph) is unchanged, h1/breadcrumb/metadata unchanged. Below it: H2 "Our Directors" → Vinit Kumar Tiwari, then Pratham Bafna, rendered in a centered flex row (same per-card width formula as `TeamGrid`'s `sm:grid-cols-2`/`lg:grid-cols-3` breakpoints — `calc((100%-2rem)/2)` at `sm`, `calc((100%-4rem)/3)` at `lg`, matching its `gap-x-8` — but wrapped in `flex flex-wrap justify-center` instead of `grid-cols-3`, since a 3-column grid with only 2 items would sit left instead of centering); stacked full-width on mobile (`flex-col`). Then H2 "Our Team" → Ramkrishna Mishra (Sales Head), Jainarayan Tiwari (Plant Manager), Akula Laxman Rao (Finance & Account), Pitabas Sahoo (Quality Head), Brijesh Choubey (Project & Corporate Affairs), through the unchanged `TeamGrid` component (same grid, same card markup, same photo sizes).

`TeamGrid.tsx` itself was deliberately NOT touched: `src/app/legal/page.tsx` also renders its own, separate, smaller team list (from `legal.json`, 3 names) through the same shared component, which is out of scope for this task.

Other places that read team-related data, checked and left alone (none needed a change): `src/app/our-team/[slug]/page.tsx` and `src/app/sitemap.ts`'s `TEAM_SLUGS` (individual member detail pages/routes — unaffected, they read their own per-member JSON files, not the grid order); `src/content/index.json` (catalog metadata only, no grouping); `src/content/seoMeta.ts` / `src/content/site.ts` (title/nav, no member list); `src/content/pages/trusted-concrete-supplier-in-raipur.json` (a text mention of "Vinit Tiwari and Pratham Bafna" as founders — just copy, not a rendered grid). No home-page team strip exists. No Person/Employee structured data references team members anywhere.

Verified: `rm -rf .next && npx tsc --noEmit` clean; `npm run build` succeeded (83 pages).

## Working hours line (feat/office-address)

Found exactly one live place the Day/Working-Hours table (Sunday–Saturday, "24 hours") renders: the Home page (`src/app/page.tsx`), next to "Why Raipur's Contractors Choose SolidMix RMC", driven by `workingHours` in `src/content/home.ts`. Checked every service/contact/product page's content JSON and `src/components` — no other page or component has this table. `src/content/pages/home.json` has an identical but dead-code copy of the same table (confirmed in an earlier entry: not imported by any route) — updated for consistency only, no visual effect.

Added the exact text "24x7x365 days" as one centered line between the "Working hours" heading and the table, in both places:
- `src/app/page.tsx`: `<p className="mt-4 mb-4 text-center text-xl font-bold text-primary md:mb-6 md:text-2xl">24x7x365 days</p>` — reuses `text-primary` (already the heading color on this page), and core Tailwind size/weight utilities already used elsewhere in the codebase; no new colors, fonts or dependencies. Removed the table's own `mt-8` since the new line's `mb-4`/`md:mb-6` now supplies that spacing — table rows, columns and the heading text are untouched.
- `src/content/pages/home.json`: added a matching `{ "type": "p", "text": "24x7x365 days" }` block between the "Working hours" heading block and the table block (dead code, kept in sync with `home.ts` only).

Convex blog posts: I have no way to read Convex-stored post bodies from this repo (no Convex access, `convex/` is protected, no Convex commands run) — I cannot confirm or rule out whether any blog post duplicates this table. None of the previously-known Convex posts (site-mix-concrete, solidmix-readymix-concrete, solidmix-rmc-supplier) were mentioned as having a working-hours table in earlier BUILD-LOG entries, but please check the Team Dashboard directly if this needs confirming.

Minor note, not changed: `src/content/index.json`'s `"blocks": 75` count for the `home` entry is now off by one (home.json gained a block) — this field is pure documentation, not read by any code (`src/lib/posts.ts` imports `index.json` but never reads `.blocks`), so left as-is rather than making an unrequested edit.

Verified: `rm -rf .next && npx tsc --noEmit` clean; `npm run build` succeeded (83 pages, same as above).

2026-11-28 Our Team page split into Our Directors and Our Team, and 24x7x365 days line added above the Working hours table on home, on feat/office-address; code build and tsc clean; Playwright run-all pending at commit time; not merged

2026-11-28 merged feat/office-address into main (7eaf073), pushed; live Vercel deploy follows; still waiting: Team Dashboard edits of 3 Convex posts on LIVE (site-mix-concrete and solidmix-readymix-concrete office line, solidmix-rmc-supplier link to /project-gallery/), Ma'am's written confirmation of the office address, Search Console re-index of /project-gallery/ and /plant-gallery/, Google Business Profile address, RESERVED_SLUGS update (backend, not done)

## Team photos replaced: Brijesh Choubey and Pitabas Sahoo (feat/team-photos-2)

Replaced `public/images/content/brijesh-choubey.webp` and `public/images/content/whatsapp-image-2025-12-13-at-2-37-23-pm.webp` (Pitabas Sahoo's card photo in `src/content/pages/our-team.json`) in place with the photos Ma'am sent — lossless WebP and pixel-identical to the originals (verified by pixel fingerprint), about 1.2 MB and 0.6 MB (`next/image` serves resized versions, not these full files, to visitors). The card frame on `/our-team/` is 4:5 with `object-top`, so Brijesh's photo (now 1144x1375, a taller-than-4:5 ratio) loses about 4% off each side when cropped into the frame. No code change, no JSON change — same file names, same path. Not merged.

## Header fit fix (feat/team-photos-2)

Measured cause (from a real browser, not re-derived here): the desktop header's 7-item nav alone is 1107px wide (280px of `px-[20px]` padding across the 7 items plus ~827px of text/chevrons), plus the 194px logo (`lg:h-[64px]`), two `lg:gap-[64px]` gaps, and `lg:px-[60px]` on both sides of the container — the header needs about 1680px of width to fit everything, but it only switched into this full desktop layout at Tailwind's `lg` (1024px). Below ~1680px the Book Us button (`ml-auto`, `flex-shrink-0`) was pushed past the right edge; because `body` has `overflow-x: clip`, it was simply invisible with no scrollbar — which is also why the earlier no-horizontal-scroll Playwright checks never caught it (nothing overflowed the document, the button was just clipped inside the header). At 1534px it was cut by about 145px; at 1440 and 1366 it was entirely off-screen. The new transparent logo only added 24px to a layout that was already too wide.

Fix, in `src/components/header/Header.tsx` only (every `lg:` in that file except the untouched logo-size classes):
- **≥1720px**: unchanged from before — nav item `px-[20px]`, container `gap-[64px]`, container `px-[60px]`, `h-[76px]`.
- **1600–1719px**: nav item `px-[14px]`, container `gap-[40px]`, container `px-[40px]`.
- **1440–1599px**: nav item `px-[8px]`, container `gap-[24px]`, container `px-[24px]`; text size stays 16px (unchanged).
- **Below 1440px** (now including 1024–1439px, previously desktop territory): hamburger layout — the desktop `<nav>`, the Book Us `<Link>`'s visibility, the hamburger `<button>`, and the backdrop/drawer `<div>`s all switch at `min-[1440px]:` instead of `lg:`; the container falls back to its existing mobile base (`h-[72px]`, `px-4`, `justify-between`, `max-w-[1360px]`).
- Verified in the built CSS (`.next/static/css/*.css`) that the three tiers compile in ascending order (`min-width:1440px` block, then `1600px`, then `1720px`), so at ≥1720px the largest tier's rule is declared last and wins the cascade — identical to today, and there is no breakpoint above 1720 for anything to change further.
- The Book Us `<Link>`'s own `xl:px-6 xl:text-[15px]` (unrelated sizing, not a visibility switch) was left untouched, as were the logo size classes (`h-[52px]!`/`lg:h-[64px]!`), the logo file, nav data, dropdown panel content, Book Us href/text/tracking, and all keyboard/state logic.

Checked for other files depending on the header's `lg:` breakpoint (grep across `src/components/header/` and for mobile-drawer/hamburger patterns elsewhere): `src/components/header/MobileActionBar.tsx` (the phone-only bottom Call/WhatsApp/Book Us bar) and `src/app/layout.tsx`'s `pb-16 lg:pb-0` on `<body>` still switch at the old `lg` (1024px) — **not changed**, since fixing it would also require editing `layout.tsx` (outside this task's allowed files) and it isn't required for the header clipping fix itself to work. Net effect: between 1024px and 1439px, the header is now correctly in hamburger mode, but the bottom action bar also disappears at 1024px (its own `lg:hidden`), so in that width range Book Us is reachable only via the hamburger drawer, not via a persistent header button or the bottom bar. Flagging this gap for a decision — it may be intentional (that width range is unusual, mostly small tablets) or may need `MobileActionBar`/`layout.tsx` moved to the same `min-[1440px]` threshold in a follow-up.

Checked the wide dropdown panels (`inset-x-0`, `mx-auto max-w-[1100px]`) for clipping in the 1440–1599px tier: not clipped. Their containing block for `inset-x-0` is the `<header>` itself (`position: sticky`, no width constraint), not the inner container, so they always span the full viewport width regardless of tier; the `max-w-[1100px]` inner content fits with 170px of margin on each side even at the narrowest 1440px viewport where they're visible.

Verified: `rm -rf .next && npx tsc --noEmit` clean; `npm run build` succeeded (83 pages, same as previous entries).

**Follow-up (2026-11-28, same day): stepped spacing replaced with fluid spacing.** The stepped 1440–1599px tier made the menu look congested for no reason — nav item padding stayed flat at 8px (16px text gap) across the whole tier while 221px of space sat unused next to Book Us at 1534px. Replaced the three stepped triples (nav item `px-[8px]/[14px]/[20px]`, container `gap-[24px]/[40px]/[64px]`, container `px-[24px]/[40px]/[60px]`) with one `clamp()` class each, so spacing now grows smoothly with viewport width: nav item padding 8px at 1440px growing to 20px at 1600px, container gap and padding 24px growing to 64px and 60px between 1600px and 1720px. The worst-case spare space (unused gap next to Book Us) is about 41px at 1720px. 1720px and wider is unchanged — all three `clamp()`s reach their fixed maximum by exactly 1720px, matching the original design.

2026-11-28 header fit fix committed on feat/team-photos-2: desktop header now fits at every width (1440 and up), hamburger menu below 1440px; real-browser header-fit-test measured Book Us fully inside the screen at 1440, 1536, 1600, 1680, 1728, 1920, 2560 and hamburger button inside at 1025-1366 and phone widths; phase7 test viewport changed from 1366 to 1440 because the desktop header now starts at 1440; MobileActionBar/layout.tsx still switch at lg (1024px), open item; not merged

## Footer logo box (feat/team-photos-2)

Measured cause (real browser, not re-derived here): the footer's first column, inside the `lg:grid-cols-6` grid, is only 188px wide at 1440px. The old logo box (`inline-flex ... p-8`) ate 64px of that (32px padding each side), leaving the logo only 124x66px to sit in — much smaller than the header logo's 194x64 (laptop) / 158x52 (phone).

New box, per Ma'am's white-background artwork set (Footer White Box 260x160): `src/components/Footer.tsx`'s `<span>` is now a fixed `w-full max-w-[260px] h-[160px]` white box (`flex items-center justify-center rounded-md bg-white`, no padding). The footer logo is now the exact same file and size classes as the header logo (`/images/solidmix-logo-v2-header.webp`, `h-[52px]! w-auto lg:h-[64px]! max-w-full` — same 194x64 laptop / 158x52 phone display size as the header; the `!` is required because of the unlayered `img { height: auto }` rule in `globals.css`, which was not touched). `public/images/solidmix-logo-v2-footer.webp` stays in the repo, now unreferenced by code — not deleted.

Grid change: `src/components/Footer.tsx`'s footer grid keeps `lg:grid-cols-6` for 1024–1279px (first column stays fluid, `w-full max-w-[260px]`, logo may shrink via `max-w-full` in that range — accepted) and adds `xl:grid-cols-[260px_repeat(5,minmax(0,1fr))]` from 1280px up, so the fixed 260px first column actually has room for the 260x160 box without changing the other 5 columns, their content, the grid's gaps, or padding.

Not changed in this task: the TM mark on the logo artwork is about 3% of the logo's width — small at this display size. Enlarging it is a separate proposal still waiting for Ma'am's approval; not done here.

Verified: `rm -rf .next && npx tsc --noEmit` clean; `npm run build` succeeded (83 pages, same as previous entries).
