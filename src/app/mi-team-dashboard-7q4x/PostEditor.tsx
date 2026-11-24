"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { InlineText } from "@/components/InlineText";
import { getClient } from "./TeamDashboardApp";
import { PhotoPicker, validateImageFile } from "./PhotoPicker";

// A client-safe equivalent of src/lib/content.ts's Block type. Preview
// cannot import the real BlockRenderer/content.ts here: that module reads
// JSON files with node:fs/node:path, which only works in Server Components
// and breaks the dashboard's client bundle. InlineText (bold/link markup)
// is reused directly so Preview still renders body text identically to the
// public page.
type PreviewBlock =
  | { type: "p"; text: string }
  | { type: "heading"; level: number; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string }
  | { type: "table"; rows: string[][] };

function postRevalidatePaths(row: { slug: string; category: string }): string[] {
  return [`/${row.slug}/`, `/category/${row.category}/`, "/concrete-blog-in-raipur/", "/sitemap.xml"];
}

type EditorBlock =
  | { localId: string; type: "p"; text: string }
  | { localId: string; type: "heading"; level: 2 | 3; text: string }
  | { localId: string; type: "list"; text: string }
  | { localId: string; type: "table"; text: string }
  | {
      localId: string;
      type: "image";
      alt: string;
      src?: string;
      storageId?: Id<"_storage">;
      file?: File;
      localPreviewUrl?: string;
    };

