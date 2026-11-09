# Tasks

- [~] Full audit of https://solidmixrmc.com/ - page inventory, 404 list, content capture, mobile/SEO/AEO review — **capture done, screenshots pending** (on branch audit/original-site, not committed)
- [ ] Desktop + mobile screenshots of every page (375px, 768px, 1440px)

## Build batches (design doc section 13)
- [x] B1 — project setup, design system, top bar, header + mobile drawer, footer, WhatsApp/Call buttons, smooth scroll, motion components, all 301 redirects, SEO base (metadata, robots, sitemap, JSON-LD), 404 page, Home page — built on branch build/b1-foundation-home, committed (41ecd1d) and pushed. Hero slider gap closed in B2.
- [~] B2 — About, Our Team + 6 members, Products list + 12 product pages, Services, plus (moved up from B3 per 2026-11-09 build prompt) Our Work, Safety, Gallery, Legal, Privacy Policy, and the Home hero slider/favicon fixes — **built on branch build/b2-pages, NOT committed.** lint + build pass; route/H1/JSON-LD/noindex/sitemap curl checks pass (28 URLs). Next: Saidul runs compare.js against the original, then commit/push B2.
- [ ] B3 — Blog index, 36 posts, categories, Calculator, Contact (area dropdown), Appointments, Careers
- [ ] B4 — Contact (area dropdown), Appointments, Careers (WhatsApp submit), llms.txt, full SEO/AEO + mobile pass
