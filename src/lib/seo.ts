import type { Metadata } from "next";
import { site } from "@/content/site";
import type { PageContent } from "@/lib/content";
import { stripBoldMarkers } from "@/lib/content";
import { seoMetaOverrides } from "@/content/seoMeta";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://solidmixrmc.com").replace(/\/$/, "");

export function absUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Falls back to the first paragraph (trimmed to 155 chars) when a page has no
// extracted meta description — never invents facts, only truncates real copy.
export function metaDescriptionFrom(content: PageContent): string {
  if (content.description && content.description.trim()) return content.description.trim();
  const firstPara = content.blocks.find((b) => b.type === "p") as { text: string } | undefined;
  if (!firstPara) return content.title;
  const text = stripBoldMarkers(firstPara.text).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text;
}

export function pageMetadata(content: PageContent, pagePath: string, ogImage?: string): Metadata {
  // seo-kit/01-seo-meta.csv (Phase 2) overrides the scraped title/description
  // when a row exists for this path — see src/content/seoMeta.ts. Fixes the
  // duplicated-brand titles and the weak legacy titles without editing the
  // content JSON itself.
  const override = seoMetaOverrides[pagePath];
  const title = override?.title ?? content.title;
  const description = override?.description ?? metaDescriptionFrom(content);
  const url = absUrl(pagePath);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      ...(ogImage ? { images: [{ url: absUrl(ogImage) }] } : {}),
    },
  };
}

// Display-only H1 override (seo-kit/01-seo-meta.csv Phase 2). `originalH1` is
// still what every page passes to stripChrome() to dedupe the body's own
// heading block — only the rendered <h1> text changes here, never the
// content JSON or the dedup match.
export function resolveDisplayH1(pagePath: string, originalH1: string): string {
  return seoMetaOverrides[pagePath]?.h1 ?? originalH1;
}

// Service areas for LocalBusiness areaServed — kept to names that are
// actually present in src/data/plants.ts's client-confirmed areaGroups
// (seo-kit Phase 3: "keep only areas confirmed ... remove the rest").
// "Pachpedi Naka" was removed here (2026-11-23): not in plants.ts; it stays
// in the office-address body copy, which is untouched.
const areaServed = [
  "Raipur",
  "Naya Raipur",
  "Atal Nagar",
  "Bhilai",
  "Durg",
  "Kumhari",
  "Charoda",
  "Mandir Hasaud",
  "Tatibandh",
  "Telibandha",
  "Shankar Nagar",
  "Mowa",
  "Pandri",
  "Tikrapara",
  "Chhattisgarh",
];

// Single Organization+LocalBusiness entity (stable @id) plus a WebSite
// entity that references it — seo-kit Phase 3: "ONE Organization +
// LocalBusiness (+ WebSite) with a stable @id https://solidmixrmc.com/#organization",
// never a second Organization block anywhere else on the site.
export function organizationLd() {
  const orgId = `${SITE_URL}/#organization`;
  return [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness"],
      "@id": orgId,
      name: site.name,
      url: SITE_URL,
      logo: absUrl("/images/solidmix-logo.webp"),
      image: absUrl("/images/solidmix-logo.webp"),
      email: "info@solidmixrmc.com",
      telephone: "+919893111201",
      priceRange: "₹₹",
      sameAs: site.socials.map((s) => s.href),
      address: [
        {
          "@type": "PostalAddress",
          name: "Office",
          streetAddress: "Office no. 418, 4th floor, Lalganga Business Park, Pachpedi Naka",
          addressLocality: "Raipur",
          addressRegion: "Chhattisgarh",
          postalCode: "492001",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          name: "Plant",
          streetAddress: "PH No. 77, Khasra No. 365/5, Serikhedi",
          addressLocality: "Raipur",
          addressRegion: "Chhattisgarh",
          postalCode: "492101",
          addressCountry: "IN",
        },
      ],
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
      areaServed: areaServed.map((name) => ({ "@type": "Place", name })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: site.name,
      publisher: { "@id": orgId },
    },
  ];
}

export function faqPageLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: stripBoldMarkers(item.q),
      acceptedAnswer: { "@type": "Answer", text: stripBoldMarkers(item.a) },
    })),
  };
}

export function breadcrumbLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: absUrl(item.url) } : {}),
    })),
  };
}

export function articleLd({
  headline,
  datePublished,
  dateModified,
  image,
  url,
}: {
  headline: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    datePublished,
    ...(dateModified ? { dateModified } : {}),
    image: absUrl(image),
    url: absUrl(url),
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: absUrl("/images/solidmix-logo.webp") },
    },
  };
}

export function productLd({
  name,
  description,
  image,
}: {
  name: string;
  description: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: absUrl(image),
    brand: { "@type": "Brand", name: "SolidMix" },
    manufacturer: { "@type": "Organization", name: "SolidMix RMC" },
  };
}

// seo-kit/schema/article-and-webapp.json's "webapplication" block — the
// calculator is a free on-site tool, so price 0 INR is not an unconfirmed
// fact (hard rule #1), just a description of the free tool itself.
export function webApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "SolidMix Concrete Volume Calculator",
    url: absUrl("/calculator/"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
