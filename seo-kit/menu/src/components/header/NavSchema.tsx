import { nav } from '../../data/navigation';

// Optional: tells search engines and AI assistants what the main menu is.
// Render once in app/layout.tsx:  <NavSchema />
// Change SITE if the canonical host changes.
const SITE = 'https://solidmixrmc.com';

export default function NavSchema() {
  const parts = nav.flatMap((item) => [
    { name: item.label, url: item.href },
    ...(item.groups ?? []).flatMap((g) => g.links.map((l) => ({ name: l.label, url: l.href }))),
  ]);
  const json = {
    '@context': 'https://schema.org',
    '@graph': parts.map((p) => ({
      '@type': 'SiteNavigationElement',
      name: p.name,
      url: SITE + p.url,
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
