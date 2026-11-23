# SolidMix RMC: Next.js Developer Kit

Platform: Next.js (App Router) + Tailwind on Vercel. Domain: solidmixrmc.com on GoDaddy. **Not WordPress.**
Test site: https://solidmix-omega.vercel.app (currently blocked from Google on purpose).

Read `SolidMix-NextJS-Spec.md` first. Anything written `REPLACE_...` or **[CLIENT TO CONFIRM]** needs a confirmed client fact. Do not guess; do not publish placeholders.

## Files

| File | Use |
|---|---|
| `SolidMix-NextJS-Spec.md` | The full technical spec: structure, rules, what to fix. |
| `menu/` | Drop-in menu: `navigation.ts`, `Header.tsx`, `MobileActionBar.tsx`, `NavSchema.tsx`, its own README. Start here. |
| `contact-form/` | Ready-made Book Us page and form code (page, form, plant cards, API route, validation, Lead ID) with `README-PLACEMENT.md` saying where each file goes. |
| `01-seo-meta.csv` | Every page: live URL, H1, title, meta description, schema, notes on what to fix. |
| `02-robots-and-sitemap.md` | Remove the launch blockers; `robots.ts`, `sitemap.ts`, trailing slash. |
| `03-redirects.md` | Which old URLs still 404 and the `next.config.js` rows to add. |
| `04-page-templates.md` | Layout and starter copy for product, overview, contact (Book Us) and FAQ pages. |
| `05-tracking.md` | GTM/GA4 install for Next.js and the events to count. |
| `06-local-ranking-and-ai-visibility.md` | Google Business Profile, listings, reviews, monthly check. Marketing work, not code. |
| `07-launch-checklist.md` | Checks, GoDaddy-to-Vercel DNS switch, launch day. |
| `08-nextjs-code-snippets.md` | Metadata, JSON-LD, breadcrumbs, FAQ, config. |
| `schema/*.json` | JSON-LD templates to convert into the components in 08. |

## Order of work
1. Install the menu from `menu/`.
2. Fix titles, descriptions and the duplicated brand in titles from `01-seo-meta.csv`.
3. Add breadcrumbs, FAQ and JSON-LD (08).
4. Add redirects (03), `robots.ts` and `sitemap.ts` (02).
5. Add the Book Us page and form from `contact-form/` (follow its README, including the lead-store step). Add tracking (05).
6. Run the pre-launch checks in 07.
7. Switch the domain, remove the noindex, submit sitemaps (07).
8. Start 06 in the same week. It is what moves local rankings.

No one can guarantee position 1 on Google, ChatGPT, Gemini or Perplexity. This kit covers every part the website controls.
