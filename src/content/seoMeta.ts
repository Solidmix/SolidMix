// Phase 2 metadata overrides, verbatim from seo-kit/01-seo-meta.csv
// (2026-11-21). Keyed by the page's own path. `pageMetadata()` in
// src/lib/seo.ts uses `title`/`description` here instead of the scraped
// content JSON's title/description, fixing the duplicated-brand titles and
// the weak legacy titles. `h1` replaces the on-page H1 for display only —
// never touches the scraped content JSON, never used for the stripChrome()
// body-dedup match (that still uses the content's own original heading).
//
// Two rows (rmc-services, safety) have no `description`: the CSV text for
// those contains a "[CLIENT TO CONFIRM ...]" placeholder, which hard rule #1
// forbids publishing — the page's existing description is kept instead.
//
// Descriptions shorter than 120 characters are used exactly as the CSV has
// them (never rewritten) — see docs/BUILD-LOG.md "Waiting for client" for
// the full list this applies to.
//
// Not included here: "/" (Home sets its own metadata directly in
// src/app/page.tsx, not via pageMetadata()), the Book Us page (already set
// from this same CSV in the Phase 5C build), the 4 blog posts in the CSV
// (generateMetadata keeps using the post's own description, per instruction),
// and the 2 "planned" rows (concrete-faq, concrete-grades-guide — not built).
export type SeoMetaOverride = { title: string; description?: string; h1: string };

