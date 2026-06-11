import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

function burnFeedUrl(): string | null {
  if (process.env.BURN_FEED_URL) return process.env.BURN_FEED_URL;
  // derive from the spend feed: same gist, sibling file
  const spend = process.env.SPEND_FEED_URL;
  if (spend?.endsWith("/spend.json")) return spend.replace(/spend\.json$/, "burn.json");
  return null;
}

const getBurn = unstable_cache(
  async () => {
    const url = burnFeedUrl();
    if (!url) return null;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
  ["burn-detail"],
  { revalidate: 60 },
);

export async function GET() {
  const body = (await getBurn()) ?? {
    updatedAt: null,
    turns: 0,
    totals: {},
    byModel: [],
    hotspots: {},
  };
  return Response.json(body, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
