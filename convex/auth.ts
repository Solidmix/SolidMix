"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

const SCRYPT_KEYLEN = 64;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashPassword(password: string, salt: string): string {
  return scryptSync(password, salt, SCRYPT_KEYLEN).toString("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  // Pre-hash both sides to a fixed 32-byte digest so timingSafeEqual never
  // throws on a length mismatch and the secret's real length leaks nothing.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

type LoginResult = { ok: true; token: string; name: string } | { ok: false; reason: string };

export const login = action({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }): Promise<LoginResult> => {
    const normalized = normalizeEmail(email);

    const locked = await ctx.runQuery(internal.authData.isLocked, { email: normalized });
    if (locked) return { ok: false, reason: "locked" };

    const user = await ctx.runQuery(internal.authData.getUserByEmail, { email: normalized });
    if (!user || !user.active) {
      await ctx.runMutation(internal.authData.recordAttempt, { email: normalized, ok: false });
      return { ok: false, reason: "invalid_credentials" };
    }

    const candidateHash = hashPassword(password, user.salt);
    const valid = constantTimeEqual(candidateHash, user.passwordHash);

    await ctx.runMutation(internal.authData.recordAttempt, { email: normalized, ok: valid });
    if (!valid) return { ok: false, reason: "invalid_credentials" };

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await ctx.runMutation(internal.authData.createSession, { userId: user._id, tokenHash });

    return { ok: true, token, name: user.name };
  },
});

type BootstrapResult = { ok: true } | { ok: false; reason: string };

// One-time account creation, gated by the Convex env var
// DASHBOARD_BOOTSTRAP_SECRET. Not reachable without that secret; refuses if
// the email already has an account.
export const bootstrapTeamUser = action({
  args: { secret: v.string(), email: v.string(), name: v.string(), password: v.string() },
  handler: async (ctx, { secret, email, name, password }): Promise<BootstrapResult> => {
    const expected = process.env.DASHBOARD_BOOTSTRAP_SECRET;
    if (!expected || !constantTimeEqual(secret, expected)) {
      return { ok: false, reason: "invalid_secret" };
    }

    const normalized = normalizeEmail(email);
    const existing = await ctx.runQuery(internal.authData.getUserByEmail, { email: normalized });
    if (existing) return { ok: false, reason: "exists" };

    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);
    await ctx.runMutation(internal.authData.insertUser, {
      email: normalized,
      name: name.trim(),
      passwordHash,
      salt,
    });

    return { ok: true };
  },
});
