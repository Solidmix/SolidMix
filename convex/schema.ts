import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  enquiries: defineTable({
    source: v.union(v.literal("contact"), v.literal("home")),
    name: v.optional(v.string()),
    email: v.string(),
    phone: v.optional(v.string()),
    area: v.string(),
    otherArea: v.optional(v.string()),
    message: v.optional(v.string()),
    page: v.string(),
    createdAt: v.number(),
  }).index("by_email_createdAt", ["email", "createdAt"]),

  appointments: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    mobile: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    topic: v.string(),
    page: v.string(),
    createdAt: v.number(),
  }).index("by_email_createdAt", ["email", "createdAt"]),

  careerApplications: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    subject: v.optional(v.string()),
    resumeFileName: v.optional(v.string()),
    comments: v.optional(v.string()),
    page: v.string(),
    createdAt: v.number(),
  }).index("by_email_createdAt", ["email", "createdAt"]),

  // --- Team dashboard (feat/team-dashboard) ---

  teamUsers: defineTable({
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    salt: v.string(),
    active: v.boolean(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  teamSessions: defineTable({
    userId: v.id("teamUsers"),
    tokenHash: v.string(),
    expiresAt: v.number(),
  }).index("by_tokenHash", ["tokenHash"]),

  loginAttempts: defineTable({
    email: v.string(),
    at: v.number(),
    ok: v.boolean(),
  }).index("by_email_at", ["email", "at"]),

  galleryPhotos: defineTable({
    storageId: v.optional(v.id("_storage")),
    src: v.optional(v.string()),
    alt: v.string(),
    width: v.number(),
    height: v.number(),
    order: v.number(),
    deleted: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_deleted_order", ["deleted", "order"]),

  contentHistory: defineTable({
    entityType: v.union(v.literal("gallery"), v.literal("post")),
    entityId: v.string(),
    action: v.union(
      v.literal("create"),
      v.literal("edit"),
      v.literal("replace"),
      v.literal("reorder"),
      v.literal("delete"),
      v.literal("restore"),
      v.literal("publish"),
      v.literal("unpublish"),
      v.literal("slug_change"),
      v.literal("trash"),
    ),
    before: v.optional(v.any()),
    after: v.optional(v.any()),
    byUserId: v.id("teamUsers"),
    byEmail: v.string(),
    at: v.number(),
  }).index("by_at", ["at"]),

  // --- Blog (Build 2) ---

  posts: defineTable({
    slug: v.string(),
    title: v.string(),
    h1: v.string(),
    description: v.string(),
    excerpt: v.string(),
    category: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    featuredImage: v.object({
      src: v.optional(v.string()),
      storageId: v.optional(v.id("_storage")),
      alt: v.string(),
    }),
    blocks: v.array(v.any()),
    canonicalOriginal: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    deleted: v.boolean(),
    legacy: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_status_deleted_date", ["status", "deleted", "date"]),

  postRedirects: defineTable({
    from: v.string(),
    to: v.string(),
    at: v.number(),
  }).index("by_from", ["from"]),
});
