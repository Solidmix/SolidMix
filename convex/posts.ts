import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireTeamSession, type TeamIdentity } from "./authData";

// Every slug already used by a page, post or category file in
// src/content/index.json at the time Build 2 shipped — copied here as a
// constant (Convex functions cannot read repo files at runtime) so a new
// post can never be created at a URL that collides with an existing page.
const RESERVED_SLUGS = [
  "10mm-rod-weight-guide", "12mm-rod-weight", "appointments", "author-admin-2",
  "author-admin-2-page-2", "author-admin-2-page-3", "author-admin-2-page-4",
  "best-concrete-supplier-raipur", "best-ready-mix-concrete-supplier-in-raipur-what-to-look-for",
  "best-rmc-plant-solutions", "binding-wire", "boom-pump-service-in-raipur", "bulking-of-sand",
  "calculator", "careers", "category-concrete-101", "category-construction",
  "category-construction-page-2", "category-construction-page-3", "category-construction-page-4",
  "category-rmc-plant", "cement-roller-machine", "concrete-blog-in-raipur",
  "concrete-boom-pump-in-raipur", "concrete-lift-machine", "concrete-mixer-machine-guide",
  "concrete-supplier-in-raipur", "drying-shrinkage-cracks-in-raipur", "eco-friendly-ready-mix-concrete",
  "home", "industrial-flooring-in-raipur", "legal", "m20-vs-m25-concrete-in-raipur",
  "micro-concrete-uses-benefits-applications", "our-team", "our-team-anand-sharma",
  "our-team-pitabas-sahoo", "our-team-pratham-bafna", "our-team-purnendu-poddar",
  "our-team-samrat-gupta", "our-team-vinit-tiwari", "our-work", "pqc-concrete-construction-guide",
  "pqc-full-form-road-construction", "privacy-policy", "quality-concrete-supply-in-raipur",
  "ready-mix-concrete", "ready-mix-concrete-contact-in-raipur", "ready-mix-concrete-in-bhilai-benefits",
  "ready-mix-concrete-in-raipur", "ready-mix-concrete-in-raipur-bagged-concrete-in-farfaud-raipur",
  "ready-mix-concrete-in-raipur-eco-friendly-concrete-in-saddu-raipur",
  "ready-mix-concrete-in-raipur-heat-resistant-concrete-2",
  "ready-mix-concrete-in-raipur-high-strength-concrete-in-sarona-raipur",
  "ready-mix-concrete-in-raipur-lightweight-concrete-in-sejbahar-raipur",
  "ready-mix-concrete-in-raipur-permeable-concrete-in-kotni-raipur",
  "ready-mix-concrete-in-raipur-pp-fiber-concrete-in-kumhari-raipur",
  "ready-mix-concrete-in-raipur-self-compacting-concrete-in-bhanpuri-raipur",
  "ready-mix-concrete-in-raipur-stamped-concrete-in-atal-nagar-raipur",
  "ready-mix-concrete-in-raipur-standard-concrete", "ready-mix-concrete-in-raipur-steel-fiber-concrete",
  "ready-mix-concrete-in-raipur-waterproof-concrete-in-mandir-hasaud-raipur",
  "ready-mix-concrete-plant", "ready-mix-concrete-product", "ready-mix-concrete-rmc-in-raipur",
  "rimix-flooring", "rmc-gallery-in-raipur", "rmc-plant-raipur", "rmc-ready-mix-concrete",
  "rmc-services-in-raipur", "rmc-supplier-in-raipur-concrete-types", "safety", "site-mix-concrete",
  "solidmix-readymix-concrete", "solidmix-rmc-supplier", "trusted-concrete-supplier-in-raipur",
  "trusted-rmc-plant-in-raipur-solidmix", "waterproof-concrete-in-raipur",
  "weather-impact-on-ready-mix-concrete", "mi-team-dashboard-7q4x",
];

