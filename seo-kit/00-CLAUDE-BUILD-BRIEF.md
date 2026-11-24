# SolidMix RMC: Build Brief for Claude Code

**How the developer uses this (2 minutes):**
1. Unzip `SolidMix-NextJS-Developer-Kit.zip` into the website repo as a folder called `/seo-kit`.
2. Save THIS file in the repo root as `CLAUDE.md` (Claude Code reads it automatically).
3. Open Claude Code in the repo and say: **"Read CLAUDE.md and execute Phase 0 to Phase 8. Stop only at the STOP points."**
4. Do the few human-only steps listed in section 9 when Claude asks.

---

## 1. Your role and the goal
You are the lead developer for solidmixrmc.com, a ready mix concrete supplier in Raipur, India. The site is Next.js (App Router, prerendered), Tailwind v4, Poppins, hosted on Vercel. Test URL: https://solidmix-omega.vercel.app. Production domain: https://solidmixrmc.com (DNS at GoDaddy).

Goal: make the site SEO-friendly and AEO-friendly (easy for Google, ChatGPT, Gemini, Perplexity to read and quote), fast, mobile-responsive, and ready to launch. Do all code work yourself. Do not tell the developer to do things you can do.

Honest limit: nobody can guarantee position 1. Never write that promise anywhere. Build everything the website controls.

## 2. Sources of truth (read before coding)
All in `/seo-kit`:
- `SolidMix-NextJS-Spec.md`: the full spec. Where this brief and the spec differ, ask at a STOP point.
- `menu/`: ready-made `navigation.ts`, `Header.tsx`, `MobileActionBar.tsx`, `NavSchema.tsx`, README.
- `01-seo-meta.csv`: every page's H1, title, description. This is the content source for metadata.
- `02-robots-and-sitemap.md`, `03-redirects.md`, `04-page-templates.md`, `05-tracking.md`, `07-launch-checklist.md`, `08-nextjs-code-snippets.md`, `schema/*.json`.
- `06-local-ranking-and-ai-visibility.md` is marketing work, not code. Skip it except to read.

## 3. Hard rules (never break)
1. **Never invent facts.** Do not write prices, concrete grades, delivery areas, delivery times, pump details, certifications, team names, reviews, ratings, or "24/7". Anything marked **[CLIENT TO CONFIRM]** or `REPLACE_` stays out of the published page. Remove the line; do not publish brackets or placeholders.
2. **Never launch.** Do not remove the noindex or `Disallow: /` from Production, and do not set `SITE_INDEXABLE=true`. Build the switch (Phase 4); the human flips it at launch.
3. **Keep every existing URL.** No slug renames. Trailing slash everywhere. Lowercase, hyphens.
4. **Never link to a page that returns 404.** Menu links must all be real, built pages.
5. **Secrets** only in environment variables, never in code, commits, or chat.
6. **Do not copy anything from the old WordPress site** (plugins, themes, uploads). It is untrusted.
7. **Work on a branch** `seo-build`, commit after each phase with a clear message. Do not push to `main` and do not deploy to Production. Preview deployments are fine.
8. Spelling is "Fiber" everywhere. Use the original SolidMix logo file untouched.
9. Facts to use as given: phone +91 9893111201, WhatsApp https://wa.me/919893111201, email info@solidmixrmc.com. Address, hours and map position are **[CLIENT TO CONFIRM]**: take them from the existing site footer/contact page if present; otherwise leave out.

## 4. Phases (execute in order; run the checks after each)

