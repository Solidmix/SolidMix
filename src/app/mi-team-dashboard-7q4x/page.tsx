import type { Metadata } from "next";
import { TeamDashboardApp } from "./TeamDashboardApp";

// Secret-path internal tool — never indexed, never linked from the site,
// never listed in sitemap.ts. This overrides the root layout's robots
// setting so the dashboard stays noindex even after public indexing is
// switched on for the rest of the site.
export const metadata: Metadata = {
  title: "Team Dashboard",
  robots: { index: false, follow: false },
};

export default function TeamDashboardPage() {
  return <TeamDashboardApp />;
}