// The 3 category archives that exist today (src/lib/categories.ts). The
// editor only lets a post be filed under one of these.
const ALLOWED_CATEGORIES = ["construction", "concrete-101", "rmc-plant"];

const ALLOWED_BLOCK_TYPES = ["p", "heading", "list", "image", "table"];
const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_BLOCKS = 300;
const MAX_TEXT_LEN = 20000;
const MAX_LIST_ITEMS = 100;
const MAX_TABLE_ROWS = 100;
const MAX_TABLE_COLS = 20;

type FeaturedImage = { storageId?: Id<"_storage">; src?: string; alt: string };

type PostFields = {
  title: string;
  slug: string;
  h1: string;
  description: string;
  excerpt: string;
  category: string;
  date: string;
  time?: string;
  featuredImage: FeaturedImage;
  blocks: unknown[];
  canonicalOriginal?: string;
};

function requiredTrim(value: string | undefined, field: string, max: number): string {
  const trimmed = (value ?? "").trim();
  if (trimmed.length < 1) throw new Error(`${field}_required`);
  if (trimmed.length > max) throw new Error(`${field}_too_long`);
  return trimmed;
}

function validateMeta(description: string | undefined): string {
  const trimmed = (description ?? "").trim();
  if (trimmed.length < 50 || trimmed.length > 160) throw new Error("description_length");
  return trimmed;
}

function validateCategory(category: string): string {
  if (!ALLOWED_CATEGORIES.includes(category)) throw new Error("category_invalid");
  return category;
}

function validateDate(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("date_invalid");
  return date;
}

function validateFeaturedImage(fi: FeaturedImage | undefined): FeaturedImage {
  if (!fi || (!fi.src && !fi.storageId)) throw new Error("featured_image_required");
  const alt = requiredTrim(fi.alt, "featured_image_alt", 200);
  return { src: fi.src, storageId: fi.storageId, alt };
}

async function validateSlug(
  ctx: MutationCtx,
  rawSlug: string,
  excludeId: Id<"posts"> | undefined,
): Promise<string> {
  const slug = (rawSlug ?? "").trim().toLowerCase();
  if (!SLUG_RE.test(slug)) throw new Error("slug_invalid");
  if (RESERVED_SLUGS.includes(slug)) throw new Error("slug_reserved");
  const existing = await ctx.db
    .query("posts")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
  if (existing && existing._id !== excludeId) throw new Error("slug_taken");
  return slug;
}

function validateBlock(raw: unknown): Record<string, unknown> {
  if (typeof raw !== "object" || raw === null) throw new Error("block_invalid");
  const b = raw as Record<string, unknown>;
  if (typeof b.type !== "string" || !ALLOWED_BLOCK_TYPES.includes(b.type)) {
    throw new Error("block_type_invalid");
  }
  switch (b.type) {
    case "p": {
      if (typeof b.text !== "string" || b.text.length < 1 || b.text.length > MAX_TEXT_LEN) {
        throw new Error("block_p_invalid");
      }
      return { type: "p", text: b.text };
    }
    case "heading": {
      if (![1, 2, 3].includes(b.level as number)) throw new Error("block_heading_level_invalid");
      if (typeof b.text !== "string" || b.text.length < 1 || b.text.length > MAX_TEXT_LEN) {
        throw new Error("block_heading_invalid");
      }
      return { type: "heading", level: b.level, text: b.text };
    }
    case "list": {
      if (!Array.isArray(b.items) || b.items.length < 1 || b.items.length > MAX_LIST_ITEMS) {
        throw new Error("block_list_invalid");
      }
      const items = b.items.map((item) => {
        if (typeof item !== "string" || item.length > MAX_TEXT_LEN) throw new Error("block_list_item_invalid");
        return item;
      });
      return { type: "list", items };
    }
    case "image": {
      const hasSrc = typeof b.src === "string" && b.src.length > 0;
      const hasStorage = typeof b.storageId === "string" && b.storageId.length > 0;
      if (!hasSrc && !hasStorage) throw new Error("block_image_src_invalid");
      if (typeof b.alt !== "string" || b.alt.length < 1 || b.alt.length > 200) {
        throw new Error("block_image_alt_invalid");
      }
      return {
        type: "image",
        ...(hasSrc ? { src: b.src } : {}),
        ...(hasStorage ? { storageId: b.storageId } : {}),
        alt: b.alt,
        ...(typeof b.source === "string" ? { source: b.source } : {}),
        ...(typeof b.href === "string" ? { href: b.href } : {}),
      };
    }
    case "table": {
      if (!Array.isArray(b.rows) || b.rows.length < 1 || b.rows.length > MAX_TABLE_ROWS) {
        throw new Error("block_table_invalid");
      }
      const rows = b.rows.map((row) => {
        if (!Array.isArray(row) || row.length > MAX_TABLE_COLS) throw new Error("block_table_row_invalid");
        return row.map((cell) => {
          if (typeof cell !== "string") throw new Error("block_table_cell_invalid");
          return cell;
        });
      });
      return { type: "table", rows };
    }
    default:
      throw new Error("block_type_invalid");
  }
}

