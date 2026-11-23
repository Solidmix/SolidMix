"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { getClient } from "./TeamDashboardApp";
import { PostEditor } from "./PostEditor";

export type PostRow = {
  id: Id<"posts">;
  slug: string;
  title: string;
  h1: string;
  status: "draft" | "published";
  deleted: boolean;
  legacy: boolean;
  category: string;
  date: string;
  updatedAt: number;
};

type Busy = { action: "trash" | "restore"; label: string };

export function postRevalidatePaths(row: { slug: string; category: string }): string[] {
  return [`/${row.slug}/`, `/category/${row.category}/`, "/concrete-blog-in-raipur/", "/sitemap.xml"];
}

export function BlogTab({ token }: { token: string }) {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<"ok" | "fail" | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [showTrash, setShowTrash] = useState(false);

  const [busyMap, setBusyMap] = useState<Record<string, Busy>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

  const [editing, setEditing] = useState<"new" | Id<"posts"> | null>(null);

  const setBusy = (id: string, busy: Busy | null) => {
    setBusyMap((m) => {
      const next = { ...m };
      if (busy) next[id] = busy;
      else delete next[id];
      return next;
    });
  };

  const setItemError = (id: string, msg: string | null) => {
    setItemErrors((m) => {
      const next = { ...m };
      if (msg) next[id] = msg;
      else delete next[id];
      return next;
    });
  };

  const triggerRevalidate = useCallback(
    (paths: string[]) => {
      if (paths.length === 0) return;
      fetch("/api/revalidate-blog/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, paths }),
      })
        .then((res) => setSyncNote(res.status === 200 ? "ok" : "fail"))
        .catch(() => setSyncNote("fail"));
    },
    [token],
  );

  const refresh = useCallback(async () => {
    const client = getClient();
    if (!client) return;
    try {
      const rows = await client.query(api.posts.listAll, { token });
      setPosts(rows as PostRow[]);
      setLoadError(null);
    } catch {
      setLoadError("Could not load posts.");
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const trashPost = async (row: PostRow) => {
    setPosts((prev) => prev.map((p) => (p.id === row.id ? { ...p, deleted: true } : p)));
    setItemError(row.id, null);
    setBusy(row.id, { action: "trash", label: "Trashing…" });
    try {
      const client = getClient();
      await client?.mutation(api.posts.trash, { token, id: row.id });
      if (row.status === "published") triggerRevalidate(postRevalidatePaths(row));
    } catch {
      setPosts((prev) => prev.map((p) => (p.id === row.id ? { ...p, deleted: false } : p)));
      setItemError(row.id, "Move to Trash failed.");
    } finally {
      setBusy(row.id, null);
    }
  };

  const restorePost = async (row: PostRow) => {
    setPosts((prev) => prev.map((p) => (p.id === row.id ? { ...p, deleted: false } : p)));
    setItemError(row.id, null);
    setBusy(row.id, { action: "restore", label: "Restoring…" });
    try {
      const client = getClient();
      await client?.mutation(api.posts.restore, { token, id: row.id });
      if (row.status === "published") triggerRevalidate(postRevalidatePaths(row));
    } catch {
      setPosts((prev) => prev.map((p) => (p.id === row.id ? { ...p, deleted: true } : p)));
      setItemError(row.id, "Restore failed.");
    } finally {
      setBusy(row.id, null);
    }
  };

  const handleSaved = useCallback(
    (paths: string[]) => {
      setEditing(null);
      refresh();
      triggerRevalidate(paths);
    },
    [refresh, triggerRevalidate],
  );

  if (initialLoading) return <p className="text-grey">Loading posts…</p>;

  if (editing !== null) {
    return (
      <PostEditor
        token={token}
        postId={editing === "new" ? undefined : editing}
        onClose={() => setEditing(null)}
        onSaved={handleSaved}
      />
    );
  }

  const active = posts.filter((p) => !p.deleted);
  const trashed = posts.filter((p) => p.deleted);
  const q = query.trim().toLowerCase();
  const visible = active.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (q && !p.title.toLowerCase().includes(q) && !p.h1.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  return (
    <div>
      {loadError && <p className="mb-4 text-sm text-red-600">{loadError}</p>}
      {syncNote && (
        <p className={`mb-4 text-xs ${syncNote === "ok" ? "text-green-700" : "text-amber-700"}`}>
          {syncNote === "ok" ? "Live on site ✓" : "Saved, but the public page did not update. Try again."}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            placeholder="Search posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-w-[200px] rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                statusFilter === f ? "bg-primary text-white" : "bg-grey/10 text-ink hover:bg-grey/20"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          New post
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-grey/20 text-grey">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const busy = busyMap[row.id];
              const isBusy = Boolean(busy);
              return (
                <tr key={row.id} className="border-b border-grey/10 align-top">
                  <td className="max-w-[260px] truncate py-2 pr-4 font-medium text-ink">{row.title}</td>
                  <td className="py-2 pr-4 text-grey">{row.slug}</td>
                  <td className="py-2 pr-4 text-grey">{row.category}</td>
                  <td className="py-2 pr-4 capitalize">{row.status}</td>
                  <td className="whitespace-nowrap py-2 pr-4 text-grey">{row.date}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing(row.id)}
                        disabled={isBusy}
                        className="rounded-md border border-grey/30 px-2 py-1 text-xs font-medium text-ink hover:bg-grey/5 disabled:opacity-30"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => trashPost(row)}
                        disabled={isBusy}
                        className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-30"
                      >
                        {busy?.action === "trash" ? "Trashing…" : "Trash"}
                      </button>
                    </div>
                    {itemErrors[row.id] && <p className="mt-1 text-xs text-red-600">{itemErrors[row.id]}</p>}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-grey">
                  No posts match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={() => setShowTrash((v) => !v)}
          disabled={trashed.length === 0}
          className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5 disabled:opacity-40"
        >
          Trash ({trashed.length})
        </button>
        {showTrash && trashed.length > 0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-grey/20 text-grey">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Slug</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {trashed.map((row) => {
                  const busy = busyMap[row.id];
                  return (
                    <tr key={row.id} className="border-b border-grey/10 align-top opacity-70">
                      <td className="max-w-[260px] truncate py-2 pr-4">{row.title}</td>
                      <td className="py-2 pr-4 text-grey">{row.slug}</td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => restorePost(row)}
                          disabled={Boolean(busy)}
                          className="rounded-md border border-grey/30 px-2 py-1 text-xs font-medium text-ink hover:bg-grey/5 disabled:opacity-30"
                        >
                          {busy?.action === "restore" ? "Restoring…" : "Restore"}
                        </button>
                        {itemErrors[row.id] && <p className="mt-1 text-xs text-red-600">{itemErrors[row.id]}</p>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
