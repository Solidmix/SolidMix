# Product Context

## Why this project exists
SolidMix RMC (ready-mix concrete company, Raipur, Chhattisgarh; plant at Serikhedi, near Rawabhata) has a current WordPress site at https://solidmixrmc.com/ with broken (404) pages, duplicate URLs, and a weak mobile experience. We are building an improved replica to solve these problems without touching the live site.

## What it should do
- Reproduce the same look and all the same information as the original, page by page (~72 sitemap URLs: home, about, team, products list + 12 product pages, services, our work, calculator, safety, blogs, gallery, contact, appointments, careers, legal, privacy policy, blog posts, brochure PDF).
- Fix broken (404) pages and duplicate URLs with redirects (old URL paths keep working or 301-redirect).
- Be fully mobile responsive with a better mobile experience (mobile first, 375px, no horizontal scroll).
- Be SEO friendly (unique titles, meta descriptions, one H1, alt text, canonical, sitemap.xml, robots.txt, structured data) and AEO friendly (clear Q&A content, FAQ structured data, llms.txt).
- Add a "your area" dropdown to the Contact Us form (service areas; see docs/reference/service-areas.md).

## How it should work
- Deployed to its own Vercel review URL (noindex) so it does not compete with the original in Google.
- Indexing and any domain migration to solidmixrmc.com happen later, only after Ma'am's approval.

## User experience goals
- Visitors find the right concrete grade/product and the calculator easily.
- Mobile users get a smooth, scroll-friendly experience.
- Enquiries capture the customer's area via the Contact Us dropdown.
