import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireTeamSession } from "./authData";

const MAX_LIMIT = 200;

// Team-only: dashboard History tab (read-only).
export const listRecent = query({
  args: { token: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { token, limit }) => {
    await requireTeamSession(ctx, token);
    const take = Math.min(limit ?? MAX_LIMIT, MAX_LIMIT);
    const rows = await ctx.db.query("contentHistory").withIndex("by_at").order("desc").take(take);
    return rows;
  },
});