function validateBlocks(blocks: unknown): unknown[] {
  if (!Array.isArray(blocks) || blocks.length < 1) throw new Error("blocks_required");
  if (blocks.length > MAX_BLOCKS) throw new Error("blocks_too_many");
  return blocks.map(validateBlock);
}

async function validatePostFields(
  ctx: MutationCtx,
  fields: PostFields,
  excludeId: Id<"posts"> | undefined,
) {
  const title = requiredTrim(fields.title, "title", 200);
  const slug = await validateSlug(ctx, fields.slug, excludeId);
  const h1Raw = (fields.h1 ?? "").trim();
  const h1 = h1Raw.length > 0 ? requiredTrim(h1Raw, "h1", 200) : title;
  const description = validateMeta(fields.description);
  const excerpt = requiredTrim(fields.excerpt, "excerpt", 500);
  const category = validateCategory(fields.category);
  const date = validateDate(fields.date);
  const time = fields.time?.trim() || undefined;
  const featuredImage = validateFeaturedImage(fields.featuredImage);
  const blocks = validateBlocks(fields.blocks);
  const canonicalOriginal = fields.canonicalOriginal?.trim() || undefined;
  return { title, slug, h1, description, excerpt, category, date, time, featuredImage, blocks, canonicalOriginal };
}

async function resolveImageUrl(
  ctx: QueryCtx | MutationCtx,
  fi: FeaturedImage,
): Promise<string | null> {
  if (fi.storageId) return await ctx.storage.getUrl(fi.storageId);
  return fi.src ?? null;
}

// Body image blocks may carry a storageId (new uploads via the editor)
// instead of a plain src (legacy content) — resolve it to a usable URL for
// every read, same pattern as featuredImage. storageId is kept on the
// block afterwards so re-saving the post doesn't lose the link.
async function resolveBlocksImages(ctx: QueryCtx, blocks: unknown[]): Promise<unknown[]> {
  const out: unknown[] = [];
  for (const b of blocks) {
    if (typeof b === "object" && b !== null) {
      const block = b as Record<string, unknown>;
      if (block.type === "image" && typeof block.storageId === "string") {
        const url = await ctx.storage.getUrl(block.storageId as Id<"_storage">);
        out.push({ ...block, src: url ?? block.src });
        continue;
      }
    }
    out.push(b);
  }
  return out;
}

type PostRow = PostFields & {
  _id: Id<"posts">;
  status: "draft" | "published";
  deleted: boolean;
  legacy: boolean;
  createdAt: number;
  updatedAt: number;
  updatedBy?: string;
};

