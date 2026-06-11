import "server-only";
import { unstable_cache } from "next/cache";
import type { Spend } from "./posthog";

export type BurnDetail = {
  updatedAt: string | null;
  turns: number;
  totals: { total?: number };
  byModel: Array<{
    usage?: {
      input?: number;
      output?: number;
      reasoning?: number;
      cacheRead?: number;
    };
  }>;
  hotspots: Record<string, unknown>;
};

function burnFeedUrl(): string | null {
  if (process.env.BURN_FEED_URL) return process.env.BURN_FEED_URL;
  const spend = process.env.SPEND_FEED_URL;
  if (spend?.endsWith("/spend.json")) return spend.replace(/spend\.json$/, "burn.json");
  return null;
}

/**
 * One cache entry feeds both /api/budget and /api/burn, so the homepage gauge
 * and the burn page always agree on the same ledger snapshot.
 */
export const getBurnDetail = unstable_cache(
  async (): Promise<BurnDetail | null> => {
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

/** Same token math as scripts/push-burn.mjs, derived from the shared snapshot. */
export function detailToSpend(detail: BurnDetail | null): Spend | null {
  if (!detail || typeof detail.totals?.total !== "number") return null;
  const usage = (detail.byModel ?? []).reduce(
    (acc, m) => ({
      input: acc.input + (m.usage?.input ?? 0) + (m.usage?.cacheRead ?? 0),
      output: acc.output + (m.usage?.output ?? 0) + (m.usage?.reasoning ?? 0),
    }),
    { input: 0, output: 0 },
  );
  return {
    spentUsd: Math.round(detail.totals.total * 100) / 100,
    inputTokens: usage.input,
    outputTokens: usage.output,
    generations: detail.turns ?? 0,
  };
}
