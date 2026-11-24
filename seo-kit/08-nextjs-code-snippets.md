# Next.js code snippets (App Router)

## 1. Per-page metadata
Set only the base title; the root layout template adds " | SolidMix RMC".
```tsx
// app/ready-mix-concrete-in-raipur/standard-concrete/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Standard Concrete in Raipur',
  description: 'Standard ready mix concrete from SolidMix RMC in Raipur for slabs, columns, footings and everyday construction. Contact us.',
  alternates: { canonical: '/ready-mix-concrete-in-raipur/standard-concrete/' }, // resolves against metadataBase
  openGraph: { title: 'Standard Concrete in Raipur', url: '/ready-mix-concrete-in-raipur/standard-concrete/' },
};
```
Dynamic routes (blog posts, categories): use `generateMetadata` and read title/description from the post data; fall back to a trimmed first sentence, never the raw first 150 characters of the body.

## 2. JSON-LD helper
```tsx
// components/JsonLd.tsx
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
```
Use it inside the page component:
```tsx
<JsonLd data={{
  '@context': 'https://schema.org',
  '@graph': [productSchema(...), breadcrumbSchema([...])],
}} />
```
Start from the files in `schema/`. Replace every `REPLACE_` with a confirmed value.

The home page already outputs Organization, LocalBusiness and Place data. **Do not add a second Organization block on other pages** and do not duplicate the home one. Keep a single `@id` (`https://solidmixrmc.com/#organization`) and reference it from other pages (`"publisher": { "@id": "..." }`). Review the existing home JSON-LD: it lists many Place entries; keep only real, confirmed service areas.

## 3. Breadcrumbs component + schema together
```tsx
// components/Breadcrumbs.tsx
import Link from 'next/link';
import JsonLd from './JsonLd';

export default function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap gap-1">
          {all.map((it, i) => (
            <li key={it.href} className="flex items-center gap-1">
              {i < all.length - 1 ? <Link href={it.href}>{it.name}</Link> : <span aria-current="page">{it.name}</span>}
              {i < all.length - 1 && <span aria-hidden="true">/</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: all.map((it, i) => ({
          '@type': 'ListItem', position: i + 1, name: it.name, item: `https://solidmixrmc.com${it.href}`,
        })),
      }} />
    </>
  );
}
```

## 4. FAQ that keeps text in the HTML and feeds the schema
```tsx
// components/Faq.tsx
import JsonLd from './JsonLd';

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-h">
      <h2 id="faq-h">Frequently asked questions</h2>
      {items.map((f) => (
        <details key={f.q} className="border-b border-grey-line py-3">
          <summary className="cursor-pointer font-semibold">{f.q}</summary>
          <p className="mt-2">{f.a}</p>
        </details>
      ))}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((f) => ({
          '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }} />
    </section>
  );
}
```
One source (`items`) renders both the visible text and the schema, so they can never differ.

## 5. next.config.js
```js
module.exports = {
  trailingSlash: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() { /* rows from 03-redirects.md */ return []; },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    }];
  },
};
```
Do not add an `X-Robots-Tag: noindex` header at production. Vercel adds noindex to preview deployments automatically.

## 6. Check list for developers
- `npm run build` shows every page as static (`●` or `○`), none as `λ` unless it needs live data.
- `curl -s https://solidmixrmc.com/safety/ | grep -i "<h1\|noindex\|canonical"` returns exactly one H1, a solidmixrmc.com canonical, and no noindex.
- Run `npx lighthouse` or PageSpeed Insights on mobile for Home, a product page and the calculator.
