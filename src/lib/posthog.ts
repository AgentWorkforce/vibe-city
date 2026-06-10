import "server-only";

const HOGQL = `SELECT
  coalesce(round(sum(toFloat(properties.$ai_total_cost_usd)), 2), 0) AS spent_usd,
  coalesce(sum(toInt(properties.$ai_input_tokens)), 0)               AS input_tokens,
  coalesce(sum(toInt(properties.$ai_output_tokens)), 0)              AS output_tokens,
  count()                                                            AS generations
FROM events WHERE event = '$ai_generation'`;

export type Spend = {
  spentUsd: number;
  inputTokens: number;
  outputTokens: number;
  generations: number;
};

export async function fetchSpend(): Promise<Spend> {
  const host = process.env.POSTHOG_HOST ?? "https://us.posthog.com";
  const projectId = process.env.POSTHOG_PROJECT_ID;
  const res = await fetch(`${host}/api/projects/${projectId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.POSTHOG_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query: HOGQL } }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`posthog query failed: ${res.status}`);
  const json = await res.json();
  const [row = []] = json.results ?? [];
  const [spentUsd, inputTokens, outputTokens, generations] = row;
  return {
    spentUsd: Number(spentUsd) || 0,
    inputTokens: Number(inputTokens) || 0,
    outputTokens: Number(outputTokens) || 0,
    generations: Number(generations) || 0,
  };
}