export const seoMetaOverrides: Record<string, SeoMetaOverride> = {
  "/ready-mix-concrete-in-raipur/": {
    title: "Ready Mix Concrete in Raipur",
    h1: "Ready Mix Concrete Products in Raipur",
    description:
      "Browse SolidMix RMC concrete products in Raipur: standard, high strength, fiber reinforced, waterproof, decorative and more.",
  },
  "/ready-mix-concrete-in-raipur/standard-concrete/": {
    title: "Standard Concrete in Raipur",
    h1: "Standard Concrete in Raipur",
    description:
      "Standard ready mix concrete from SolidMix RMC in Raipur for slabs, columns, footings and everyday construction. Contact us.",
  },
  "/ready-mix-concrete-in-raipur/high-strength-concrete-in-sarona-raipur/": {
    title: "High Strength Concrete in Raipur",
    h1: "High Strength Concrete in Raipur",
    description:
      "High strength ready mix concrete from SolidMix RMC for demanding structural work in Raipur. Ask our team about your project.",
  },
  "/ready-mix-concrete-in-raipur/self-compacting-concrete-in-bhanpuri-raipur/": {
    title: "Self Compacting Concrete in Raipur",
    h1: "Self Compacting Concrete in Raipur",
    description:
      "Self compacting concrete (SCC) from SolidMix RMC flows into tight reinforcement without vibration. Available in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/lightweight-concrete-in-sejbahar-raipur/": {
    title: "Lightweight Concrete in Raipur",
    h1: "Lightweight Concrete in Raipur",
    description:
      "Lightweight concrete from SolidMix RMC for projects that need reduced weight. Enquire for supply in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/steel-fiber-concrete/": {
    title: "Steel Fiber Concrete in Raipur",
    h1: "Steel Fiber Concrete in Raipur",
    description:
      "Steel fiber reinforced concrete from SolidMix RMC for floors, pavements and crack control in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/pp-fiber-concrete-in-kumhari-raipur/": {
    title: "PP Fiber Concrete in Raipur",
    h1: "PP Fiber Concrete in Raipur",
    description:
      "Polypropylene (PP) fiber concrete from SolidMix RMC helps control early shrinkage cracks. Available in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/waterproof-concrete-in-mandir-hasaud-raipur/": {
    title: "Waterproof Concrete in Raipur",
    h1: "Waterproof Concrete in Raipur",
    description: "Waterproof ready mix concrete from SolidMix RMC for basements, tanks and wet areas in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/heat-resistant-concrete-2/": {
    title: "Heat Resistant Concrete in Raipur",
    h1: "Heat Resistant Concrete in Raipur",
    description:
      "Heat resistant concrete from SolidMix RMC for high-temperature applications. Enquire for supply in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/permeable-concrete-in-kotni-raipur/": {
    title: "Permeable Concrete in Raipur",
    h1: "Permeable Concrete in Raipur",
    description: "Permeable concrete from SolidMix RMC lets rainwater drain through surfaces. Ask about supply in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/eco-friendly-concrete-in-saddu-raipur/": {
    title: "Eco Friendly Concrete in Raipur",
    h1: "Eco Friendly Concrete in Raipur",
    description:
      "Eco friendly concrete from SolidMix RMC for projects that aim to reduce environmental impact. Enquire in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/stamped-concrete-in-atal-nagar-raipur/": {
    title: "Stamped Concrete in Raipur",
    h1: "Stamped Concrete in Raipur",
    description: "Stamped decorative concrete from SolidMix RMC for driveways, patios and walkways in Raipur.",
  },
  "/ready-mix-concrete-in-raipur/bagged-concrete-in-farfaud-raipur/": {
    title: "Bagged Concrete in Raipur",
    h1: "Bagged Concrete in Raipur",
    description: "Bagged ready mix concrete from SolidMix RMC for small jobs and repairs in Raipur.",
  },
  "/rmc-services-in-raipur/": {
    title: "RMC Services in Raipur",
    h1: "RMC Services in Raipur",
    // description intentionally omitted: CSV text has "[CLIENT TO CONFIRM service list]"
  },
  "/calculator/": {
    title: "RMC Calculator for Raipur",
    h1: "Concrete Calculator",
    description:
      "Estimate how much ready mix concrete you need and the likely cost for slabs, beams and columns with the SolidMix RMC calculator.",
  },
  "/safety/": {
    title: "Quality & Safety",
    h1: "Quality & Safety at SolidMix RMC",
    // description intentionally omitted: CSV text has "[CLIENT TO CONFIRM practices]"
  },
  "/project-gallery/": {
    title: "Project Gallery",
    h1: "Project Gallery",
    description: "See completed concrete projects supplied by SolidMix RMC in and around Raipur.",
  },
  "/plant-gallery/": {
    title: "Plant Gallery",
    h1: "Plant Gallery",
    description: "Photos of SolidMix RMC concrete, our plant and project sites in Raipur.",
  },
  "/concrete-blog-in-raipur/": {
    title: "Concrete Blog in Raipur",
    h1: "Concrete Guides & Blog",
    description:
      "Plain-language guides on ready mix concrete from SolidMix RMC: grades, curing, ordering and common questions.",
  },
  // Blog posts normally keep their own scraped title/description (not listed
  // here) — but this post's raw scrape is byte-identical to /ready-mix-concrete/'s
  // (a duplicate-title/description Phase 8 audit failure), so it uses its own
  // CSV row (seo-kit/01-seo-meta.csv) instead, same as the static pages above.
  "/best-ready-mix-concrete-supplier-in-raipur-what-to-look-for/": {
    title: "Choosing an RMC Supplier in Raipur",
    h1: "How to Choose a Ready Mix Concrete Supplier in Raipur",
    description:
      "What to check before you choose a ready mix concrete supplier in Raipur: quality, delivery, testing and support.",
  },
  "/category/concrete-101/": {
    title: "Concrete 101",
    h1: "Concrete 101",
    description: "Basic guides on ready mix concrete from SolidMix RMC.",
  },
  "/category/construction/": {
    title: "Construction Guides",
    h1: "Construction",
    description: "Construction guides and tips from SolidMix RMC.",
  },
  "/category/rmc-plant/": {
    title: "RMC Plant Guides",
    h1: "RMC Plant",
    description: "Articles about how a ready mix concrete plant works.",
  },
  "/trusted-concrete-supplier-in-raipur/": {
    title: "Trusted Concrete Supplier in Raipur",
    h1: "About SolidMix RMC",
    description: "SolidMix RMC is a ready mix concrete supplier in Raipur. Learn about our plant, our team and how we work.",
  },
  "/our-team/": {
    title: "Our Team | RMC Plant Raipur",
    h1: "Our Team",
    description:
      "Meet the SolidMix RMC team in Raipur: the sales, quality and operations people behind your concrete supply.",
  },
  "/careers/": {
    title: "Careers at SolidMix RMC",
    h1: "Careers at SolidMix RMC",
    description: "Current job openings at SolidMix RMC in Raipur.",
  },
  "/privacy-policy/": {
    title: "Privacy Policy",
    h1: "Privacy Policy",
    description: "How SolidMix RMC collects and uses information from this website.",
  },
  "/legal/": {
    title: "Legal Information",
    h1: "Legal Information",
    description: "Legal information and website terms for SolidMix RMC.",
  },
};
