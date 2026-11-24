# robots.txt and sitemap (Next.js)

## Critical: the site is currently blocked from Google
On 2026-11-21 the live Vercel site returns:
- `robots.txt`: `User-agent: * / Disallow: /`
- `<meta name="robots" content="noindex, nofollow">` on every page

That is correct while it is a test site. **On launch day both must be removed.** If you forget, solidmixrmc.com will not appear in Google, ChatGPT, Gemini or Perplexity at all. It is the single most common launch mistake.

Find where it is set: search the project for `noindex`, `robots:` in `app/layout.tsx` metadata, `app/robots.ts` or `public/robots.txt`, and any `X-Robots-Tag` header in `next.config.js` or `vercel.json`.

## Production `app/robots.ts`
```ts
import type { MetadataRoute } from 'next';

const SITE = 'https://solidmixrmc.com';

export default function robots(): MetadataRoute.Robots {
  // Block everything on Vercel preview URLs, allow production only.
  if (process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/thank-you/', '/api/'] },
      // AI answer engines are allowed on purpose
      { userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Google-Extended'], allow: '/' },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
```
Delete any static `public/robots.txt` so there is only one source.

## Root layout metadata (no global noindex)
```ts
// app/layout.tsx
import type { Metadata } from 'next';
export const metadata: Metadata = {
  metadataBase: new URL('https://solidmixrmc.com'),
  title: { default: 'SolidMix RMC | Ready Mix Concrete in Raipur', template: '%s | SolidMix RMC' },
  // robots: leave out entirely. Do NOT set { index: false }.
  openGraph: { siteName: 'SolidMix RMC', locale: 'en_IN', type: 'website' },
};
```
The `template` adds " | SolidMix RMC" once. Pages must therefore set only the base title (see `title_base` in `01-seo-meta.csv`). This fixes today's duplicated "| SolidMix RMC | SolidMix RMC".

## `app/sitemap.ts`
Generate from the same data as the pages so it cannot drift. Include only live, indexable pages; use the canonical `https://solidmixrmc.com` host and the trailing slash.
```ts
import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/pages'; // list of { path, lastModified }

export default function sitemap(): MetadataRoute.Sitemap {
  return allPages.map((p) => ({
    url: `https://solidmixrmc.com${p.path}`,
    lastModified: p.lastModified,
  }));
}
```
Do not list `/thank-you/`, search pages or planned pages that do not exist yet.

## Trailing slash
The site uses trailing slashes (`/safety/`). Keep `trailingSlash: true` in `next.config.js` so `/safety` 308-redirects to `/safety/`, and canonical, sitemap and internal links all use the slash.

## Check after launch
- `https://solidmixrmc.com/robots.txt` shows `Allow: /` and the sitemap line, with no `Disallow: /`.
- View source of the home page: no `noindex`.
- `https://solidmixrmc.com/sitemap.xml` opens and lists solidmixrmc.com URLs (not vercel.app).
