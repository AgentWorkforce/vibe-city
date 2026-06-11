#!/usr/bin/env node
// Pushes the local burn ledger to a GitHub Gist the site reads from.
// Run from cron on the machine where the workers run (every 5 min):
//
//   star-slash-5 in crontab:  cd /path/to/vibe-city && node scripts/push-burn.mjs
//
/**
 * Env (or edit the defaults below):
 *   BURN_GIST_ID   gist to update (required)
 *   BURN_PROJECT   optional `burn --project` filter (the game repo path)
 *   BURN_SINCE     optional `burn --since` window (default: all-time)
 *
 * The site reads the gist via SPEND_FEED_URL (the gist's raw URL).
 */
import { execFileSync } from "node:child_process";

const GIST_ID = process.env.BURN_GIST_ID;
if (!GIST_ID) {
  console.error("BURN_GIST_ID is required");
  process.exit(1);
}

const args = ["summary", "--json"];
if (process.env.BURN_PROJECT) args.push("--project", process.env.BURN_PROJECT);
if (process.env.BURN_SINCE) args.push("--since", process.env.BURN_SINCE);

const data = JSON.parse(
  execFileSync("burn", args, { maxBuffer: 16 * 1024 * 1024, encoding: "utf8" }),
);
const usage = (data.byModel ?? []).reduce(
  (acc, m) => ({
    input: acc.input + (m.usage?.input ?? 0) + (m.usage?.cacheRead ?? 0),
    output: acc.output + (m.usage?.output ?? 0) + (m.usage?.reasoning ?? 0),
  }),
  { input: 0, output: 0 },
);
const payload = {
  spentUsd: Math.round((data.totalCost?.total ?? 0) * 100) / 100,
  inputTokens: usage.input,
  outputTokens: usage.output,
  generations: data.turns ?? 0,
  updatedAt: new Date().toISOString(),
};

// full breakdown for the /burn page
let hotspots = {};
try {
  const hargs = ["hotspots", "--json"];
  if (process.env.BURN_PROJECT) hargs.push("--project", process.env.BURN_PROJECT);
  if (process.env.BURN_SINCE) hargs.push("--since", process.env.BURN_SINCE);
  const h = JSON.parse(
    execFileSync("burn", hargs, { maxBuffer: 16 * 1024 * 1024, encoding: "utf8" }),
  );
  hotspots = {
    files: (h.files ?? [])
      .slice()
      .sort((a, b) => (b.totalCost ?? 0) - (a.totalCost ?? 0))
      .slice(0, 15)
      .map((f) => ({ path: f.path, totalCost: f.totalCost, toolCallCount: f.toolCallCount })),
    sessions: (h.sessions ?? [])
      .slice()
      .sort((a, b) => (b.grandCost ?? 0) - (a.grandCost ?? 0))
      .slice(0, 8)
      .map((s) => ({ sessionId: s.sessionId, grandCost: s.grandCost })),
  };
} catch (err) {
  console.error("hotspots skipped:", err.message);
}

const detail = {
  updatedAt: payload.updatedAt,
  turns: data.turns ?? 0,
  totals: data.totalCost ?? {},
  byModel: (data.byModel ?? []).map((m) => ({
    model: m.model,
    turns: m.turns,
    usage: m.usage,
    cost: m.cost,
  })),
  hotspots,
};

execFileSync(
  "gh",
  [
    "api",
    "-X",
    "PATCH",
    `gists/${GIST_ID}`,
    "-f",
    `files[spend.json][content]=${JSON.stringify(payload, null, 2)}`,
    "-f",
    `files[burn.json][content]=${JSON.stringify(detail, null, 2)}`,
  ],
  { stdio: ["ignore", "ignore", "inherit"] },
);
console.log(`pushed ${payload.updatedAt}: $${payload.spentUsd}, ${payload.generations} turns`);
