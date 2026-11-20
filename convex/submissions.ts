import { mutation } from "./_generated/server";
import { v } from "convex/values";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]*$/;

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
  ctx: { db: { query: (table: "enquiries" | "appointments" | "careerApplications") => any } },
  table: "enquiries" | "appointments" | "careerApplications",
  email: string,
): Promise<boolean> {
  const since = Date.now() - RATE_LIMIT_WINDOW_MS;
  const recent = await ctx.db
    .query(table)
    .withIndex("by_email_createdAt", (q: any) => q.eq("email", email).gt("createdAt", since))
    .collect();
  return recent.length >= RATE_LIMIT_MAX;
}

export const submitEnquiry = mutation({
  args: {
    source: v.union(v.literal("contact"), v.literal("home")),
    name: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    area: v.string(),
    otherArea: v.optional(v.string()),
    message: v.optional(v.string()),
    page: v.string(),
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Result> => {
    if (args.honeypot && args.honeypot.trim().length > 0) {
      return { ok: true };
    }

    const email = requiredTrimToMax(args.email, 254);
    if (!EMAIL_RE.test(email)) {
      return { ok: false, reason: "invalid_email" };
    }

    const phone = trimToMax(args.phone, 20);
    if (phone !== undefined && !PHONE_RE.test(phone)) {
      return { ok: false, reason: "invalid_phone" };
    }

    if (await isRateLimited(ctx, "enquiries", email)) {
      return { ok: false, reason: "rate_limited" };
    }

    await ctx.db.insert("enquiries", {
      source: args.source,
      name: trimToMax(args.name, 100),
      email,
      phone,
      area: requiredTrimToMax(args.area, 120),
      otherArea: trimToMax(args.otherArea, 120),
      message: trimToMax(args.message, 2000),
      page: requiredTrimToMax(args.page, 200),
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});

export const submitAppointment = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    mobile: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    topic: v.string(),
    page: v.string(),
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Result> => {
    if (args.honeypot && args.honeypot.trim().length > 0) {
      return { ok: true };
    }

    const email = requiredTrimToMax(args.email, 254);
    if (!EMAIL_RE.test(email)) {
      return { ok: false, reason: "invalid_email" };
    }

    const mobile = trimToMax(args.mobile, 20);
    if (mobile !== undefined && !PHONE_RE.test(mobile)) {
      return { ok: false, reason: "invalid_phone" };
    }

    if (await isRateLimited(ctx, "appointments", email)) {
      return { ok: false, reason: "rate_limited" };
    }

    await ctx.db.insert("appointments", {
      firstName: trimToMax(args.firstName, 100),
      lastName: trimToMax(args.lastName, 100),
      email,
      mobile,
      date: trimToMax(args.date, 120),
      time: trimToMax(args.time, 120),
      topic: requiredTrimToMax(args.topic, 120),
      page: requiredTrimToMax(args.page, 200),
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});

export const submitCareerApplication = mutation({
  args: {
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    subject: v.optional(v.string()),
    resumeFileName: v.optional(v.string()),
    comments: v.optional(v.string()),
    page: v.string(),
    honeypot: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Result> => {
    if (args.honeypot && args.honeypot.trim().length > 0) {
      return { ok: true };
    }

    const email = requiredTrimToMax(args.email, 254);
    if (!EMAIL_RE.test(email)) {
      return { ok: false, reason: "invalid_email" };
    }

    if (await isRateLimited(ctx, "careerApplications", email)) {
      return { ok: false, reason: "rate_limited" };
    }

    await ctx.db.insert("careerApplications", {
      firstName: trimToMax(args.firstName, 100),
      lastName: trimToMax(args.lastName, 100),
      email,
      subject: trimToMax(args.subject, 120),
      resumeFileName: trimToMax(args.resumeFileName, 255),
      comments: trimToMax(args.comments, 2000),
      page: requiredTrimToMax(args.page, 200),
      createdAt: Date.now(),
    });

    return { ok: true };
  },
});
