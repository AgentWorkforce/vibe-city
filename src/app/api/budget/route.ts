import { unstable_cache } from "next/cache";
import { fromBridge } from "@/lib/bridge";
import { fetchSpend, type Spend } from "@/lib/posthog";
import { fetchRaised } from "@/lib/stripe";
import type { BudgetResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

function envNumber(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && process.env[name] !== "" && process.env[name] !== undefined
    ? value
    : fallback;
}

const ZERO_SPEND: Spend = { spentUsd: 0, inputTokens: 0, outputTokens: 0, generations: 0 };

const getSpend = unstable_cache(async () => fetchSpend(), ["posthog-spend"], {
  revalidate: 60,
});

const getRaised = unstable_cache(async () => fetchRaised(), ["stripe-raised"], {
  revalidate: 60,
});

const getBridgeSpend = unstable_cache(
  async () => fromBridge<Spend>("/spend"),
  ["bridge-spend"],
  { revalidate: 60 },
);

// SPEND_FEED_URL: any URL serving the push-burn.mjs JSON shape (e.g. a gist raw URL)
const getFeedSpend = unstable_cache(
  async (): Promise<Spend | null> => {
    try {
      const res = await fetch(process.env.SPEND_FEED_URL!, {
        signal: AbortSignal.timeout(4000),
      });
      if (!res.ok) return null;
      const data = await res.json();
      if (typeof data.spentUsd !== "number") return null;
      return {
        spentUsd: data.spentUsd,
        inputTokens: Number(data.inputTokens) || 0,
        outputTokens: Number(data.outputTokens) || 0,
        generations: Number(data.generations) || 0,
      };
    } catch (err) {
      console.error("feed-spend fetch failed:", err);
      return null;
    }
  },
  ["feed-spend"],
  { revalidate: 60 },
);

export async function GET() {
  const goalUsd = envNumber("FUNDING_GOAL_USD", 500000);

  // baseline (pre-Stripe pledges) + live Stripe purchases on top
  let raisedUsd = envNumber("FUNDING_RAISED_USD", 33_475);
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      raisedUsd += await getRaised();
    } catch {
      // stripe unreachable: show the baseline rather than break the gauge
    }
  }

  // spend: bridge -> pushed burn feed (gist) -> PostHog -> zero
  let spend = ZERO_SPEND;
  if (process.env.BRIDGE_URL) {
    spend = (await getBridgeSpend()) ?? ZERO_SPEND;
  }
  if (spend === ZERO_SPEND && process.env.SPEND_FEED_URL) {
    spend = (await getFeedSpend()) ?? ZERO_SPEND;
  }
  if (spend === ZERO_SPEND && process.env.POSTHOG_API_KEY) {
    try {
      spend = await getSpend();
    } catch {
      // metering unreachable: report zero rather than break the gauge
    }
  }

  const body: BudgetResponse = { raisedUsd, goalUsd, ...spend };
  return Response.json(body, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
