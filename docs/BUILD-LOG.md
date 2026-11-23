# Build log — Book Us page (seo-kit Phase 5B/5C)

Branch `seo-build`. Design: `docs/superpowers/specs/2026-11-21-book-us-page-design.md` (Build 1 backend, Build 2 frontend).

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

## Waiting for client

- **Grade list wording**: this form offers M5–M80 (per Ma'am's 2026-11-21 answer and the kit); other existing pages on the site still say "M20 to M40". Not changed elsewhere in this build — flagged as a site-wide inconsistency for a future pass.
- **Browser pin check**: Plant 1 (Serikhedi) and Plant 3 (Mana) map links are `share.google` short links that only resolve via a real browser (confirmed not resolvable with `curl` during the audit). Saidul checks all 3 pins before launch, per the kit's own README-PLACEMENT.md step 6 — confirm Plant 3 is not the forbidden Plus Code `5PJ6+FHJ`.
- **Kept office/video section**: confirm the retained Phone Number / Office Email / Office Address cards, office map, and CEO video section (below the new Book Us form and plant cards) are wanted in that position, or should be reordered/removed once the new sections are reviewed.
