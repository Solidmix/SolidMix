# SolidMix RMC: Website Spec for the Next.js Site

Version 2, 2026-11-21. Replaces the earlier WordPress spec.
Stack: Next.js (App Router, prerendered), Tailwind CSS, Poppins, hosted on Vercel. Domain solidmixrmc.com stays at GoDaddy and is pointed at Vercel.
Test URL: https://solidmix-omega.vercel.app

## 1. Goal and honest limits
Help people searching for ready mix concrete in Raipur find SolidMix, trust it and enquire, on Google and in AI answers (ChatGPT, Gemini, Perplexity).
No one can guarantee position 1 on any of them. The website controls structure, content and speed. Google Business Profile, reviews, listings and backlinks matter as much (file 06).

## 2. What the audit of the live Vercel site found (2026-11-21)
| # | Finding | Action |
|---|---|---|
| 1 | `robots.txt` is `Disallow: /` and every page has `noindex, nofollow` | Correct for testing. **Must be removed at launch** (file 02). |
| 2 | Titles repeat the brand: "... | SolidMix RMC | SolidMix RMC" on 7+ pages | Pages set base title only; root template adds the brand once. |
| 3 | Weak titles/descriptions: "Standard Concrete - Solidmixrmc", "Safety - Solidmixrmc"; meta descriptions are the first paragraph cut off | Replace from `01-seo-meta.csv`. |
| 4 | Home meta claims "24/7 supply" and "M20 to M40" | Remove until the client confirms. |
| 5 | Menu: generic labels, no overview link in dropdowns, 12 products in one flat list, a one-item "Legal" dropdown, no CTA, mobile submenu links not in the HTML, no mobile action bar | Replaced by the new menu kit (`menu/`). |
| 6 | `/about-us/` and `/contact-us/` redirect correctly; `/blogs/`, `/about/`, `/contact/`, `/team/` return 404 | Add redirects (file 03). |
| 7 | Place names in slugs (`-in-sarona-raipur`) and one `-2` slug | Keep for now (indexed); see section 5. |
| 8 | Overlapping blog posts (waterproof, boom pump, flooring) compete with product pages | Merge or differentiate; see section 5. |
| 9 | No FAQ, Areas We Serve or Grades pages | Planned; build only with confirmed facts. |
| 10 | Canonical tags already point to `https://solidmixrmc.com/...` | Good. Keep. |
| 11 | Home page already outputs Organization, LocalBusiness and many Place entries as JSON-LD | Keep one Organization; review the Place list (section 7). |

## 3. URL policy
- The new site keeps the old WordPress slugs, so existing rankings and links are preserved. No mass renaming before launch.
- Canonical host: `https://solidmixrmc.com` (no `www`), HTTPS, trailing slash (`trailingSlash: true`).
- Lowercase, hyphens only.
- Renaming a slug is allowed later as a planned step: add a 301 in `next.config.js`, update `navigation.ts`, sitemap data and internal links in the same release, resubmit the sitemap.

## 4. Menu (implemented in `menu/`)
- Home
- Ready Mix Concrete (overview + 4 columns: Structural, Fiber Reinforced, Special Purpose, Decorative & Bagged; 12 product pages)
- RMC Services (Calculator, Quality & Safety)
- Our Projects (Gallery)
- Guides & Blog (Topics, Popular Guides)
- About Us (Our Team)
- Contact Us (dropdown: Book Us, Careers)
- Button: Book Us (the contact page)
- Footer only: Privacy Policy, Legal Information
- Mobile: hamburger drawer with accordions, sticky bottom bar with Call, WhatsApp, Book Us.

Rules: real `<a href>` links in server-rendered HTML (including mobile submenus); the parent label links to its overview page; first line inside each dropdown is the overview; one data file (`navigation.ts`) drives header, mobile drawer and JSON-LD; never link to a page that does not return 200; 44px tap targets; keyboard and `aria-expanded` support.
Add planned pages (FAQ, Areas We Serve, Grades Guide) to the menu only after they exist.

## 5. Pages and content
All live pages and their H1, title and description are in `01-seo-meta.csv`.

Content rules (these matter more than any tool):
1. **Answer first:** the first 1-2 sentences under the H1 answer the page's main question.
2. One H1 per page; H2s in order, many written as questions.
3. Facts box near the top, confirmed facts only.
4. 4-6 FAQs on each product page, visible as HTML, matching the FAQ JSON-LD.
5. Internal links: up to the overview, across to related pages, to Book Us and the Calculator.
6. Breadcrumbs (with BreadcrumbList JSON-LD) on every page except Home.
7. Guides show a real author and a "last updated" date.
8. Images: `next/image`, real alt text, sizes set, WebP/AVIF.
9. Short paragraphs, plain words, no keyword stuffing.
10. Spelling: "Fiber" (as the live site and menu use). Use one spelling everywhere.
11. NAP (name, address, phone) identical on the site, in JSON-LD and on Google Business Profile.

