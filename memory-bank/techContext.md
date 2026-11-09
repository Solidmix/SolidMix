# Tech Context

Status: PROPOSED - final after Saidul approves the design doc.
- Framework: Next.js (App Router) + TypeScript, every page statically generated (pre-rendered HTML).
- Styling: Tailwind CSS with the original brand tokens (#9F1481 primary, #167484 secondary, #292929 text) from docs/reference/original-site/design-tokens.md.
- Font: Poppins, self-hosted.
- Content: Markdown/JSON files in the repo (no CMS, no database).
- Images/videos: next/image (WebP, responsive, lazy); self-hosted mp4 videos with posters.
- Animations: lightweight CSS + IntersectionObserver (truck slide-in from right, fade, hover bob, desktop-only mouse tilt); respect prefers-reduced-motion; no horizontal overflow.
- Smooth scrolling: Lenis on desktop, native scrolling on touch devices.
- Contact form: Next.js server route, email via Resend, includes the service-area dropdown; spam protection with honeypot and rate limit.
- SEO/AEO: per-page metadata, canonical, sitemap.xml, robots.txt, JSON-LD (Organization, LocalBusiness, Product, FAQPage, BreadcrumbList, Article), llms.txt, 301 redirects for old/broken URLs. noindex while on the Vercel review URL.
- Hosting: Vercel (Solid Mix account), GitHub Solidmix/SolidMix.
- Testing: Playwright screenshot comparison with the original, link checker, Lighthouse - scripts kept in .local-tools/ and run by Saidul.
