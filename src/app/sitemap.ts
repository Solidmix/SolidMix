import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Routes that exist in this batch. Structure is ready to extend as later
// batches add pages.
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
