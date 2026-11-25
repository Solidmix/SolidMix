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