function newLocalId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Legacy block JSON (src/content/pages/*.json, now migrated into Convex)
// uses the exact same shape as PageContent's Block type from src/lib/content —
// this just maps it into the editor's local per-block form state.
function fromServerBlocks(blocks: unknown[]): EditorBlock[] {
  return (blocks as Record<string, unknown>[]).map((b) => {
    const localId = newLocalId();
    if (b.type === "list") return { localId, type: "list", text: (b.items as string[]).join("\n") };
    if (b.type === "table") {
      return {
        localId,
        type: "table",
        text: (b.rows as string[][]).map((row) => row.join(" | ")).join("\n"),
      };
    }
    if (b.type === "image") {
      return {
        localId,
        type: "image",
        alt: (b.alt as string) ?? "",
        src: b.src as string | undefined,
        storageId: b.storageId as Id<"_storage"> | undefined,
      };
    }
    if (b.type === "heading") {
      const level = (b.level as number) === 3 ? 3 : 2;
      return { localId, type: "heading", level, text: (b.text as string) ?? "" };
    }
    return { localId, type: "p", text: (b.text as string) ?? "" };
  });
}

function toPreviewBlocks(blocks: EditorBlock[]): PreviewBlock[] {
  return blocks.map((b): PreviewBlock => {
    if (b.type === "list") {
      return { type: "list", items: b.text.split("\n").map((s) => s.trim()).filter(Boolean) };
    }
    if (b.type === "table") {
      return {
        type: "table",
        rows: b.text
          .split("\n")
          .filter((l) => l.trim().length > 0)
          .map((line) => line.split("|").map((c) => c.trim())),
      };
    }
    if (b.type === "image") {
      return { type: "image", src: b.localPreviewUrl ?? b.src ?? "", alt: b.alt };
    }
    if (b.type === "heading") return { type: "heading", level: b.level, text: b.text };
    return { type: "p", text: b.text };
  });
}

async function finalizeBlocks(token: string, blocks: EditorBlock[]): Promise<unknown[]> {
  const client = getClient();
  const out: unknown[] = [];
  for (const b of blocks) {
    if (b.type === "list") {
      out.push({ type: "list", items: b.text.split("\n").map((s) => s.trim()).filter(Boolean) });
    } else if (b.type === "table") {
      out.push({
        type: "table",
        rows: b.text
          .split("\n")
          .filter((l) => l.trim().length > 0)
          .map((line) => line.split("|").map((c) => c.trim())),
      });
    } else if (b.type === "image") {
      let storageId = b.storageId;
      if (b.file && client) {
        const uploadUrl = await client.mutation(api.posts.generateUploadUrl, { token });
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": b.file.type },
          body: b.file,
        });
        const json = await res.json();
        storageId = json.storageId as Id<"_storage">;
      }
      out.push({
        type: "image",
        ...(storageId ? { storageId } : {}),
        ...(!storageId && b.src ? { src: b.src } : {}),
        alt: b.alt,
      });
    } else if (b.type === "heading") {
      out.push({ type: "heading", level: b.level, text: b.text });
    } else {
      out.push({ type: "p", text: b.text });
    }
  }
  return out;
}

function PreviewBlockItem({ block }: { block: PreviewBlock }) {
  if (block.type === "heading") {
    const className = "mt-4 font-semibold text-ink";
    if (block.level === 3) return <h3 className={`${className} text-lg`}><InlineText text={block.text} /></h3>;
    return <h2 className={`${className} text-xl`}><InlineText text={block.text} /></h2>;
  }
  if (block.type === "p") {
    return (
      <p className="mt-3 leading-relaxed text-grey">
        <InlineText text={block.text} />
      </p>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {block.items.map((item, i) => (
          <li key={i} className="text-grey">
            <InlineText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.type === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={block.src} alt={block.alt} className="mt-3 h-auto w-full rounded" />
    );
  }
  return (
    <table className="mt-3 w-full border-collapse text-sm">
      <tbody>
        {block.rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={j} className="border border-grey/20 px-2 py-1 text-grey">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TextBlockField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    onChange(value.slice(0, start) + before + value.slice(start, end) + after + value.slice(end));
  };

  const addLink = () => {
    const url = window.prompt("Link URL (e.g. /some-page/ or https://...)");
    if (url) wrap("[", `](${url})`);
  };

  return (
    <div>
      <div className="mb-1 flex gap-1">
        <button
          type="button"
          onClick={() => wrap("[[b]]", "[[/b]]")}
          className="rounded border border-grey/30 px-2 py-0.5 text-xs font-bold text-ink"
        >
          B
        </button>
        <button
          type="button"
          onClick={addLink}
          className="rounded border border-grey/30 px-2 py-0.5 text-xs text-ink underline"
        >
          Link
        </button>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-grey/30 px-2 py-1 text-sm"
      />
    </div>
  );
}

type SavingAction = "draft" | "publish" | "unpublish" | "trash" | "restore" | null;

export function PostEditor({
  token,
  postId,
  onClose,
  onSaved,
}: {
  token: string;
  postId?: Id<"posts">;
  onClose: () => void;
  onSaved: (revalidatePaths: string[]) => void;
}) {
  const [loading, setLoading] = useState(Boolean(postId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [h1, setH1] = useState("");
  const [description, setDescription] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [canonicalOriginal, setCanonicalOriginal] = useState<string | undefined>(undefined);

  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImageStorageId, setFeaturedImageStorageId] = useState<Id<"_storage"> | undefined>(undefined);
  const [featuredImageExistingSrc, setFeaturedImageExistingSrc] = useState<string | undefined>(undefined);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState<string | undefined>(undefined);
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");

  const [blocks, setBlocks] = useState<EditorBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [deleted, setDeleted] = useState(false);
  const [expectedUpdatedAt, setExpectedUpdatedAt] = useState<number | undefined>(undefined);

  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState<SavingAction>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    client.query(api.posts.categories, { token }).then((cats) => {
      setCategories(cats);
      setCategory((c) => c || cats[0] || "");
    });
  }, [token]);

  useEffect(() => {
    if (!postId) return;
    const client = getClient();
    if (!client) return;
    client
      .query(api.posts.getForEdit, { token, id: postId })
      .then((post) => {
        if (!post) {
          setLoadError("Post not found.");
          return;
        }
        setTitle(post.title);
        setSlug(post.slug);
        setH1(post.h1);
        setDescription(post.description);
        setExcerpt(post.excerpt);
        setCategory(post.category);
        setDate(post.date);
        setTime(post.time ?? "");
        setCanonicalOriginal(post.canonicalOriginal);
        setFeaturedImageStorageId(post.featuredImage.storageId as Id<"_storage"> | undefined);
        setFeaturedImageExistingSrc(post.featuredImage.src);
        setFeaturedImagePreviewUrl(post.featuredImageUrl ?? undefined);
        setFeaturedImageAlt(post.featuredImage.alt);
        setBlocks(fromServerBlocks(post.blocks));
        setStatus(post.status);
        setDeleted(post.deleted);
        setExpectedUpdatedAt(post.updatedAt);
      })
      .catch(() => setLoadError("Could not load this post."))
      .finally(() => setLoading(false));
  }, [token, postId]);

  const markDirty = useCallback(() => setDirty(true), []);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const addBlock = (type: "p" | "heading" | "list" | "image" | "table", level?: 2 | 3) => {
    const localId = newLocalId();
    let block: EditorBlock;
    if (type === "heading") block = { localId, type: "heading", level: level ?? 2, text: "" };
    else if (type === "list") block = { localId, type: "list", text: "" };
    else if (type === "table") block = { localId, type: "table", text: "" };
    else if (type === "image") block = { localId, type: "image", alt: "" };
    else block = { localId, type: "p", text: "" };
    setBlocks((prev) => [...prev, block]);
    markDirty();
  };

  const updateBlock = (localId: string, patch: Partial<EditorBlock>) => {
    setBlocks((prev) => prev.map((b) => (b.localId === localId ? ({ ...b, ...patch } as EditorBlock) : b)));
    markDirty();
  };

  const removeBlock = (localId: string) => {
    setBlocks((prev) => prev.filter((b) => b.localId !== localId));
    markDirty();
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const other = index + direction;
    if (other < 0 || other >= blocks.length) return;
    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[other]] = [next[other], next[index]];
      return next;
    });
    markDirty();
  };

  async function prepareForSave() {
    if (!title.trim()) return setError("Title is required."), null;
    if (!slug.trim()) return setError("URL slug is required."), null;
    const metaLen = description.trim().length;
    if (metaLen < 50 || metaLen > 160) return setError("Meta description must be 50-160 characters."), null;
    if (!excerpt.trim()) return setError("Excerpt is required."), null;
    if (!category) return setError("Category is required."), null;
    if (!date) return setError("Date is required."), null;
    if (!featuredImageFile && !featuredImageStorageId && !featuredImageExistingSrc) {
      return setError("Featured image is required."), null;
    }
    if (!featuredImageAlt.trim()) return setError("Featured image alt text is required."), null;
    if (blocks.length === 0) return setError("Add at least one body block."), null;

    setError(null);
    const client = getClient();
    let featuredImage: { storageId?: Id<"_storage">; src?: string; alt: string };
    if (featuredImageFile && client) {
      const uploadUrl = await client.mutation(api.posts.generateUploadUrl, { token });
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": featuredImageFile.type },
        body: featuredImageFile,
      });
      const json = await res.json();
      featuredImage = { storageId: json.storageId, alt: featuredImageAlt.trim() };
    } else {
      featuredImage = {
        storageId: featuredImageStorageId,
        src: featuredImageStorageId ? undefined : featuredImageExistingSrc,
        alt: featuredImageAlt.trim(),
      };
    }

    const serverBlocks = await finalizeBlocks(token, blocks);

    return {
      title: title.trim(),
      slug: slug.trim().toLowerCase(),
      h1: h1.trim(),
      description: description.trim(),
      excerpt: excerpt.trim(),
      category,
      date,
      time: time.trim() || undefined,
      featuredImage,
      blocks: serverBlocks,
      canonicalOriginal,
    };
  }

  const saveDraft = async () => {
    setSaving("draft");
    try {
      const fields = await prepareForSave();
      if (!fields) return;
      const client = getClient();
      if (!client) return;
      if (postId) {
        const res = await client.mutation(api.posts.save, {
          token,
          id: postId,
          expectedUpdatedAt: expectedUpdatedAt ?? 0,
          ...fields,
        });
        if (!res.ok) {
          setError("Someone else saved this post after you opened it. Reload and try again.");
          return;
        }
        setExpectedUpdatedAt(res.updatedAt);
        setDirty(false);
        onSaved(status === "published" ? postRevalidatePaths(fields) : []);
      } else {
        await client.mutation(api.posts.createDraft, { token, ...fields });
        setDirty(false);
        onSaved([]);
      }
    } catch {
      setError("Save failed. Check the fields and try again.");
    } finally {
      setSaving(null);
    }
  };

  const publish = async () => {
    setSaving("publish");
    try {
      const fields = await prepareForSave();
      if (!fields) return;
      const client = getClient();
      if (!client) return;
      let id = postId;
      if (!id) {
        const res = await client.mutation(api.posts.createDraft, { token, ...fields });
        id = res.id;
      } else {
        const res = await client.mutation(api.posts.save, {
          token,
          id,
          expectedUpdatedAt: expectedUpdatedAt ?? 0,
          ...fields,
        });
        if (!res.ok) {
          setError("Someone else saved this post after you opened it. Reload and try again.");
          return;
        }
      }
      await client.mutation(api.posts.publish, { token, id });
      setDirty(false);
      onSaved(postRevalidatePaths(fields));
    } catch {
      setError("Publish failed. Check the fields and try again.");
    } finally {
      setSaving(null);
    }
  };

  const unpublish = async () => {
    if (!postId) return;
    setSaving("unpublish");
    try {
      const client = getClient();
      await client?.mutation(api.posts.unpublish, { token, id: postId });
      onSaved(postRevalidatePaths({ slug, category }));
    } catch {
      setError("Unpublish failed.");
    } finally {
      setSaving(null);
    }
  };

  const trashThis = async () => {
    if (!postId) return;
    setSaving("trash");
    try {
      const client = getClient();
      await client?.mutation(api.posts.trash, { token, id: postId });
      onSaved(status === "published" ? postRevalidatePaths({ slug, category }) : []);
    } catch {
      setError("Move to Trash failed.");
    } finally {
      setSaving(null);
    }
  };

  const restoreThis = async () => {
    if (!postId) return;
    setSaving("restore");
    try {
      const client = getClient();
      await client?.mutation(api.posts.restore, { token, id: postId });
      onSaved(status === "published" ? postRevalidatePaths({ slug, category }) : []);
    } catch {
      setError("Restore failed.");
    } finally {
      setSaving(null);
    }
  };

  const handleClose = () => {
    if (dirty && !window.confirm("Discard unsaved changes?")) return;
    onClose();
  };

  if (loading) return <p className="text-grey">Loading post…</p>;
  if (loadError) return <p className="text-red-600">{loadError}</p>;

  const busy = saving !== null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">{postId ? "Edit post" : "New post"}</h2>
        <button type="button" onClick={handleClose} className="text-sm text-grey hover:underline">
          ← Back to list
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              markDirty();
            }}
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">URL slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              markDirty();
            }}
            placeholder="lowercase-with-hyphens"
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">H1 (defaults to title)</label>
          <input
            type="text"
            value={h1}
            onChange={(e) => {
              setH1(e.target.value);
              markDirty();
            }}
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              markDirty();
            }}
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              markDirty();
            }}
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Time (optional)</label>
          <input
            type="text"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              markDirty();
            }}
            placeholder="e.g. 2:38 pm"
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink">Meta description</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            markDirty();
          }}
          rows={2}
          className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
        />
        <p className={`mt-1 text-xs ${description.trim().length < 50 || description.trim().length > 160 ? "text-red-600" : "text-grey"}`}>
          {description.trim().length}/160 characters (minimum 50)
        </p>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => {
            setExcerpt(e.target.value);
            markDirty();
          }}
          rows={2}
          className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink">Featured image</label>
        {!featuredImageFile && featuredImagePreviewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={featuredImagePreviewUrl} alt="" className="mb-2 mt-1 h-20 w-20 rounded object-cover" />
        )}
        <div className="mt-1 max-w-sm">
          <PhotoPicker
            file={featuredImageFile}
            onFile={(file) => {
              setFeaturedImageFile(file);
              markDirty();
            }}
          />
        </div>
        <input
          type="text"
          placeholder="Alt text (required)"
          value={featuredImageAlt}
          onChange={(e) => {
            setFeaturedImageAlt(e.target.value);
            markDirty();
          }}
          className="mt-2 w-full max-w-sm rounded-md border border-grey/30 px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-ink">Body</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={() => addBlock("p")} className="rounded-md border border-grey/30 px-2 py-1 text-xs text-ink hover:bg-grey/5">
            + Paragraph
          </button>
          <button type="button" onClick={() => addBlock("heading", 2)} className="rounded-md border border-grey/30 px-2 py-1 text-xs text-ink hover:bg-grey/5">
            + Heading H2
          </button>
          <button type="button" onClick={() => addBlock("heading", 3)} className="rounded-md border border-grey/30 px-2 py-1 text-xs text-ink hover:bg-grey/5">
            + Heading H3
          </button>
          <button type="button" onClick={() => addBlock("list")} className="rounded-md border border-grey/30 px-2 py-1 text-xs text-ink hover:bg-grey/5">
            + List
          </button>
          <button type="button" onClick={() => addBlock("image")} className="rounded-md border border-grey/30 px-2 py-1 text-xs text-ink hover:bg-grey/5">
            + Image
          </button>
          <button type="button" onClick={() => addBlock("table")} className="rounded-md border border-grey/30 px-2 py-1 text-xs text-ink hover:bg-grey/5">
            + Table
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {blocks.map((b, i) => (
            <div key={b.localId} className="rounded-md border border-grey/20 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-grey">
                  {b.type === "heading" ? `heading h${b.level}` : b.type}
                </span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="rounded border border-grey/30 px-2 py-0.5 text-xs disabled:opacity-30">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1} className="rounded border border-grey/30 px-2 py-0.5 text-xs disabled:opacity-30">
                    ↓
                  </button>
                  <button type="button" onClick={() => removeBlock(b.localId)} className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-600">
                    Remove
                  </button>
                </div>
              </div>

              {(b.type === "p" || b.type === "heading") && (
                <TextBlockField value={b.text} onChange={(text) => updateBlock(b.localId, { text })} />
              )}
              {b.type === "list" && (
                <textarea
                  value={b.text}
                  onChange={(e) => updateBlock(b.localId, { text: e.target.value })}
                  placeholder="One item per line"
                  rows={3}
                  className="w-full rounded-md border border-grey/30 px-2 py-1 text-sm"
                />
              )}
              {b.type === "table" && (
                <textarea
                  value={b.text}
                  onChange={(e) => updateBlock(b.localId, { text: e.target.value })}
                  placeholder="One row per line, cells separated by |"
                  rows={3}
                  className="w-full rounded-md border border-grey/30 px-2 py-1 text-sm"
                />
              )}
              {b.type === "image" && (
                <div>
                  {(b.localPreviewUrl || b.src) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.localPreviewUrl ?? b.src} alt="" className="mb-2 h-24 w-auto rounded" />
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const err = validateImageFile(file);
                      if (err) {
                        setError(err);
                        return;
                      }
                      updateBlock(b.localId, {
                        file,
                        localPreviewUrl: URL.createObjectURL(file),
                        storageId: undefined,
                        src: undefined,
                      });
                    }}
                    className="mb-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Alt text (required)"
                    value={b.alt}
                    onChange={(e) => updateBlock(b.localId, { alt: e.target.value })}
                    className="w-full rounded-md border border-grey/30 px-2 py-1 text-sm"
                  />
                </div>
              )}
            </div>
          ))}
          {blocks.length === 0 && <p className="text-sm text-grey">No body blocks yet.</p>}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5"
        >
          {showPreview ? "Hide preview" : "Preview"}
        </button>
        {showPreview && (
          <div className="mt-3 rounded-lg border border-grey/20 p-6">
            <h1 className="text-[28px] font-semibold text-primary md:text-[40px]">{h1.trim() || title}</h1>
            <div className="mt-6">
              {toPreviewBlocks(blocks).map((b, i) => (
                <PreviewBlockItem key={i} block={b} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-grey/20 pt-4">
        <button
          type="button"
          onClick={saveDraft}
          disabled={busy}
          className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5 disabled:opacity-60"
        >
          {saving === "draft" ? "Saving…" : "Save draft"}
        </button>
        {status === "published" && postId ? (
          <button
            type="button"
            onClick={unpublish}
            disabled={busy}
            className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5 disabled:opacity-60"
          >
            {saving === "unpublish" ? "Unpublishing…" : "Unpublish"}
          </button>
        ) : (
          <button
            type="button"
            onClick={publish}
            disabled={busy}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving === "publish" ? "Publishing…" : "Publish"}
          </button>
        )}
        {postId && !deleted && (
          <button
            type="button"
            onClick={trashThis}
            disabled={busy}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {saving === "trash" ? "Trashing…" : "Move to Trash"}
          </button>
        )}
        {postId && deleted && (
          <button
            type="button"
            onClick={restoreThis}
            disabled={busy}
            className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5 disabled:opacity-60"
          >
            {saving === "restore" ? "Restoring…" : "Restore"}
          </button>
        )}
      </div>
    </div>
  );
}