Two content decisions for the client/SEO owner:
- **Place-name slugs.** Eight product slugs carry a neighbourhood. If SolidMix does not really operate there, this looks like doorway pages to Google. Safer path: after launch is stable, move to clean slugs (`/high-strength-concrete/`) with 301s. Do it as a separate release.
- **Overlap.** `/waterproof-concrete-in-raipur/`-type blog posts and the waterproof product page target the same query. Either point the blog to the product page with a link and different angle (how-to/FAQ), or 301 it.

## 6. Metadata
- Root layout: `metadataBase`, `title.template '%s | SolidMix RMC'`, no global robots rule.
- Each page: unique title (base only), description 120-155 chars, canonical, Open Graph.
- Code in `08-nextjs-code-snippets.md`.

## 7. Structured data (JSON-LD)
- Home: Organization + LocalBusiness (+ WebSite). Already present; verify the values. Review the Place entries: list only real, confirmed service areas.
- Products: Product + FAQPage + BreadcrumbList.
- Calculator: WebApplication. Guides: Article. Contact: ContactPage. Team: Person only for confirmed names.
- Menu: SiteNavigationElement (`NavSchema.tsx`).
- Do not mark up anything not visible on the page. Do not invent reviews or ratings.
- Validate with Google Rich Results Test; zero errors before launch.

## 8. robots.txt and sitemap
See `02-robots-and-sitemap.md`. Allow Googlebot, Bingbot and the AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Google-Extended). Sitemap generated from the same page data as the routes, solidmixrmc.com URLs only.

## 9. Redirects
See `03-redirects.md`. Add the four missing common URLs now and every row from the old-site export before the old site is turned off.

## 10. Performance and quality
- Prerender (static) every content page. Targets on mobile: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- `next/font` for Poppins; `next/image` for all images; no layout shift from the header.
- Accessibility: Lighthouse >= 95; keyboard-usable menu; contrast on magenta (#9f1481) buttons with white text is fine.
- Forms: spam protection, server-side validation, copy of every enquiry saved (database or email), confirmation state noindex.

## 11. Security and hosting
- Secrets only in Vercel environment variables, never in the repo or client code.
- The previous WordPress site was flagged for unusual files and an unknown admin account. Treat it and its backups as untrusted: do not copy plugins, themes or uploads from it. Re-export only content (text, images you have verified).
- Keep the old hosting for a week after the domain switch for rollback of DNS only, then decide with the client.
- GitHub: private repository, branch protection on `main`, 2FA for everyone with access. Vercel: 2FA, team members only.

## 12. Domain and launch
Procedure and checks are in `07-launch-checklist.md`: add `solidmixrmc.com` and `www` in Vercel, update A/CNAME records in GoDaddy (leave MX/TXT alone), wait for the HTTPS certificate, remove noindex and `Disallow: /`, verify, submit the sitemap, request indexing.

## 13. Tracking
GTM once in the layout; events `generate_lead`, `contact_form_submit`, `phone_click`, `whatsapp_click`, `book_us_click`, `calculator_used`, `file_download`. See `05-tracking.md`.

## 14. Waiting for the client
| Needed | Used for |
|---|---|
| Exact name, address, phone, email, hours, map position | Footer, contact, JSON-LD |
| Confirmed concrete grades (FAQ doc: M5-M80; website: M20-M40) | Product pages, FAQ, grades guide |
| Delivery areas | Areas page, FAQ, JSON-LD areaServed |
| Services, quality and safety practices | Services and Safety pages |
| Team names and titles | Team page |
| Google Business Profile, social links | Footer, JSON-LD sameAs |
| Analytics, Search Console, Meta pixel access | Tracking |
| GoDaddy DNS access, Vercel access | Launch |
| Prices, minimum order, delivery time, pump details | Publish only if approved; otherwise "contact us or call for a quote" |

## 15. Done means
- Menu matches section 4 on desktop and phone; every link is 200.
- Every page matches `01-seo-meta.csv`; one H1; brand once in titles.
- JSON-LD valid; FAQ text matches schema.
- Redirects tested; crawl shows no 404s, chains or duplicate titles.
- `robots.txt` and meta are production-ready; sitemap submitted.
- NAP matches Google Business Profile; forms deliver; calculator works.
- Tracking counts the key events.
- No unconfirmed claim anywhere (grades, prices, areas, lead times, "24/7").
