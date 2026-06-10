import { unstable_cache } from "next/cache";
import { fetchSpend, type Spend } from "@/lib/posthog";
import type { BudgetResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

function envNumber(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && process.env[name] !== "" && process.env[name] !== undefined
    ? value
    : fallback;
}

const getSpend = unstable_cache(async () => fetchSpend(), ["posthog-spend"], {
  revalidate: 60,
});

export async function GET() {
  const goalUsd = envNumber("FUNDING_GOAL_USD", 50000);
  const raisedUsd = envNumber("FUNDING_RAISED_USD", 0);

  let spend: Spend | undefined;
  if (process.env.POSTHOG_API_KEY) {
    try {
      spend = await getSpend();
    } catch {
      // fall through to demo numbers
    }
  }

  const demoTokens = envNumber("DEMO_SPENT_TOKENS", 48_200_000);
  const body: BudgetResponse = spend
    ? { mode: "live", raisedUsd, goalUsd, ...spend }
    : {
        mode: "demo",
        raisedUsd,
        goalUsd,
        spentUsd: envNumber("DEMO_SPENT_USD", 137.42),
        inputTokens: Math.round(demoTokens * 0.8),
        outputTokens: Math.round(demoTokens * 0.2),
        generations: 1280,
      };

  return Response.json(body, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
