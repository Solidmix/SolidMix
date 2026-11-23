import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { api } from "../../../../convex/_generated/api";
import { getServerConvexClient } from "@/lib/convexServer";

const CATEGORY_PATH_RE = /^\/category\/[a-z0-9-]+\/(page\/\d+\/)?$/;
const SINGLE_SLUG_RE = /^\/[a-z0-9-]+\/$/;

// Allow-list only: a post's own path, an old slug's redirect target, the
// blog index, category pages, and the sitemap.
// Anything else is rejected even though the caller is authenticated.
function isAllowedBlogPath(path: string): boolean {
  if (path === "/concrete-blog-in-raipur/" || path === "/sitemap.xml") {
    return true;
  }
  if (CATEGORY_PATH_RE.test(path)) return true;
  if (SINGLE_SLUG_RE.test(path)) return true;
  return false;
}

// Called by the dashboard after a post save/publish/unpublish/trash/restore
// or slug change. Verifies the caller's session with Convex, then rebuilds
// only the affected pages — never trusts the request alone.
export async function POST(request: Request) {
  const client = getServerConvexClient();
  if (!client) {
    return NextResponse.json({ ok: false, reason: "convex_not_configured" }, { status: 500 });
  }

  let token: string | undefined;
  let paths: string[] = [];
  try {
    const body = await request.json();
    token = typeof body?.token === "string" ? body.token : undefined;
    paths = Array.isArray(body?.paths) ? body.paths.filter((p: unknown) => typeof p === "string") : [];
  } catch {
    token = undefined;
  }
  if (!token) {
    return NextResponse.json({ ok: false, reason: "missing_token" }, { status: 401 });
  }

  const session = await client.query(api.authData.me, { token });
  if (!session.ok) {
    return NextResponse.json({ ok: false, reason: "not_authenticated" }, { status: 401 });
  }

  const allowed = paths.filter(isAllowedBlogPath);
  for (const path of allowed) {
    revalidatePath(path);
  }

  // Warm each page once so the team sees the change immediately instead of
  // waiting for the next real visitor to trigger regeneration.
  await Promise.all(
    allowed.map(async (path) => {
      try {
        await fetch(new URL(path, request.url), { cache: "no-store" });
      } catch {
        // Ignore — the page will still regenerate on the next real visit.
      }
    }),
  );

  return NextResponse.json({ ok: true, revalidated: allowed });
}
