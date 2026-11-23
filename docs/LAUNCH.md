# Launch — human-only steps

The site stays `noindex` / `Disallow: /` until these steps are done by a human (Saidul), per `seo-kit/00-CLAUDE-BUILD-BRIEF.md` section 9. Claude Code never flips this switch.

The indexing switch is `process.env.VERCEL_ENV === 'production' && process.env.SITE_INDEXABLE === 'true'` (see `src/app/robots.ts` and `src/app/layout.tsx`). Both conditions must be true — Preview deployments are always blocked regardless of `SITE_INDEXABLE`.

1. Client (Ma'am) confirms the open facts in `docs/BUILD-LOG.md` ("Waiting for client"); Saidul gives Claude the answers; Claude updates the pages.
2. In Vercel: add `solidmixrmc.com` and `www.solidmixrmc.com` as domains; set `solidmixrmc.com` as primary with `www` redirecting to it.
3. In GoDaddy DNS: change only the apex A record and the `www` CNAME to the values Vercel shows. Do not touch MX or TXT records.
4. Wait for the HTTPS certificate in Vercel. Merge the `seo-build` PR to `main`.
5. In Vercel Production environment variables, set `SITE_INDEXABLE=true`, then redeploy. View the live page source to confirm there is no `noindex` and that `robots.txt` allows crawling.
6. Add the site to Google Search Console and Bing Webmaster Tools, submit `https://solidmixrmc.com/sitemap.xml`, and request indexing for Home, Contact and the Products overview.
7. Update the website address on Google Business Profile and all social pages. Check Search Console daily for a week.

## Check after launch

- `https://solidmixrmc.com/robots.txt` shows `Allow: /` plus the `Sitemap:` line, no `Disallow: /`.
- View source of the home page: no `noindex`.
- `https://solidmixrmc.com/sitemap.xml` opens and lists `solidmixrmc.com` URLs (not `vercel.app`).