async function toPublicSummary(ctx: QueryCtx, row: PostRow) {
  const image = await resolveImageUrl(ctx, row.featuredImage);
  return {
    slug: row.slug,
    path: `/${row.slug}/`,
    kind: "post" as const,
    title: row.title,
    h1: row.h1,
    date: row.date,
    category: row.category,
    excerpt: row.excerpt,
    featuredImage: image ?? "",
    legacy: row.legacy,
    updatedAt: row.updatedAt,
  };
}

async function toPublicFull(ctx: QueryCtx, row: PostRow) {
  const image = await resolveImageUrl(ctx, row.featuredImage);
  const blocks = await resolveBlocksImages(ctx, row.blocks);
  return {
    slug: row.slug,
    path: `/${row.slug}/`,
    kind: "post" as const,
    title: row.title,
    description: row.description,
    canonicalOriginal: row.canonicalOriginal,
    blocks,
    h1: row.h1,
    category: row.category,
    date: row.date,
    time: row.time,
    excerpt: row.excerpt,
    featuredImage: { type: "image" as const, src: image ?? "", alt: row.featuredImage.alt },
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

async function logPostHistory(
  ctx: MutationCtx,
  identity: TeamIdentity,
  action: "create" | "edit" | "publish" | "unpublish" | "slug_change" | "trash" | "restore",
  entityId: string,
  before: unknown,
  after: unknown,
) {
  await ctx.db.insert("contentHistory", {
    entityType: "post",
    entityId,
    action,
    before,
    after,
    byUserId: identity.userId,
    byEmail: identity.email,
    at: Date.now(),
  });
}

// --- Public ---

// No drafts/trashed, newest first. Only the fields the blog index, category
// cards, and sitemap actually need; image URLs already resolved.
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_status_deleted_date", (q) => q.eq("status", "published").eq("deleted", false))
      .collect();
    rows.sort((a, b) => b.date.localeCompare(a.date));
    const out = [];
    for (const row of rows) out.push(await toPublicSummary(ctx, row as unknown as PostRow));
    return out;
  },
});

export const getPublishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (post && post.status === "published" && !post.deleted) {
      return { found: true as const, post: await toPublicFull(ctx, post as unknown as PostRow), redirectTo: null };
    }
    const redirect = await ctx.db
      .query("postRedirects")
      .withIndex("by_from", (q) => q.eq("from", slug))
      .unique();
    return { found: false as const, post: null, redirectTo: redirect?.to ?? null };
  },
});

export const latestPublished = query({
  args: { n: v.optional(v.number()) },
  handler: async (ctx, { n }) => {
    const take = Math.min(Math.max(n ?? 3, 1), 6);
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_status_deleted_date", (q) => q.eq("status", "published").eq("deleted", false))
      .collect();
    rows.sort((a, b) => b.date.localeCompare(a.date));
    const out = [];
    for (const row of rows.slice(0, take)) out.push(await toPublicSummary(ctx, row as unknown as PostRow));
    return out;
  },
});

// --- Team-only ---

export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeamSession(ctx, token);
    const rows = await ctx.db.query("posts").collect();
    rows.sort((a, b) => b.updatedAt - a.updatedAt);
    return rows.map((r) => ({
      id: r._id,
      slug: r.slug,
      title: r.title,
      h1: r.h1,
      status: r.status,
      deleted: r.deleted,
      legacy: r.legacy,
      category: r.category,
      date: r.date,
      updatedAt: r.updatedAt,
    }));
  },
});

export const getForEdit = query({
  args: { token: v.string(), id: v.id("posts") },
  handler: async (ctx, { token, id }) => {
    await requireTeamSession(ctx, token);
    const post = await ctx.db.get(id);
    if (!post) return null;
    const featuredImageUrl = await resolveImageUrl(ctx, post.featuredImage);
    const blocks = await resolveBlocksImages(ctx, post.blocks);
    return { ...post, blocks, featuredImageUrl };
  },
});

