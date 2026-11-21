import { internalMutation, internalQuery, mutation, query, type QueryCtx, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const SESSION_MS = 12 * 60 * 60 * 1000;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const LOCK_MAX_ATTEMPTS = 5;

// SHA-256 hex digest via Web Crypto (available in the default Convex
// runtime) — used only for hashing the opaque session token for lookup/
// storage, never for passwords (those use scrypt in the "use node" auth.ts).
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type TeamIdentity = { userId: Id<"teamUsers">; email: string; name: string };

// Shared by every team-only query/mutation (gallery.ts, history.ts). Throws
// if the token is missing, unknown, expired, or belongs to a deactivated
// user — per spec, nothing team-only runs without a valid session.
export async function requireTeamSession(
  ctx: QueryCtx | MutationCtx,
  token: string | undefined,
): Promise<TeamIdentity> {
  if (!token) throw new Error("not_authenticated");
  const tokenHash = await sha256Hex(token);
  const session = await ctx.db
    .query("teamSessions")
    .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
    .unique();
  if (!session || session.expiresAt < Date.now()) throw new Error("not_authenticated");
  const user = await ctx.db.get(session.userId);
  if (!user || !user.active) throw new Error("not_authenticated");
  return { userId: user._id, email: user.email, name: user.name };
}

// Public: used by the dashboard UI to check its stored token, and by the
// revalidate API route to verify a request before calling revalidatePath.
// Never throws — returns {ok:false} for any invalid/expired token.
export const me = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    try {
      const identity = await requireTeamSession(ctx, token);
      return { ok: true as const, email: identity.email, name: identity.name };
    } catch {
      return { ok: false as const };
    }
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const tokenHash = await sha256Hex(token);
    const session = await ctx.db
      .query("teamSessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
      .unique();
    if (session) await ctx.db.delete(session._id);
    return { ok: true };
  },
});

export const getUserByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("teamUsers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const insertUser = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teamUsers", { ...args, active: true, createdAt: Date.now() });
  },
});

export const recordAttempt = internalMutation({
  args: { email: v.string(), ok: v.boolean() },
  handler: async (ctx, { email, ok }) => {
    await ctx.db.insert("loginAttempts", { email, ok, at: Date.now() });
  },
});

// True when this email has 5+ failed attempts inside the last 15 minutes.
export const isLocked = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const since = Date.now() - LOCK_WINDOW_MS;
    const recent = await ctx.db
      .query("loginAttempts")
      .withIndex("by_email_at", (q) => q.eq("email", email).gt("at", since))
      .collect();
    const failures = recent.filter((a) => !a.ok);
    return failures.length >= LOCK_MAX_ATTEMPTS;
  },
});

export const createSession = internalMutation({
  args: { userId: v.id("teamUsers"), tokenHash: v.string() },
  handler: async (ctx, { userId, tokenHash }) => {
    await ctx.db.insert("teamSessions", { userId, tokenHash, expiresAt: Date.now() + SESSION_MS });
  },
});
