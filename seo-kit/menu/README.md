# SolidMix RMC: New Menu Kit (Next.js + Tailwind)

Drop-in menu and sub-menu for the Next.js site on Vercel. Desktop mega menu, mobile drawer, sticky mobile action bar.

## What is in the kit

| File | Purpose |
|---|---|
| `src/data/navigation.ts` | The ONLY place the menu is defined. Edit links here, nowhere else. |
| `src/components/header/Header.tsx` | Desktop menu + mobile drawer (client component). |
| `src/components/header/MobileActionBar.tsx` | Sticky Call / WhatsApp / Book Us bar on phones. |
| `src/components/header/NavSchema.tsx` | Optional JSON-LD (SiteNavigationElement). |

## Install (15 minutes)

1. Copy `src/data` and `src/components/header` into the project (same relative paths, or adjust imports).
2. In `app/layout.tsx`:
   - replace the existing header with `<Header />`
   - add `<MobileActionBar />` and `<NavSchema />` just before `</body>`
   - add `pb-16 lg:pb-0` to the `<body>` class so the phone bar never covers the footer
3. In `Header.tsx`, check the logo `src` (`/images/solidmix-logo.webp`) matches the real file; use the same logo the current header uses.
4. In the footer, render `footerLegal` from `navigation.ts` (Privacy Policy, Legal Information). Legal pages are no longer in the main menu.
5. Tailwind tokens used: `primary`, `secondary`, `ink`, `grey-line`, `tint-pink`, `tint-cyan`. They already exist in the site's theme.
6. `npm run build`, then test the checklist below.

## Menu structure

- Home
- Ready Mix Concrete (overview + 4 columns: Structural, Fiber Reinforced, Special Purpose, Decorative & Bagged), 12 product pages
- RMC Services (Calculator, Quality & Safety)
- Our Projects (Gallery)
- Guides & Blog (Topics + Popular Guides)
- About Us (Our Team)
- Contact Us (dropdown: Book Us, Careers)
- Button: Book Us (contact page)

The first item in every dropdown is the overview page of that section.

## Why this is SEO and AEO friendly

- Every link is a real `<a href>` in the server-rendered HTML, including the mobile submenus (they are hidden, not removed), so Google and AI crawlers see the full menu without running JavaScript.
- Parent labels are links to overview pages, and sub-pages are one click from every page (strong internal linking).
- Labels are plain, descriptive and match what people search ("Waterproof Concrete", "Ready Mix Concrete").
- Menu is generated from one data file, so it can never drift from the sitemap.
- Optional SiteNavigationElement schema describes the menu to machines.
- No link points to a page that does not exist (all 33 URLs were checked and return 200 on 2026-11-21).

## Mobile and accessibility

- 44px hamburger, 46-52px tap rows, 48px buttons.
- Drawer locks page scroll, traps focus, closes on Esc, on backdrop tap and on page change.
- Chevron buttons have `aria-expanded` / `aria-controls`; current page has `aria-current="page"`.
- Desktop dropdown opens on hover, focus or the chevron button; Esc closes it.
- Sticky bottom bar gives one-tap Call, WhatsApp and Book Us.

## Test checklist

- [ ] Desktop 1280px: hover Ready Mix Concrete shows 4 columns, all links clickable, Esc closes.
- [ ] Tab key reaches every link; chevron opens submenu with Enter.
- [ ] Phone 375px: hamburger opens drawer, chevron expands, no horizontal scroll, bottom bar visible.
- [ ] View Source on a phone-width page: all submenu links appear in the HTML.
- [ ] Lighthouse accessibility 95+.
- [ ] Google Rich Results / Schema validator: NavSchema has no errors.

## Adding pages later (do NOT add before the page exists)

Planned: Concrete FAQ, Areas We Serve in Raipur, Concrete Grades Guide, Get a Quote. Build the page, confirm it returns 200, then add one line to `navigation.ts`. Delivery areas and grades must be confirmed by SolidMix before those pages are written (the FAQ document and website currently disagree on grades).

## Notes for the team

- Some existing URLs contain place names (`-in-sarona-raipur`, `-in-kumhari-raipur`) and one ends in `-2` (`heat-resistant-concrete-2`). They are kept as they are because they are already indexed. Renaming later needs 301 redirects in `next.config.js`.
- Dropdown "Our Projects" and "RMC Services" are short today; they grow as pages are added.
- Reminder: no one can guarantee position 1 on Google, ChatGPT, Gemini or Perplexity. This menu fixes the site-structure part; Google Business Profile, reviews and citations still matter.
