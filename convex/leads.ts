import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Same rate-limit shape as convex/submissions.ts, applied here per phone
// (leads always require a phone number; email is optional on this form).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type Result = { ok: true } | { ok: false; reason: string };

function trimToMax(value: string | undefined, max: number): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (trimmed.length === 0) return undefined;
  return trimmed.slice(0, max);
}

function requiredTrimToMax(value: string, max: number): string {
  return value.trim().slice(0, max);
}

async function isRateLimited(
  ctx: { db: { query: (table: "leads") => any } },
  phone: string,
): Promise<boolean> {
  const since = Date.now() - RATE_LIMIT_WINDOW_MS;
  const sinceIso = new Date(since).toISOString();
  const recent = await ctx.db
    .query("leads")
    .withIndex("by_phone_createdAt", (q: any) => q.eq("phone", phone).gt("createdAt", sinceIso))
    .collect();
  return recent.length >= RATE_LIMIT_MAX;
}

// Called by src/lib/leadStore.ts. Returns { ok: false, reason: "duplicate" }
// (never throws) when leadId already exists, so the API route's retry loop
// can generate a new Lead ID and call again — the kit's required contract.
export const saveLead = mutation({
  args: {
    topic: v.string(),
    othersText: v.optional(v.string()),
    category: v.string(),
    grade: v.optional(v.string()),
    gradeText: v.optional(v.string()),
    plantId: v.string(),
    area: v.string(),
    siteLocation: v.optional(v.string()),
    lat: v.optional(v.number()),
    lng: v.optional(v.number()),
    pump: v.string(),
    quantity: v.optional(v.string()),
    pourDate: v.optional(v.string()),
    pourTime: v.optional(v.string()),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    organisation: v.optional(v.string()),
    designation: v.optional(v.string()),
    message: v.optional(v.string()),
    leadId: v.string(),
    createdAt: v.string(),
    sourcePage: v.string(),
  },
  handler: async (ctx, args): Promise<Result> => {
    const phone = requiredTrimToMax(args.phone, 20);

    const existing = await ctx.db
      .query("leads")
      .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
      .first();
    if (existing) {
      return { ok: false, reason: "duplicate" };
    }

    if (await isRateLimited(ctx, phone)) {
      return { ok: false, reason: "rate_limited" };
    }

    await ctx.db.insert("leads", {
      topic: requiredTrimToMax(args.topic, 40),
      othersText: trimToMax(args.othersText, 1000),
      category: requiredTrimToMax(args.category, 60),
      grade: trimToMax(args.grade, 40),
      gradeText: trimToMax(args.gradeText, 80),
      plantId: requiredTrimToMax(args.plantId, 60),
      area: requiredTrimToMax(args.area, 120),
      siteLocation: trimToMax(args.siteLocation, 300),
      lat: args.lat,
      lng: args.lng,
      pump: requiredTrimToMax(args.pump, 40),
      quantity: trimToMax(args.quantity, 20),
      pourDate: trimToMax(args.pourDate, 10),
      pourTime: trimToMax(args.pourTime, 5),
      name: requiredTrimToMax(args.name, 100),
      phone,
      email: trimToMax(args.email, 120),
      organisation: trimToMax(args.organisation, 120),
      designation: trimToMax(args.designation, 80),
      message: trimToMax(args.message, 1500),
      leadId: args.leadId,
      createdAt: args.createdAt,
      sourcePage: requiredTrimToMax(args.sourcePage, 200),
    });

    return { ok: true };
  },
});
