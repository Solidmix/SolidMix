import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// AI answer engines are allowed on purpose once the site is indexable
// (seo-kit/00-CLAUDE-BUILD-BRIEF.md Phase 4 / seo-kit/02-robots-and-sitemap.md).
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Google-Extended", "Bingbot"];

export default function robots(): MetadataRoute.Robots {
  // Launch is a human step (brief hard rule #2): only Production, and only
  // once Saidul sets SITE_INDEXABLE=true in Vercel. Never flip this from code.
  const indexable = process.env.VERCEL_ENV === "production" && process.env.SITE_INDEXABLE === "true";

  if (!indexable) {
    // Review deployment: keep everything out of search engines.
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/mi-team-dashboard-7q4x/"] },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
