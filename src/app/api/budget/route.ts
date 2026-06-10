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

const ZERO_SPEND: Spend = { spentUsd: 0, inputTokens: 0, outputTokens: 0, generations: 0 };

const getSpend = unstable_cache(async () => fetchSpend(), ["posthog-spend"], {
  revalidate: 60,
});

export async function GET() {
  const goalUsd = envNumber("FUNDING_GOAL_USD", 500000);
  const raisedUsd = envNumber("FUNDING_RAISED_USD", 0);

  let spend = ZERO_SPEND;
  if (process.env.POSTHOG_API_KEY) {
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
