import type { NextConfig } from "next";

const PRODUCTS_BASE = "/ready-mix-concrete-in-raipur";

// Old /products/<slug>/ -> live product page under /ready-mix-concrete-in-raipur/
const productSlugMap: Record<string, string> = {
  "standard-concrete": "standard-concrete",
  "steel-fiber-concrete": "steel-fiber-concrete",
  "pp-fiber-concrete": "pp-fiber-concrete-in-kumhari-raipur",
  "waterproof-concrete": "waterproof-concrete-in-mandir-hasaud-raipur",
  "heat-resistant-concrete-2": "heat-resistant-concrete-2",
  "stamped-concrete": "stamped-concrete-in-atal-nagar-raipur",
  "bagged-concrete": "bagged-concrete-in-farfaud-raipur",
  "permeable-concrete": "permeable-concrete-in-kotni-raipur",
  "eco-friendly-concrete": "eco-friendly-concrete-in-saddu-raipur",
  "lightweight-concrete": "lightweight-concrete-in-sejbahar-raipur",
  "self-compacting-concrete": "self-compacting-concrete-in-bhanpuri-raipur",
  "high-strength-concrete": "high-strength-concrete-in-sarona-raipur",
  "high-strength-concrete-in-sarona-raipur": "high-strength-concrete-in-sarona-raipur",
};

const productRedirects = Object.entries(productSlugMap).map(([oldSlug, target]) => ({
  source: `/products/${oldSlug}/`,
  destination: `${PRODUCTS_BASE}/${target}/`,
  statusCode: 301,
}));

// Blog posts that live at root slug but were linked under category prefixes.
const categoryPrefixes = ["construction", "concrete-101", "rmc-plant", "public"];
const categoryPrefixRedirects = categoryPrefixes.map((prefix) => ({
  source: `/${prefix}/:post`,
  destination: "/:post/",
  statusCode: 301,
}));

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Section / menu page moves
      { source: "/contact-us/", destination: "/ready-mix-concrete-contact-in-raipur/", statusCode: 301 },
      { source: "/about-us/", destination: "/trusted-concrete-supplier-in-raipur/", statusCode: 301 },
      { source: "/our-services/", destination: "/rmc-services-in-raipur/", statusCode: 301 },
      { source: "/products/", destination: `${PRODUCTS_BASE}/`, statusCode: 301 },

      // About-us member pages -> our-team member pages
      { source: "/about-us/:member", destination: "/our-team/:member/", statusCode: 301 },

      // Blog index moves
      { source: "/our-blogs-and-news/", destination: "/concrete-blog-in-raipur/", statusCode: 301 },
      { source: "/our-blogs-and-news/page/:n", destination: "/concrete-blog-in-raipur/", statusCode: 301 },

      // Product old slugs
      ...productRedirects,

      // Special-case blog slugs (must precede the generic category-prefix rules)
      {
        source: "/construction/ready-mix-concrete-in-bhilai-7-smart-benefits-for-stronger-construction/",
        destination: "/ready-mix-concrete-in-bhilai-benefits/",
        statusCode: 301,
      },
      {
        source: "/construction/top-7-innovations-in-ready-mix-concrete-technology-revolutionizing-construction-in-2025/",
        destination: "/concrete-blog-in-raipur/",
        statusCode: 301,
      },

      // Generic category-prefix blog posts -> root slug
      ...categoryPrefixRedirects,

      // Malformed concatenated eco-friendly href (the literal ":" is escaped so
      // path-to-regexp does not treat it as a route parameter).
      {
        source: "/products/eco-friendly-concrete/https\\://solidmixrmc.com/products",
        destination: `${PRODUCTS_BASE}/eco-friendly-concrete-in-saddu-raipur/`,
        statusCode: 301,
      },

      // Date archives -> home (as original)
      { source: "/:y(\\d{4})/:m(\\d{2})/:d(\\d{2})/", destination: "/", statusCode: 301 },

      // Author archive -> blog index
      { source: "/author/admin-2/", destination: "/concrete-blog-in-raipur/", statusCode: 301 },
      { source: "/author/admin-2/page/:n", destination: "/concrete-blog-in-raipur/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
