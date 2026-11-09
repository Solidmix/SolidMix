# Solid Mix Website Replica - Design

Date: 2026-11-09
Status: APPROVED by Saidul (approval given in the Build 1 prompt)
Reference material: docs/reference/original-site/ (content, assets, screenshots, design-tokens.md, animations.md, broken-links.md, inventory.md, content-conflicts.md, seo-aeo-gaps.md)

## 1. Goal
Rebuild https://solidmixrmc.com/ as a new, independent website that looks and reads exactly like the original (same UI, same sections, same text, images and videos), and fulfils only these requirements:
1. Fix all 404s and duplicate URLs (301 redirects; internal links point to live URLs).
2. Fully mobile responsive with a better mobile experience.
3. Contact Us form with a "your area" dropdown (docs/reference/service-areas.md).
4. SEO friendly.
5. AEO (AI answer engine) friendly.
Plus: smooth scrolling. The original WordPress site is never modified. The replica runs on its own Vercel URL (noindex) until Ma'am approves a domain move.

## 2. Hard rules
- No WordPress/Elementor/plugin code is copied (HTML, CSS, JS, PHP, tracking). Only content: text, images, videos, PDFs. The look is rebuilt from screenshots and design tokens.
- Content is copied exactly (including wording). Only rendering glitches are fixed (e.g. two phone numbers or two emails run together are shown separately; missing spaces in addresses). Content conflicts (grades, second phone number) stay as on the original until the client answers docs/reference/open-questions.md.
- Same URLs as the original (trailing slash kept) so Google rankings carry over.

## 3. Stack
Next.js (App Router, TypeScript, every page statically generated) + Tailwind CSS, Poppins self-hosted, content in JSON/Markdown files in the repo (no CMS, no database), next/image (WebP), self-hosted mp4 videos, Lenis smooth scrolling on desktop (native on touch), contact/appointment/career forms that open WhatsApp with a pre-filled message (email service later, see section 9), hosted on Vercel from GitHub Solidmix/SolidMix. trailingSlash: true.

## 4. Design system (from design-tokens.md)
- Colors: primary #9F1481 (magenta), secondary #167484 (teal), text #292929, white; section tints #FFD7F6, #DFF9FD, #F1FCFF; accent #FF00C8; greys #616161, #a5a5a5, #DAD8D8; dark #0E0E0E.
- Font: Poppins 300-800. Sizes, spacing and section order taken from the screenshots.
- Container ~1140px max (most content 1024-1140px). Breakpoints: mobile <=767, tablet 768-1024, desktop >=1025. Must work from 360px up with no horizontal scroll.

## 5. Global layout (every page)
- Top bar: phone +91 9893111201 (tel:), info@solidmixrmc.com (mailto:), socials Facebook, YouTube, Instagram, LinkedIn (original profile URLs from the capture).
- Sticky header: logo (Solidmix-Logo-Photoroom-1), nested menu exactly as original:
  Home | About Us > Our Team | Products > 12 products (Standard, Steel Fiber, PP Fiber, Waterproof, Heat Resistant, Stamped, Bagged, Permeable, Eco Friendly, Lightweight, Self Compacting, High Strength) | Our Services > Our Work, Calculator, Safety | Blogs > Gallery | Contact Us > Appointments, Careers | Legal > Privacy Policy.
  Desktop: hover dropdowns. Mobile: hamburger opens a full-height drawer with accordion submenus, large tap targets (>=44px), closes on navigation. Only ONE menu in the DOM per breakpoint (the original renders the menu twice).
- Footer: same columns as original (Useful Links, Phone Number, Email Address, Office Address, Plant Address), socials, copyright text as original.
- Floating WhatsApp button bottom-right (15px), wa.me/919893111201, same green style as the original "Click to Chat" button. Mobile improvement: a small floating Call button (tel:+919893111201) stacked above it on screens <=767px.

## 6. Pages and URLs (same paths as original)
Templates:
- Home: /
- Standard pages: /trusted-concrete-supplier-in-raipur/ (About), /rmc-services-in-raipur/, /our-work/, /safety/, /rmc-gallery-in-raipur/, /legal/, /privacy-policy/
- Forms: /ready-mix-concrete-contact-in-raipur/ (Contact + area dropdown), /appointments/, /careers/
- Calculator: /calculator/ (same volume calculator: unit Meter/Feet/Inches, length/width/height -> volume in cubic metres; same video)
- Products: /ready-mix-concrete-in-raipur/ (list) + 12 product pages under /ready-mix-concrete-in-raipur/<original-slug>/
- Team: /our-team/ + 6 members /our-team/<slug>/ (anand-sharma, pitabas-sahoo, pratham-bafna, purnendu-poddar, samrat-gupta, vinit-tiwari)
- Blog: /concrete-blog-in-raipur/ (index) + all 36 posts at their original root slugs (/<post-slug>/) + category pages /category/<slug>/ with pagination (/page/N/)
Every page keeps all sections and text of the original in the same order (pages/<slug>/content.md + screenshots).

