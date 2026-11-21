import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { sha256Hex } from "./authData";

const MAX_PER_CALL = 6;

type SeedResult = { ok: true; inserted: number; skipped: string[] } | { ok: false; reason: string };

// One-time, secret-protected migration of the 36 legacy JSON posts into the
// posts table, called in small batches (<=6) so each call stays well inside
// Convex's per-mutation limits. Only inserts slugs not already present, so
// re-running a batch (or the whole migration) after a partial run is safe.
export const seedPostsBatch = mutation({
  args: {
    secret: v.string(),
    posts: v.array(
      v.object({
        slug: v.string(),
        title: v.string(),
        h1: v.string(),
        description: v.string(),
        excerpt: v.string(),
        category: v.string(),
        date: v.string(),
        time: v.optional(v.string()),
        featuredImage: v.object({ src: v.optional(v.string()), alt: v.string() }),
        blocks: v.array(v.any()),
        canonicalOriginal: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, { secret, posts }): Promise<SeedResult> => {
    const expected = process.env.DASHBOARD_BOOTSTRAP_SECRET;
    if (!expected) return { ok: false, reason: "not_configured" };
    if ((await sha256Hex(secret)) !== (await sha256Hex(expected))) {
      return { ok: false, reason: "invalid_secret" };
    }
    if (posts.length > MAX_PER_CALL) return { ok: false, reason: "too_many" };

    let inserted = 0;
    const skipped: string[] = [];
    for (const p of posts) {
      const existing = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", p.slug))
        .unique();
      if (existing) {
        skipped.push(p.slug);
        continue;
      }
      const updatedAt = Date.parse(p.date) || Date.now();
      await ctx.db.insert("posts", {
        slug: p.slug,
        title: p.title,
        h1: p.h1,
        description: p.description,
        excerpt: p.excerpt,
        category: p.category,
        date: p.date,
        time: p.time,
        featuredImage: { src: p.featuredImage.src, alt: p.featuredImage.alt },
        blocks: p.blocks,
        canonicalOriginal: p.canonicalOriginal,
        status: "published",
        deleted: false,
        legacy: true,
        createdAt: updatedAt,
        updatedAt,
      });
      inserted += 1;
    }

    return { ok: true, inserted, skipped };
  },
});
