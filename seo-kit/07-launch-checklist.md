# Launch checklist (Next.js on Vercel, domain on GoDaddy)

## Before launch (still on solidmix-omega.vercel.app, noindex ON)
- [ ] New menu installed from `menu/` (see `menu/README.md`); footer shows `footerLegal`; footer year is automatic; previous agency credit removed
- [ ] Titles/descriptions set from `01-seo-meta.csv`; brand appears once in every title; one H1 per page; titles <= 60 chars, descriptions <= 155
- [ ] Unconfirmed claims removed from the home meta ("24/7 supply", "M20 to M40") and anywhere else
- [ ] JSON-LD added (see 08) and passes Google Rich Results Test with zero errors; home Organization/LocalBusiness data matches Google Business Profile exactly
- [ ] FAQ answers are visible HTML and match FAQPage JSON-LD
- [ ] Breadcrumbs on every page except Home
- [ ] Redirects from `03-redirects.md` added and tested (`/blogs/`, `/about/`, `/contact/`, `/team/`...)
- [ ] `app/robots.ts` and `app/sitemap.ts` built as in `02-robots-and-sitemap.md`; no static `public/robots.txt`
- [ ] Forms deliver to the sales email and the database; spam protection on; test entries sent; thank-you state is noindex
- [ ] Calculator works on mobile and desktop
- [ ] Lighthouse mobile on Home, a product page and the calculator: LCP < 2.5 s, CLS < 0.1, INP < 200 ms, accessibility >= 95
- [ ] GTM events fire in Preview and GA4 DebugView (`05-tracking.md`)
- [ ] Crawl the Vercel site (Screaming Frog): zero 404s, zero chains, zero duplicate titles, zero missing H1
- [ ] Environment variables set for **Production** (GTM id, form/email keys) and no secrets in the repo

## Domain switch (GoDaddy to Vercel). Do at a quiet time
1. In Vercel: Project > Settings > Domains > add `solidmixrmc.com` and `www.solidmixrmc.com`. Set `solidmixrmc.com` as primary and make `www` redirect to it. Vercel then shows the exact DNS records to use.
2. In GoDaddy: My Products > Domains > DNS. Change the apex (`@`) **A record** and the **`www` CNAME** to the values Vercel shows (currently an A record to `76.76.21.21` and a CNAME to `cname.vercel-dns.com`, but copy what Vercel displays).
3. Do **not** change MX records (email keeps working) or TXT records used for email/verification.
4. If the old WordPress hosting is on the same GoDaddy account, do not delete it until the new site has been live and checked for a week. Keep a backup (but do not restore anything from it, see the security note in the spec).
5. Wait for DNS (minutes to hours). Vercel shows a green tick and issues the HTTPS certificate automatically.
6. Confirm `http://`, `www` and non-slash URLs all end on `https://solidmixrmc.com/...` in one hop.

## Launch day
- [ ] Remove the global noindex and the `Disallow: /` (see `02-robots-and-sitemap.md`); redeploy to Production
- [ ] View Source on live Home, one product and Contact: no `noindex`
- [ ] `https://solidmixrmc.com/robots.txt` shows `Allow: /` and the sitemap line
- [ ] `https://solidmixrmc.com/sitemap.xml` lists solidmixrmc.com URLs only
- [ ] Spot-check 10 old URLs: each lands on a working page in one hop
- [ ] Submit the sitemap in Google Search Console and Bing Webmaster Tools (verify the domain property by DNS TXT in GoDaddy)
- [ ] Request indexing for Home, Contact, Products overview
- [ ] Update the website URL on Google Business Profile and all social/directory profiles

## Weeks 1 to 4
- [ ] Search Console: check Pages (indexing) and Crawl stats daily for the first week
- [ ] Fix any 404s in Search Console or Vercel logs
- [ ] Start `06-local-ranking-and-ai-visibility.md`
- [ ] First monthly visibility report at day 30
