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
});
