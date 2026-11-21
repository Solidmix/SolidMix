"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { PhotoPicker, validateImageFile, readImageDimensions } from "./PhotoPicker";
import { BlogTab } from "./BlogTab";

const TOKEN_KEY = "mi_team_token";

type GalleryItem = {
  id: Id<"galleryPhotos">;
  src: string;
  alt: string;
  width: number;
  height: number;
  deleted: boolean;
};

type HistoryRow = {
  _id: string;
  entityType: "gallery" | "post";
  entityId: string;
  action: string;
  before?: unknown;
  after?: unknown;
  byEmail: string;
  at: number;
};

type Busy = { action: "save" | "move" | "replace" | "delete" | "restore"; label: string };

export function getClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  return url ? new ConvexHttpClient(url) : null;
}

export function TeamDashboardApp() {
  const [token, setToken] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<"gallery" | "blog" | "history">("gallery");

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setChecking(false);
      return;
    }
    const client = getClient();
    if (!client) {
      setChecking(false);
      return;
    }
    client
      .query(api.authData.me, { token: stored })
      .then((res) => {
        if (res.ok) {
          setToken(stored);
          setName(res.name);
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLoggedIn = useCallback((tok: string, userName: string) => {
    sessionStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setName(userName);
  }, []);

  const handleLogout = useCallback(async () => {
    if (token) {
      const client = getClient();
      await client?.mutation(api.authData.logout, { token }).catch(() => {});
    }
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setName("");
  }, [token]);

  if (checking) {
    return <div className="container-content py-20 text-center text-grey">Loading…</div>;
  }

  if (!token) {
    return <LoginScreen onLoggedIn={handleLoggedIn} />;
  }

  return (
    <div className="container-content max-w-5xl py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-grey/20 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Team Dashboard</h1>
          <p className="mt-1 text-sm text-grey">Signed in as {name}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5"
        >
          Logout
        </button>
      </div>

      <nav className="mt-6 flex gap-2">
        {(["gallery", "blog", "history"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 text-sm font-medium capitalize ${
              tab === t ? "bg-primary text-white" : "bg-grey/10 text-ink hover:bg-grey/20"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "gallery" && <GalleryTab token={token} />}
        {tab === "blog" && <BlogTab token={token} />}
        {tab === "history" && <HistoryTab token={token} />}
      </div>
    </div>
  );
}

function LoginScreen({ onLoggedIn }: { onLoggedIn: (token: string, name: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const client = getClient();
    if (!client) {
      setError("Dashboard is not configured.");
      setBusy(false);
      return;
    }
    try {
      const res = await client.action(api.auth.login, { email, password });
      if (res.ok) {
        onLoggedIn(res.token, res.name);
      } else if (res.reason === "locked") {
        setError("Too many wrong attempts. Try again in 15 minutes.");
      } else {
        setError("Wrong email or password.");
      }
    } catch {
      setError("Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container-content flex min-h-[70vh] max-w-sm flex-col justify-center py-20">
      <h1 className="text-center text-2xl font-semibold text-ink">Team Dashboard</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-grey/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function GalleryTab({ token }: { token: string }) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [syncNote, setSyncNote] = useState<"ok" | "fail" | null>(null);

  const [uploading, setUploading] = useState(false);
  const [newAlt, setNewAlt] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  const [busyMap, setBusyMap] = useState<Record<string, Busy>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

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

  // Fire-and-forget: tells the public gallery page to rebuild now, instead
  // of waiting for the next visitor. Never awaited by callers, so it never
  // blocks the dashboard UI.
  const triggerRevalidate = useCallback(() => {
    fetch("/api/revalidate-gallery/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setSyncNote(res.status === 200 ? "ok" : "fail"))
      .catch(() => setSyncNote("fail"));
  }, [token]);

  // Used only for the first load and for add/replace/restore, which need a
  // fresh URL or order from the server. Never clears the list first, so the
  // grid never flickers empty — it only swaps in once the new data arrives.
  const refresh = useCallback(async () => {
    const client = getClient();
    if (!client) return;
    try {
      const res = await client.query(api.gallery.listAll, { token });
      setItems(res as GalleryItem[]);
      setLoadError(null);
    } catch {
      setLoadError("Could not load gallery.");
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadToStorage = async (file: File): Promise<Id<"_storage">> => {
    const client = getClient();
    if (!client) throw new Error("not_configured");
    const uploadUrl = await client.mutation(api.gallery.generateUploadUrl, { token });
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const json = await res.json();
    return json.storageId as Id<"_storage">;
  };

  const addPhoto = async () => {
    if (!newFile) {
      setAddError("Choose a photo first.");
      return;
    }
    const fileError = validateImageFile(newFile);
    if (fileError) {
      setAddError(fileError);
      return;
    }
    const alt = newAlt.trim();
    if (alt.length < 1 || alt.length > 200) {
      setAddError("Alt text is required (max 200 characters).");
      return;
    }
    setUploading(true);
    setAddError(null);
    try {
      const { width, height } = await readImageDimensions(newFile);
      const storageId = await uploadToStorage(newFile);
      const client = getClient();
      await client?.mutation(api.gallery.addPhoto, { token, storageId, alt, width, height });
      setNewFile(null);
      setNewAlt("");
      triggerRevalidate();
      await refresh();
    } catch {
      setAddError("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const replacePhoto = async (id: Id<"galleryPhotos">, file: File) => {
    const fileError = validateImageFile(file);
    if (fileError) {
      setItemError(id, fileError);
      return;
    }
    setItemError(id, null);
    setBusy(id, { action: "replace", label: "Replacing…" });
    try {
      const storageId = await uploadToStorage(file);
      const client = getClient();
      await client?.mutation(api.gallery.replacePhoto, { token, id, storageId });
      triggerRevalidate();
      await refresh();
    } catch {
      setItemError(id, "Replace failed.");
    } finally {
      setBusy(id, null);
    }
  };

  const updateAlt = async (id: Id<"galleryPhotos">, alt: string) => {
    const trimmed = alt.trim();
    if (trimmed.length < 1 || trimmed.length > 200) {
      setItemError(id, "Alt text is required (max 200 characters).");
      return;
    }
    const previous = items.find((i) => i.id === id)?.alt;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, alt: trimmed } : i)));
    setItemError(id, null);
    setBusy(id, { action: "save", label: "Saving…" });
    try {
      const client = getClient();
      await client?.mutation(api.gallery.updateAlt, { token, id, alt: trimmed });
      triggerRevalidate();
    } catch {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, alt: previous ?? i.alt } : i)));
      setItemError(id, "Save failed.");
    } finally {
      setBusy(id, null);
    }
  };

  const softDelete = async (id: Id<"galleryPhotos">) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, deleted: true } : i)));
    setItemError(id, null);
    setBusy(id, { action: "delete", label: "Deleting…" });
    try {
      const client = getClient();
      await client?.mutation(api.gallery.softDelete, { token, id });
      triggerRevalidate();
    } catch {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, deleted: false } : i)));
      setItemError(id, "Delete failed.");
    } finally {
      setBusy(id, null);
    }
  };

  const restore = async (id: Id<"galleryPhotos">) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, deleted: false } : i)));
    setItemError(id, null);
    setBusy(id, { action: "restore", label: "Restoring…" });
    try {
      const client = getClient();
      await client?.mutation(api.gallery.restore, { token, id });
      triggerRevalidate();
      await refresh(); // reconcile the server-assigned order
    } catch {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, deleted: true } : i)));
      setItemError(id, "Restore failed.");
    } finally {
      setBusy(id, null);
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const other = index + direction;
    if (other < 0 || other >= active.length) return;
    const a = active[index];
    const b = active[other];
    const previousItems = items;
    const reorderedActive = [...active];
    [reorderedActive[index], reorderedActive[other]] = [reorderedActive[other], reorderedActive[index]];
    setItems([...reorderedActive, ...deleted]);
    setBusy(a.id, { action: "move", label: "Saving…" });
    setBusy(b.id, { action: "move", label: "Saving…" });
    try {
      const client = getClient();
      await client?.mutation(api.gallery.reorder, { token, ids: reorderedActive.map((p) => p.id) });
      triggerRevalidate();
    } catch {
      setItems(previousItems);
      setItemError(a.id, "Reorder failed.");
    } finally {
      setBusy(a.id, null);
      setBusy(b.id, null);
    }
  };

  const active = items.filter((i) => !i.deleted);
  const deleted = items.filter((i) => i.deleted);

  if (initialLoading) return <p className="text-grey">Loading gallery…</p>;

  return (
    <div>
      {loadError && <p className="mb-4 text-sm text-red-600">{loadError}</p>}
      {syncNote && (
        <p className={`mb-4 text-xs ${syncNote === "ok" ? "text-green-700" : "text-amber-700"}`}>
          {syncNote === "ok" ? "Live on site ✓" : "Saved, but the public page did not update. Try again."}
        </p>
      )}

      <div className="rounded-lg border border-grey/20 p-4">
        <h2 className="text-lg font-semibold text-ink">Add photo</h2>
        <div className="mt-3 max-w-sm">
          <PhotoPicker
            file={newFile}
            onFile={(file) => {
              setNewFile(file);
              setAddError(null);
            }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <input
            type="text"
            placeholder="Alt text (required)"
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            className="min-w-[240px] rounded-md border border-grey/30 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addPhoto}
            disabled={uploading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
        {addError && <p className="mt-2 text-xs text-red-600">{addError}</p>}
      </div>

      <h2 className="mt-8 text-lg font-semibold text-ink">Photos ({active.length})</h2>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((item, i) => (
          <PhotoCard
            key={item.id}
            item={item}
            busy={busyMap[item.id]}
            error={itemErrors[item.id]}
            onMoveUp={i > 0 ? () => move(i, -1) : undefined}
            onMoveDown={i < active.length - 1 ? () => move(i, 1) : undefined}
            onUpdateAlt={(alt) => updateAlt(item.id, alt)}
            onReplace={(file) => replacePhoto(item.id, file)}
            onDelete={() => softDelete(item.id)}
          />
        ))}
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => setShowDeleted((v) => !v)}
          disabled={deleted.length === 0}
          className="rounded-md border border-grey/30 px-4 py-2 text-sm font-medium text-ink hover:bg-grey/5 disabled:opacity-40"
        >
          Deleted photos ({deleted.length})
        </button>
        {showDeleted && deleted.length > 0 && (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {deleted.map((item) => {
              const busy = busyMap[item.id];
              return (
                <div key={item.id} className="rounded-lg border border-grey/20 p-3 opacity-60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} className="h-32 w-full rounded object-cover" />
                  <p className="mt-2 truncate text-xs text-grey">{item.alt}</p>
                  <button
                    type="button"
                    onClick={() => restore(item.id)}
                    disabled={Boolean(busy)}
                    className="mt-2 w-full rounded-md border border-grey/30 py-1.5 text-xs font-medium text-ink hover:bg-grey/5 disabled:opacity-40"
                  >
                    {busy?.action === "restore" ? "Restoring…" : "Restore"}
                  </button>
                  {itemErrors[item.id] && (
                    <p className="mt-1 text-xs text-red-600">{itemErrors[item.id]}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoCard({
  item,
  busy,
  error,
  onMoveUp,
  onMoveDown,
  onUpdateAlt,
  onReplace,
  onDelete,
}: {
  item: GalleryItem;
  busy?: Busy;
  error?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onUpdateAlt: (alt: string) => void;
  onReplace: (file: File) => void;
  onDelete: () => void;
}) {
  const [alt, setAlt] = useState(item.alt);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const isBusy = Boolean(busy);

  useEffect(() => {
    setAlt(item.alt);
  }, [item.alt]);

  return (
    <div className="rounded-lg border border-grey/20 p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.alt} className="h-40 w-full rounded object-cover" />
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          disabled={isBusy}
          className="w-full rounded-md border border-grey/30 px-2 py-1 text-xs"
        />
        <button
          type="button"
          onClick={() => onUpdateAlt(alt)}
          disabled={isBusy || alt.trim() === item.alt}
          className="shrink-0 rounded-md border border-grey/30 px-2 py-1 text-xs font-medium text-ink hover:bg-grey/5 disabled:opacity-30"
        >
          {busy?.action === "save" ? "Saving…" : "Save"}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!onMoveUp || isBusy}
          className="rounded-md border border-grey/30 px-2 py-1 text-xs disabled:opacity-30"
        >
          {busy?.action === "move" ? "…" : "↑"}
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!onMoveDown || isBusy}
          className="rounded-md border border-grey/30 px-2 py-1 text-xs disabled:opacity-30"
        >
          {busy?.action === "move" ? "…" : "↓"}
        </button>
        <input
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onReplace(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => replaceInputRef.current?.click()}
          disabled={isBusy}
          className="rounded-md border border-grey/30 px-2 py-1 text-xs font-medium text-ink hover:bg-grey/5 disabled:opacity-30"
        >
          {busy?.action === "replace" ? "Replacing…" : "Replace photo"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isBusy}
          className="rounded-md border border-red-300 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-30"
        >
          {busy?.action === "delete" ? "Deleting…" : "Delete"}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function HistoryTab({ token }: { token: string }) {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "gallery" | "post">("all");

  useEffect(() => {
    const client = getClient();
    if (!client) return;
    client
      .query(api.history.listRecent, { token, limit: 200 })
      .then((res) => setRows(res as HistoryRow[]))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-grey">Loading history…</p>;

  const filtered = filter === "all" ? rows : rows.filter((r) => r.entityType === filter);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "gallery", "post"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
              filter === f ? "bg-primary text-white" : "bg-grey/10 text-ink hover:bg-grey/20"
            }`}
          >
            {f === "post" ? "blog" : f}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-grey">No changes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-grey/20 text-grey">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Who</th>
                <th className="py-2 pr-4">Entity</th>
                <th className="py-2 pr-4">Action</th>
                <th className="py-2 pr-4">Item</th>
                <th className="py-2 pr-4">Before</th>
                <th className="py-2">After</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b border-grey/10 align-top">
                  <td className="whitespace-nowrap py-2 pr-4 text-grey">
                    {new Date(r.at).toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 pr-4">{r.byEmail}</td>
                  <td className="py-2 pr-4 capitalize">{r.entityType === "post" ? "blog" : r.entityType}</td>
                  <td className="py-2 pr-4 capitalize">{r.action}</td>
                  <td className="max-w-[140px] truncate py-2 pr-4 text-grey">{r.entityId}</td>
                  <td className="max-w-[220px] py-2 pr-4 text-xs text-grey">
                    {r.before ? JSON.stringify(r.before) : "—"}
                  </td>
                  <td className="max-w-[220px] py-2 text-xs text-grey">
                    {r.after ? JSON.stringify(r.after) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