export const categories = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeamSession(ctx, token);
    return ALLOWED_CATEGORIES;
  },
});

const postFieldsArgs = {
  title: v.string(),
  slug: v.string(),
  h1: v.string(),
  description: v.string(),
  excerpt: v.string(),
  category: v.string(),
  date: v.string(),
  time: v.optional(v.string()),
  featuredImage: v.object({
    storageId: v.optional(v.id("_storage")),
    src: v.optional(v.string()),
    alt: v.string(),
  }),
  blocks: v.array(v.any()),
  canonicalOriginal: v.optional(v.string()),
};

export const createDraft = mutation({
  args: { token: v.string(), ...postFieldsArgs },
  handler: async (ctx, { token, ...fields }) => {
    const identity = await requireTeamSession(ctx, token);
    const clean = await validatePostFields(ctx, fields, undefined);
    const now = Date.now();
    const id = await ctx.db.insert("posts", {
      ...clean,
      status: "draft",
      deleted: false,
      legacy: false,
      createdAt: now,
      updatedAt: now,
      updatedBy: identity.email,
    });
    await logPostHistory(ctx, identity, "create", id, null, clean);
    return { ok: true as const, id };
  },
});

export const save = mutation({
  args: { token: v.string(), id: v.id("posts"), expectedUpdatedAt: v.number(), ...postFieldsArgs },
  handler: async (ctx, { token, id, expectedUpdatedAt, ...fields }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    if (existing.updatedAt !== expectedUpdatedAt) {
      return { ok: false as const, reason: "conflict" as const };
    }
    const clean = await validatePostFields(ctx, fields, id);
    const now = Date.now();
    const slugChanged = existing.slug !== clean.slug;
    if (slugChanged && existing.status === "published") {
      await ctx.db.insert("postRedirects", { from: existing.slug, to: clean.slug, at: now });
    }
    await ctx.db.patch(id, { ...clean, updatedAt: now, updatedBy: identity.email });
    const before = {
      title: existing.title,
      slug: existing.slug,
      h1: existing.h1,
      description: existing.description,
      excerpt: existing.excerpt,
      category: existing.category,
      date: existing.date,
      time: existing.time,
      featuredImage: existing.featuredImage,
      blocks: existing.blocks,
      canonicalOriginal: existing.canonicalOriginal,
    };
    await logPostHistory(ctx, identity, slugChanged ? "slug_change" : "edit", id, before, clean);
    return { ok: true as const, updatedAt: now };
  },
});

export const publish = mutation({
  args: { token: v.string(), id: v.id("posts") },
  handler: async (ctx, { token, id }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    await validatePostFields(ctx, existing, id);
    await ctx.db.patch(id, { status: "published", updatedAt: Date.now() });
    await logPostHistory(ctx, identity, "publish", id, { status: existing.status }, { status: "published" });
    return { ok: true };
  },
});

export const unpublish = mutation({
  args: { token: v.string(), id: v.id("posts") },
  handler: async (ctx, { token, id }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    await ctx.db.patch(id, { status: "draft", updatedAt: Date.now() });
    await logPostHistory(ctx, identity, "unpublish", id, { status: existing.status }, { status: "draft" });
    return { ok: true };
  },
});

export const trash = mutation({
  args: { token: v.string(), id: v.id("posts") },
  handler: async (ctx, { token, id }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    await ctx.db.patch(id, { deleted: true, updatedAt: Date.now() });
    await logPostHistory(ctx, identity, "trash", id, { deleted: false }, { deleted: true });
    return { ok: true };
  },
});

export const restore = mutation({
  args: { token: v.string(), id: v.id("posts") },
  handler: async (ctx, { token, id }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    await ctx.db.patch(id, { deleted: false, updatedAt: Date.now() });
    await logPostHistory(ctx, identity, "restore", id, { deleted: true }, { deleted: false });
    return { ok: true };
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeamSession(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});