### Phase 0: Inspect
- Read repo structure, `package.json`, `app/` routes, layout, existing components, Tailwind tokens (primary #9f1481, secondary #167484, ink #292929, grey-line #dad8d8, tint-pink, tint-cyan).
- Run `npm install` and `npm run build`. Record the baseline: pages, warnings, and where `noindex` / robots currently come from.
- Create `docs/BUILD-LOG.md`. Log every phase there: what changed, what was skipped, open questions.

### Phase 1: Menu
- Copy `seo-kit/menu/src/*` into the project (adapt import paths to the repo). Wire `Header`, `MobileActionBar` and `NavSchema` into the root layout, replacing the old header.
- Use ONE data file (`navigation.ts`). Every link is a real `<a href>` in server HTML, including mobile submenus. Parent labels link to their overview pages. First link in each dropdown is the overview.
- Keep only links to pages that exist and return 200. Planned pages (FAQ, Grades Guide) stay out until built. There is no separate Areas We Serve page: the areas live on the Book Us page (Phase 5C).
- Footer: logo, short description, NAP, phone, WhatsApp, email, main product links, Calculator, Projects, Guides, Contact, About, Team, Careers, Privacy Policy, Legal Information, copyright with dynamic year. **Remove the previous agency credit.**
- Check: desktop and 375px mobile; keyboard Tab/Enter/Esc; `aria-expanded` toggles; tap targets 44px or more; view-source shows all menu links.

### Phase 2: Metadata
- Root layout: `metadataBase: new URL('https://solidmixrmc.com')`, `title.template: '%s | SolidMix RMC'`, default title, `trailingSlash: true` in `next.config`.
- For every page in `01-seo-meta.csv`, set base title only (no brand, since the template adds it), description 120 to 155 characters, canonical, Open Graph, one H1 exactly as listed. Fix the "SolidMix RMC | SolidMix RMC" duplicate.
- Remove "24/7" and "M20 to M40" from every title, description and body copy.
- Dynamic routes (blog etc.): `generateMetadata` using the post's own description; never raw truncated body text.
- Check: a script that fetches the built pages and asserts one `<h1>`, one `<title>` with the brand once, a description of 120 to 155 characters, a solidmixrmc.com canonical.

### Phase 3: Structured data and content components
- Create `JsonLd`, `Breadcrumbs` (visible + BreadcrumbList), and `Faq` (visible `<details>` + FAQPage from the same array). Snippets are in `08-nextjs-code-snippets.md`.
- Home: keep ONE Organization + LocalBusiness (+ WebSite) with a stable `@id` `https://solidmixrmc.com/#organization`. **Review the existing Place entries: keep only areas confirmed on the existing site's contact or footer; otherwise remove them and list the removed names in `BUILD-LOG.md` for the client to confirm.**
- Products: Product + BreadcrumbList on the 12 product pages. FAQPage only where the page has FAQs with confirmed answers (Phase 5).
- Calculator: WebApplication. Contact: ContactPage. Guides: Article with real author and dateModified if available.
- Never mark up anything not visible on the page. No fake reviews or ratings.
- Check: every JSON-LD block parses; no duplicate Organization; breadcrumbs on all pages except Home.

### Phase 4: robots, sitemap, indexing switch
- `app/robots.ts`: if `process.env.VERCEL_ENV === 'production' && process.env.SITE_INDEXABLE === 'true'`, allow all (including GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended, Bingbot), plus `sitemap: https://solidmixrmc.com/sitemap.xml`. Otherwise `Disallow: /`.
- Replace any hardcoded `noindex` in layouts with `robots: { index: indexable, follow: indexable }` using the same condition.
- `app/sitemap.ts`: generated from the same page data as the routes, solidmixrmc.com absolute URLs, trailing slashes; exclude thank-you states and noindex pages.
- Add `/thank-you/` style states as `noindex` always.
- Check: build locally with and without `SITE_INDEXABLE=true`; both outputs behave correctly; sitemap lists only 200 pages. Document the switch in `docs/LAUNCH.md`.

### Phase 5: Content and templates
- Apply `04-page-templates.md`: answer-first paragraph under H1, facts box, uses, how-to-order, buttons (Book Us, Calculator), related links, breadcrumbs.
- Only confirmed facts. Where `[CONFIRM]` exists, omit the line and record it in `BUILD-LOG.md` under "Waiting for client".
- FAQ: add only the generic questions from the starter FAQ whose answers need no unconfirmed facts (for example "What is ready mix concrete?", "How much concrete do I need?" pointing to the Calculator, "How do I order?" using only call/WhatsApp/the Book Us form). Skip the rest.
- Contact page = Book Us: build per Phase 5C (booking type incl. boom/line pump, plant picker, maps, numbers, areas). Do not create `/appointments/`.
- Do not create the FAQ or Grades pages and do not add them to the menu. Areas We Serve is a section of the Book Us page (Phase 5C), not its own page.
- There is NO Appointments page. The header button and mobile bar say "Book Us" and go to the contact page. `/careers/` stays live and is linked from the Contact Us dropdown (Book Us, Careers), not from About Us.
- Images: `next/image`, real alt text, width/height set, `priority` only for the first image. Fonts via `next/font`.
- Answer, facts box and FAQ must be in server HTML (view-source test); no `useEffect` loading, no click-only tabs.

### READY-MADE CODE for Phases 5B and 5C: `seo-kit/contact-form/`
Start from this code instead of writing the form from scratch. Read `seo-kit/contact-form/README-PLACEMENT.md` first. Copy files to the same paths under `src/`: `data/plants.ts`, `data/bookingOptions.ts`, `lib/leadId.ts`, `lib/validateBooking.ts`, `lib/leadStore.ts`, `components/book-us/BookUsForm.tsx`, `components/book-us/PlantCards.tsx`, `app/api/book-us/route.ts`, and `app/ready-mix-concrete-contact-in-raipur/page.tsx`. Adapt styling to the site and fix anything that does not compile, but keep the rules in the spec. `lib/leadStore.ts` is a stub: implement it with what the repo already has, or STOP and ask.

### Phase 5B: Plant + delivery-area picker on the Contact form 
Data comes from ONE file, `src/data/plants.ts`, created from `seo-kit/plants.template.json`. **The client has confirmed all 3 plants (names, addresses, shared phone, areas). Use them exactly; never add, remove or invent plants or areas, and never show distances.** If any value is changed later, the client must confirm it.

Behaviour:
- Field 1, "Nearest plant" (required): a native `<select>` with the 3 plants, plus the option "Not sure / not listed".
- Field 2, "Delivery area" (required once a plant is chosen): a native `<select>` filled with that plant's areas, grouped with `<optgroup>` using each plant's `areaGroups` (for example "Within Raipur city", "Naya Raipur side"), first option "Your Area", last option "Other area (type below)". The client's existing grouped dropdown looks like this; match its group order and labels.
- `plants.template.json` is complete and client-confirmed: all 3 plants publish. Plant 2 is named Rawabhata (Bilaspur Highway) with address Kanhera. Plants 2 and 3 have no street address beyond locality, so show the address as given and do not invent a street.
- Native selects only (best on phones, accessible, no library). Visible labels, not placeholder-only. Tap targets 44px or more. Errors announced with `aria-live`.
- Server-side validation: the submitted plant and area must exist in `plants.ts`, or be the "Not sure" / "Other" options. Reject anything else.
- The saved or emailed enquiry includes plant, area, free-text location, name, phone and project details. The email subject starts with the plant name so the right team sees it.
- This is the single enquiry form (there is no Appointments form). Do not change other forms.
- Do NOT claim delivery times, charges or guaranteed coverage near these fields. Helper text only: "Choose the plant nearest your site. Our team will confirm availability."
- Tracking: add `plant` and `delivery_area` to the `generate_lead` and `contact_form_submit` events.
- SEO: the options live in the form only. Do not create new pages from them. Add `areaServed` to the LocalBusiness JSON-LD only for areas the client confirmed. Do not put area names in titles or the menu.
- Check: type-check passes; tests: valid plant+area accepted, mismatched pair rejected, "Not sure" with free text accepted; keyboard-only completion works at 375px.

### Phase 5C: Book Us page = Areas We Serve + plant maps + numbers + booking form (`/ready-mix-concrete-contact-in-raipur/`)
The Book Us page is the contact page. There is NO separate Areas We Serve page; the areas live here, built only from `src/data/plants.ts` (client-confirmed). Page order:
1. H1 "Contact SolidMix RMC in Raipur" (Book Us in the menu), answer-first line, Call and WhatsApp buttons with the contact number (+91 98931 11201, from `plants.ts`).
2. **Booking form** (Phase 5B fields, one form). Fields, in order (from the client's requirement list, 2026-11-21):
   - "What is this about?" (required): "Ready Mix Concrete" or "Others". If "Others" is chosen, a required text area appears: "Tell us what you expect" (min 10 characters, server-validated). The pump choice is its own field below, not a booking type.
   - **Customer category** (required, native select): Individual, Contractor, Builder, Infrastructure company, Dealer.
   - **Grade enquiry** (shown for concrete): M5, M10, M15, M20, M25, M30, M35, M40, M45, M50, M55, M60, M65, M70, M75, M80, then "Other grade" which shows a required text field "Write the grade you need", and "Not sure". The client said the list starts at M5; the M80 end and the steps of 5 are taken from the FAQ document (M5-M80) and are NOT confirmed (the website says M20-M40), so the options live in one `grades` array in `src/data/` and the page must not state which grades are "available" anywhere else. Helper text: "Our team will confirm the grade and mix for your project." The grade the visitor writes is stored as free text and never shown publicly. Record in `BUILD-LOG.md` for client confirmation.
   - **Nearest plant** (Plant 1 / 2 / 3 / Not sure) and dependent **Delivery area** (the plant's `areaGroups`, plus "Other area (type below)").
   - **Pump requirement** (required): Boom pump, Line pump, Only dump (no pump), Not sure. "Only dump" is the client's wording: concrete is discharged without a pump. Confirm the label with the client. No capacity, rates or availability claims.
   - **Tentative pour date and time** (native date input, today or later, plus a native time input; both optional, "Not decided" allowed; save as a local India time string, show no promise that the slot is available) and **quantity** (cubic metres, number, with a range check; "Not sure" allowed).
   - Name, phone (validated), email (optional), **site location with a "Use my location" button next to the field** (see below), message. Email subject starts with the Lead ID, then plant name.
   - **Automatic location identification and delivery feasibility** (keep it honest): as the user picks a plant and area, show a neutral status line from `plants.ts` only. If the area is on the chosen plant's confirmed list: "This area is on our served list for [plant]. Our team will confirm availability for your site." If it is not, or "Other": "We'll check this location and get back to you." Never "guaranteed", never a delivery time, charge or distance. The "Use my location" button sits beside the Site location field; pressing it may ask the browser for permission and, if granted, send coordinates with the lead to help the team; it does not auto-pick a plant or promise feasibility unless the client supplies confirmed plant coordinates (STOP and ask). Nothing is requested before the user presses the button, and denial must not block the form.
   - **Automatic lead creation with a unique Lead ID**: on every valid submit the server saves the lead (all fields, timestamp, source page, plant, area, coordinates if given) and generates a unique ID such as `SM-YYMMDD-XXXX` (date plus a random 4-character code, uniqueness checked on insert). Show the Lead ID on the confirmation state, put it in the email subject and body, and push it in `generate_lead`. If the repo has no database or lead store, STOP and ask the developer (do not invent one). Lead ID is never put in the URL; no name, phone or email goes into dataLayer.
   - Server validates every select against `plants.ts`, the `grades` list and the fixed category and pump lists; reject anything else.
3. **Plants section**: one card per plant with name, address as given, phone, an embedded Google Map (lazy-loaded iframe, `title` set, using the plant's confirmed address or Plus Code, with a plain "Open in Google Maps" link underneath that works without JavaScript) and the areas served grouped by `areaGroups` as real HTML lists. No distances or delivery-time promises.
   - Map pins: Plant 1 address is full. Plants 2 and 3 are locality-only. Before launch the human checks each pin against the real plant. The Plus Code `5PJ6+FHJ` for Plant 3 pointed at another company's listing during research, so do NOT use it; use the client-confirmed Mana address and flag it in `BUILD-LOG.md`.
4. FAQ (visible, feeds FAQPage JSON-LD from the same array): "Which areas does SolidMix deliver to?" and "How do I know which plant is nearest?". No other answers.
5. JSON-LD: ContactPage + BreadcrumbList + FAQPage. Each plant as LocalBusiness only with confirmed name, address, phone, `areaServed` for confirmed areas, `parentOrganization` pointing to `https://solidmixrmc.com/#organization`. No page per area.
- Check: static page, areas and numbers in view-source, one H1, valid JSON-LD, maps lazy-load and do not hurt LCP, keyboard completion at 375px, tests from 5B plus category, pump, grade, date and quantity validated server-side, and a unique Lead ID on every saved lead.

### Phase 6: Redirects
- Add to `next.config` (permanent): `/blogs/` and `/blog/` to `/concrete-blog-in-raipur/`; `/about/` to `/trusted-concrete-supplier-in-raipur/`; `/contact/` to `/ready-mix-concrete-contact-in-raipur/`; `/appointments/`, `/appointment/` and `/book-appointment/` to `/ready-mix-concrete-contact-in-raipur/`; `/team/` to `/our-team/`. `/about-us/` and `/contact-us/` already work; leave them.
- If `/seo-kit/redirects-from-old-site.csv` exists, add every row. Single hop, no chains, no redirect to home as a catch-all.
- Check: a script requests every redirect source and asserts a 301/308 with one hop to a page returning 200.

### Phase 7: Tracking
- GTM (container ID from env `NEXT_PUBLIC_GTM_ID`; if missing, skip loading and log it) via `next/script`, once, in the layout. Follow `05-tracking.md`.
- dataLayer events: `generate_lead`, `contact_form_submit`, `phone_click`, `whatsapp_click`, `book_us_click`, `calculator_used`. Attach to the real buttons, forms and calculator.
- Forms: spam protection, server-side validation, enquiry saved or emailed (use what the repo already has; if nothing exists, STOP and ask).

### Phase 8: Quality gate
Run and fix until all pass; report honestly if something cannot be fixed:
- `npm run build` has no errors, and content pages are static.
- A crawl script (write one in `scripts/audit.mjs`) over the built site: no 404 internal links, no redirect chains, no duplicate titles or descriptions, one H1 per page, sitemap URLs all 200.
- Lighthouse mobile on Home, one product page, Calculator: Performance 85 or more as the target, Accessibility 95 or more, SEO 100. Report the actual scores.
- Confirm in the production-mode build that robots still says `Disallow: /` (launch is a human step).
- Write `docs/LAUNCH.md` with the exact human steps (section 9) and `docs/BUILD-LOG.md` final summary: done, skipped, waiting for client, risks.
- Open a pull request `seo-build` to `main` with that summary. Do not merge.

## 5. STOP points (ask the developer; otherwise keep going)
- The repo has no form backend or database and Phase 7 needs one.
- A required page from the CSV does not exist in the repo and you cannot tell whether to create it.
- A change would rename or remove an existing URL.
- Anything needs a secret, account access, or a paid service.
- A fact is needed that is not in the repo, the kit or this brief.

## 6. Do not
Add features not in this brief; restyle the site beyond the menu and footer; add heavy third-party scripts; add a second Organization block; hide content behind click-to-load; claim or imply a guaranteed ranking.

## 7. Definition of done
The pull request is open, the build and audit pass, the Phase 8 report is honest about gaps, and `docs/BUILD-LOG.md` lists every open item for the client. Nothing unconfirmed is published, and production indexing is still off.

## 8. Items the client must confirm (Claude lists these in BUILD-LOG.md, never guesses)
Exact address, hours and map position; concrete grades (FAQ doc says M5 to M80, website says M20 to M40); delivery areas; services, quality and safety practices; team names and titles; prices and delivery times (publish only if approved); Google Business Profile and social links; Analytics, Search Console and Meta pixel access.

## 9. Human-only steps at launch (go in `docs/LAUNCH.md`)
1. Client confirms the facts in section 8; the developer gives Claude the answers; Claude updates the pages.
2. In Vercel: add `solidmixrmc.com` and `www.solidmixrmc.com`; set solidmixrmc.com as primary with www redirecting to it.
3. In GoDaddy DNS: change only the apex A record and the www CNAME to the values Vercel shows. Do not touch MX or TXT records.
4. Wait for the HTTPS certificate in Vercel. Merge the PR to `main`.
5. In Vercel Production environment variables set `SITE_INDEXABLE=true`, then redeploy. View the live page source to confirm there is no noindex and robots.txt allows crawling.
6. Add the site to Google Search Console and Bing Webmaster Tools, submit `https://solidmixrmc.com/sitemap.xml`, and request indexing for Home, Contact and the Products overview.
7. Update the website address on Google Business Profile and all social pages (see `seo-kit/06-local-ranking-and-ai-visibility.md`). Check Search Console daily for a week.
