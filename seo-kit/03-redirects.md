# Redirects (Next.js)

URLs on the new site deliberately keep the old WordPress slugs, so most old pages need **no** redirect. Only fix the gaps below.

## Already working (checked 2026-11-21)
| Old URL | Goes to |
|---|---|
| `/about-us/` | `/trusted-concrete-supplier-in-raipur/` (301) |
| `/contact-us/` | `/ready-mix-concrete-contact-in-raipur/` (301) |

## Still missing (404 today). Add these
| Old / likely URL | New URL | Why |
|---|---|---|
| `/blogs/` | `/concrete-blog-in-raipur/` | Old blog index, broken on the old site |
| `/blog/` | `/concrete-blog-in-raipur/` | Common guess |
| `/about/` | `/trusted-concrete-supplier-in-raipur/` | Common guess |
| `/contact/` | `/ready-mix-concrete-contact-in-raipur/` | Common guess |
| `/team/` | `/our-team/` | Common guess |
| `/appointments/`, `/book-appointment/`, `/appointment/` | `/ready-mix-concrete-contact-in-raipur/` | The Appointments page was removed; Book Us is the contact page |

## Add to `next.config.js`
```js
module.exports = {
  trailingSlash: true,
  async redirects() {
    return [
      { source: '/blogs/', destination: '/concrete-blog-in-raipur/', permanent: true },
      { source: '/blog/', destination: '/concrete-blog-in-raipur/', permanent: true },
      { source: '/about/', destination: '/trusted-concrete-supplier-in-raipur/', permanent: true },
      { source: '/contact/', destination: '/ready-mix-concrete-contact-in-raipur/', permanent: true },
      { source: '/team/', destination: '/our-team/', permanent: true },
      // add every row from your old-URL export below
    ];
  },
};
```
`permanent: true` sends a 308, which Google treats like a 301.

## Rules
1. **Export the full old URL list before the old site is switched off:** old sitemap, WordPress Pages and Posts lists, and Google Search Console (Pages and Performance reports, last 16 months).
2. Compare it against the new sitemap. Every old URL that is not in the new sitemap needs a row above.
3. Send each one to the closest matching page. If there is none, use the closest parent page. **Never send everything to the home page.**
4. One hop only. No chains (A to B to C).
5. Keep redirects at least 12 months.
6. `www.solidmixrmc.com` must redirect to `https://solidmixrmc.com/` (set in the Vercel domain settings, see 07).
7. Do not add a redirect for a URL that is itself live.

## If a slug is renamed later
Example: `heat-resistant-concrete-2` to `heat-resistant-concrete`. Add the redirect in the same release, update `navigation.ts`, the sitemap data and every internal link, then re-submit the sitemap. Do not rename slugs just before launch; do it as a separate, planned step.