## 7. Redirects (301) and link fixes
- /contact-us/ -> /ready-mix-concrete-contact-in-raipur/
- /about-us/ -> /trusted-concrete-supplier-in-raipur/ ; /about-us/<member>/ -> /our-team/<member>/
- /our-services/ -> /rmc-services-in-raipur/
- /products/ -> /ready-mix-concrete-in-raipur/ ; /products/<old-slug>/ -> matching product page (same mapping the original uses today)
- /our-blogs-and-news/ and /our-blogs-and-news/page/:n/ -> /concrete-blog-in-raipur/
- /construction/<post>/, /concrete-101/<post>/, /rmc-plant/<post>/, /public/<post>/ -> /<post>/
- /construction/ready-mix-concrete-in-bhilai-7-smart-benefits-for-stronger-construction/ -> /ready-mix-concrete-in-bhilai-benefits/
- /construction/top-7-innovations-in-ready-mix-concrete-technology-revolutionizing-construction-in-2025/ -> /concrete-blog-in-raipur/
- malformed /products/eco-friendly-concrete/https:/... -> /ready-mix-concrete-in-raipur/eco-friendly-concrete-in-saddu-raipur/
- date archives /:yyyy/:mm/:dd/ -> / (as original)
- /author/admin-2/ and its /page/:n/ -> /concrete-blog-in-raipur/
All internal links (CTAs "Get Instant Quote", "Contact us", "Schedule Appointment" etc.) point directly to the live page, never to a redirect. href="#" placeholders become the intended target or are removed if there is none. A custom 404 page in the same design links to Home, Products, Contact.

## 8. Motion and smooth scrolling (from animations.md)
- Entrance "slide in from right" (the SolidMix mixer truck and the other slideInRight elements): element starts off to the right and slides in once when it enters the viewport (~0.8s ease-out). Containers clip overflow so it never causes horizontal scroll.
- Fade (gallery), hover bob on the same elements as original, desktop-only mouse tilt on the same images.
- Sticky header, FAQ accordions, gallery lightbox, video players (LOGO-ORTHO-Linked-Comp-01-1.mp4, Cuboid-1.mp4, CEO-VINIT-SOLIDMIX-1.mp4) with poster and preload=metadata.
- Lenis smooth scroll on desktop; native momentum scrolling on touch. Everything respects prefers-reduced-motion (no motion, content visible).

## 9. Forms (updated 2026-11-09 by Saidul: no email service for now)
- Contact details (phone numbers, emails, addresses) are shown exactly as on the original site.
- No Resend or other email service in this phase (to be decided after Ma'am's review). No secrets needed.
- Contact: Name, Email (required), Contact No. (required, 10-digit Indian mobile), Your Area (required select grouped as in service-areas.md, plus "Other area" which reveals a text field), Message; button "Send". On submit the form is validated and opens WhatsApp (wa.me/919893111201) with a pre-filled message containing all fields, including the area. A small note under the button says the enquiry opens in WhatsApp; the phone and email links stay visible as alternatives.
- Appointments: First Name, Last Name, Email (required), Mobile Number, Date, Time, Topic select (same options as original); same WhatsApp pre-filled submit.
- Careers: First Name, Last Name, Email (required), Subject, Comments; same WhatsApp pre-filled submit. Resume upload cannot be sent through WhatsApp text, so the form shows "Please email your resume to info@solidmixrmc.com" with a mailto link instead of a file field.
- The submit logic sits in one small module so it can later be switched to an email service (Resend) without changing the forms.

## 10. SEO
- Per page: title and meta description from the original (seo.json); fill the 11 missing descriptions; exactly one H1; descriptive alt text on every image; canonical built from SITE_URL env; Open Graph tags.
- sitemap.xml (all live pages), robots.txt. While INDEXING env is not "on": robots disallow + noindex meta (review URL must not compete with the original).
- JSON-LD: Organization (+sameAs socials), LocalBusiness/ConcreteSupplier-style LocalBusiness with both addresses (Office: Office no. 418, 4th floor, Lalganga Business Park, Pachpedi Naka, Raipur, C.G. 492001; Plant: PH No. 77, Khasra No. 365/5, Serikhedi, Raipur, Chhattisgarh 492101), phone, email, 24x7 opening hours, areaServed from service-areas.md; Product on product pages; Article on blog posts; BreadcrumbList on inner pages; FAQPage wherever the page has Q&A.
- Performance targets (Lighthouse mobile): Performance >= 90, SEO 100, Accessibility >= 95, Best Practices >= 95.

## 11. AEO
- /llms.txt: who SolidMix RMC is, what it supplies (grades, products, services), minimum order, delivery time, 24x7, areas served, contact, key page links.
- Q&A content kept as visible FAQ sections with FAQPage schema; clear factual sentences (no hidden text).

## 12. Images and media
- Images from docs/reference/original-site/assets re-encoded to WebP (sharp) into public/images with clean names; responsive sizes; lazy below the fold. Brochure PDFs and videos served from public/.

## 13. Build batches
- B1: project setup, design system, top bar, header + mobile drawer, footer, WhatsApp/Call buttons, smooth scroll, motion components, all redirects, SEO base (metadata, robots, sitemap, JSON-LD helpers), 404 page, Home page complete.
- B2: About, Our Team + 6 members, Products list + 12 product pages, Services.
- B3: Blog index, 36 posts, categories, Gallery, Our Work, Safety, Calculator, Legal, Privacy.
- B4: Contact (area dropdown), Appointments, Careers (WhatsApp pre-filled submit), llms.txt, full SEO/AEO pass, mobile pass.
- Deploy to Vercel, then page-by-page comparison (scripts in .local-tools run by Saidul) and fixes.

## 14. Verification per batch
npm run build and lint pass; no horizontal scroll at 360/375/768/1024/1440; every built page compared side by side with the original screenshots (no missing section or text); internal link check (no 404); redirect check.

## 15. Open client questions (not blocking)
See docs/reference/open-questions.md: grade range wording, the second phone number, form email destination, analytics (Google Tag Manager is NOT carried over unless asked).
