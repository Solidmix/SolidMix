# Tasks

- [~] Full audit of https://solidmixrmc.com/ - page inventory, 404 list, content capture, mobile/SEO/AEO review — **capture done, screenshots pending** (on branch audit/original-site, not committed)
- [ ] Desktop + mobile screenshots of every page (375px, 768px, 1440px)

## Build batches (design doc section 13)
- [~] B1 — project setup, design system, top bar, header + mobile drawer, footer, WhatsApp/Call buttons, smooth scroll, motion components, all 301 redirects, SEO base (metadata, robots, sitemap, JSON-LD), 404 page, Home page — **built on branch build/b1-foundation-home, NOT committed.** lint + build pass; redirect/H1/JSON-LD/noindex curl checks pass. Known gap: the home hero slider banner graphics (WhatsApp-Image-...-6.49.28/29-PM) were referenced on the original but never downloaded into assets, so the hero is rebuilt with the mixer-truck image instead of the exact banner slides — needs those source files to match 1:1.
- [ ] B2 — About, Our Team + 6 members, Products list + 12 product pages, Services
- [ ] B3 — Blog index, 36 posts, categories, Gallery, Our Work, Safety, Calculator, Legal, Privacy
- [ ] B4 — Contact (area dropdown), Appointments, Careers (WhatsApp submit), llms.txt, full SEO/AEO + mobile pass
