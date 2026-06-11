import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

const POINTER_URL =
  "https://raw.githubusercontent.com/AgentWorkforce/vibe-city-game/main/demo.mp4";

// The repo stores demo.mp4 in Git LFS; the raw URL serves a tiny pointer file
// whose oid changes with every new video — a perfect cache-busting version key.
const getMeta = unstable_cache(
  async () => {
    try {
      const res = await fetch(POINTER_URL, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return { available: false as const };
      const text = (await res.text()).slice(0, 500);
      const oid = text.match(/oid sha256:([0-9a-f]{64})/)?.[1];
      if (!oid) {
        // not an LFS pointer (maybe a small mp4 committed directly): hash-less fallback
        return { available: true as const, v: "raw" };
      }
      return { available: true as const, v: oid.slice(0, 16) };
    } catch {
      return { available: false as const };
    }
  },
  ["video-meta"],
  { revalidate: 120 },
);

export async function GET() {
  return Response.json(await getMeta(), {
    headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=600" },
  });
}
