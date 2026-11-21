import { ConvexHttpClient } from "convex/browser";

// Server-only. Next.js patches global fetch to route it through its Data
// Cache, which persists across builds (and across deploys on Vercel) unless
// a path is explicitly revalidated. If Convex reads go through the patched
// fetch, a build can permanently bake in a stale/empty answer from before
// content existed. Using the original, unpatched fetch means every call
// here hits Convex live; pages stay static and freshness instead comes from
// revalidatePath after a dashboard save.
export function getServerConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexHttpClient(url, {
    fetch: (input, init) => {
      // Resolved lazily (not at module load) since Next patches global
      // fetch during request handling, not at import time.
      const g = globalThis.fetch as typeof fetch & { _nextOriginalFetch?: typeof fetch };
      return (g._nextOriginalFetch ?? g)(input, init);
    },
  });
}
