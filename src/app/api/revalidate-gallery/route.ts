import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { api } from "../../../../convex/_generated/api";
import { getServerConvexClient } from "@/lib/convexServer";

// Called by the dashboard after a successful gallery save. Verifies the
// caller's session with Convex (same check every dashboard mutation makes)
// before rebuilding the public gallery page — never trusts the request
// alone.
export async function POST(request: Request) {
  const client = getServerConvexClient();
  if (!client) {
    return NextResponse.json({ ok: false, reason: "convex_not_configured" }, { status: 500 });
  }

  let token: string | undefined;
  try {
    const body = await request.json();
    token = typeof body?.token === "string" ? body.token : undefined;
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

  revalidatePath("/rmc-gallery-in-raipur/");

  // Without this, the page only regenerates on the NEXT visitor's request,
  // so the team sees stale content for 1-2 refreshes after a save. Fetching
  // it once here forces that regeneration immediately.
  try {
    await fetch(new URL("/rmc-gallery-in-raipur/", request.url), { cache: "no-store" });
  } catch {
    // Ignore — the page will still regenerate on the next real visit.
  }

  return NextResponse.json({ ok: true });
}
