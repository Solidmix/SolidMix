import { mutation, query, type MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireTeamSession, type TeamIdentity } from "./authData";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Photo = {
  _id: Id<"galleryPhotos">;
  storageId?: Id<"_storage">;
  src?: string;
  alt: string;
  width: number;
  height: number;
  order: number;
  deleted: boolean;
  createdAt: number;
  updatedAt: number;
};

async function resolveUrl(ctx: MutationCtx | { storage: { getUrl: (id: Id<"_storage">) => Promise<string | null> } }, photo: Photo): Promise<string | null> {
  if (photo.storageId) return await ctx.storage.getUrl(photo.storageId);
  return photo.src ?? null;
}

function publicShape(id: Id<"galleryPhotos">, url: string, photo: Photo) {
  return { id, src: url, alt: photo.alt, width: photo.width, height: photo.height };
}

async function logHistory(
  ctx: MutationCtx,
  identity: TeamIdentity,
  action: "create" | "edit" | "replace" | "reorder" | "delete" | "restore",
  entityId: string,
  before: unknown,
  after: unknown,
) {
  await ctx.db.insert("contentHistory", {
    entityType: "gallery",
    entityId,
    action,
    before,
    after,
    byUserId: identity.userId,
    byEmail: identity.email,
    at: Date.now(),
  });
}

function validateAlt(alt: string): string {
  const trimmed = alt.trim();
  if (trimmed.length < 1 || trimmed.length > 200) {
    throw new Error("alt_invalid");
  }
  return trimmed;
}

async function nextOrder(ctx: MutationCtx): Promise<number> {
  const all = await ctx.db.query("galleryPhotos").collect();
  return all.length ? Math.max(...all.map((p) => p.order)) + 1 : 0;
}

async function checkStorageMetadata(ctx: MutationCtx, storageId: Id<"_storage">) {
  const meta = await ctx.db.system.get(storageId);
  if (!meta) throw new Error("upload_missing");
  if (meta.size > MAX_BYTES) throw new Error("file_too_large");
  if (meta.contentType && !ALLOWED_TYPES.includes(meta.contentType)) {
    throw new Error("file_type_invalid");
  }
}

// Public: the live gallery page reads only non-deleted photos, in order.
export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("galleryPhotos")
      .withIndex("by_deleted_order", (q) => q.eq("deleted", false))
      .order("asc")
      .collect();
    const out = [];
    for (const row of rows) {
      const url = await resolveUrl(ctx, row as Photo);
      if (url) out.push(publicShape(row._id, url, row as Photo));
    }
    return out;
  },
});

// Team-only: dashboard Gallery tab shows active + deleted (for Restore).
export const listAll = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeamSession(ctx, token);
    const rows = await ctx.db.query("galleryPhotos").collect();
    rows.sort((a, b) => (a.deleted === b.deleted ? a.order - b.order : a.deleted ? 1 : -1));
    const out = [];
    for (const row of rows) {
      const url = await resolveUrl(ctx, row as Photo);
      out.push({ ...publicShape(row._id, url ?? "", row as Photo), deleted: row.deleted });
    }
    return out;
  },
});

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireTeamSession(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const addPhoto = mutation({
  args: {
    token: v.string(),
    storageId: v.id("_storage"),
    alt: v.string(),
    width: v.number(),
    height: v.number(),
  },
  handler: async (ctx, { token, storageId, alt, width, height }) => {
    const identity = await requireTeamSession(ctx, token);
    await checkStorageMetadata(ctx, storageId);
    const cleanAlt = validateAlt(alt);
    const order = await nextOrder(ctx);
    const now = Date.now();
    const id = await ctx.db.insert("galleryPhotos", {
      storageId,
      alt: cleanAlt,
      width,
      height,
      order,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    });
    await logHistory(ctx, identity, "create", id, null, { storageId, alt: cleanAlt, width, height, order });
    return { ok: true, id };
  },
});

export const replacePhoto = mutation({
  args: { token: v.string(), id: v.id("galleryPhotos"), storageId: v.id("_storage") },
  handler: async (ctx, { token, id, storageId }) => {
    const identity = await requireTeamSession(ctx, token);
    await checkStorageMetadata(ctx, storageId);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    const oldStorageId = existing.storageId;
    await ctx.db.patch(id, { storageId, src: undefined, updatedAt: Date.now() });
    if (oldStorageId) await ctx.storage.delete(oldStorageId);
    await logHistory(
      ctx,
      identity,
      "replace",
      id,
      { storageId: oldStorageId ?? null, src: existing.src ?? null },
      { storageId },
    );
    return { ok: true };
  },
});

export const updateAlt = mutation({
  args: { token: v.string(), id: v.id("galleryPhotos"), alt: v.string() },
  handler: async (ctx, { token, id, alt }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    const cleanAlt = validateAlt(alt);
    await ctx.db.patch(id, { alt: cleanAlt, updatedAt: Date.now() });
    await logHistory(ctx, identity, "edit", id, { alt: existing.alt }, { alt: cleanAlt });
    return { ok: true };
  },
});

export const reorder = mutation({
  args: { token: v.string(), ids: v.array(v.id("galleryPhotos")) },
  handler: async (ctx, { token, ids }) => {
    const identity = await requireTeamSession(ctx, token);
    const before: Record<string, number> = {};
    for (let i = 0; i < ids.length; i++) {
      const existing = await ctx.db.get(ids[i]);
      if (!existing) throw new Error("not_found");
      before[ids[i]] = existing.order;
      await ctx.db.patch(ids[i], { order: i, updatedAt: Date.now() });
    }
    await logHistory(ctx, identity, "reorder", ids.join(","), before, { order: ids });
    return { ok: true };
  },
});

export const softDelete = mutation({
  args: { token: v.string(), id: v.id("galleryPhotos") },
  handler: async (ctx, { token, id }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    await ctx.db.patch(id, { deleted: true, updatedAt: Date.now() });
    await logHistory(ctx, identity, "delete", id, { deleted: false }, { deleted: true });
    return { ok: true };
  },
});

export const restore = mutation({
  args: { token: v.string(), id: v.id("galleryPhotos") },
  handler: async (ctx, { token, id }) => {
    const identity = await requireTeamSession(ctx, token);
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("not_found");
    const order = await nextOrder(ctx);
    await ctx.db.patch(id, { deleted: false, order, updatedAt: Date.now() });
    await logHistory(ctx, identity, "restore", id, { deleted: true }, { deleted: false, order });
    return { ok: true };
  },
});
