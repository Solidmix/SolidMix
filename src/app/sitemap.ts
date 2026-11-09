import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { PRODUCTS_BASE } from "@/content/site";

const PRODUCT_SLUGS = [
  "standard-concrete",
  "steel-fiber-concrete",
  "pp-fiber-concrete-in-kumhari-raipur",
  "waterproof-concrete-in-mandir-hasaud-raipur",
  "heat-resistant-concrete-2",
  "stamped-concrete-in-atal-nagar-raipur",
  "bagged-concrete-in-farfaud-raipur",
  "permeable-concrete-in-kotni-raipur",
  "eco-friendly-concrete-in-saddu-raipur",
  "lightweight-concrete-in-sejbahar-raipur",
  "self-compacting-concrete-in-bhanpuri-raipur",
  "high-strength-concrete-in-sarona-raipur",
];

const TEAM_SLUGS = [
  "anand-sharma",
  "pitabas-sahoo",
  "pratham-bafna",
  "purnendu-poddar",
  "samrat-gupta",
  "vinit-tiwari",
];

// Routes that exist in this batch. Structure is ready to extend as later
// batches add pages.
const routes = [
  "/",
  "/trusted-concrete-supplier-in-raipur/",
  "/our-team/",
  ...TEAM_SLUGS.map((slug) => `/our-team/${slug}/`),
  `${PRODUCTS_BASE}/`,
  ...PRODUCT_SLUGS.map((slug) => `${PRODUCTS_BASE}/${slug}/`),
  "/rmc-services-in-raipur/",
  "/our-work/",
  "/safety/",
  "/rmc-gallery-in-raipur/",
  "/legal/",
  "/privacy-policy/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
