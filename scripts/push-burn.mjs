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
const root = process.env.BURN_PROJECT;
const home = process.env.HOME ?? "";

function relativize(p) {
  if (root && p.startsWith(`${root}/`)) return p.slice(root.length + 1);
  if (home && p.startsWith(`${home}/`)) return `~/${p.slice(home.length + 1)}`;
  return p;
}

// sessionId -> "model (+model)" labels
const sessionModels = new Map();
try {
  const sargs = ["sessions", "list", "--json", "--since", "30d", "--limit", "200"];
  if (root) sargs.push("--project", root);
  const sessions = JSON.parse(
    execFileSync("burn", sargs, { maxBuffer: 16 * 1024 * 1024, encoding: "utf8" }),
  );
  for (const s of Array.isArray(sessions) ? sessions : sessions.sessions ?? []) {
    sessionModels.set(s.sessionId, (s.models ?? []).join(" + "));
  }
} catch (err) {
  console.error("sessions list skipped:", err.message);
}

let hotspots = {};
try {
  const hargs = ["hotspots", "--json"];
  if (root) hargs.push("--project", root);
  if (process.env.BURN_SINCE) hargs.push("--since", process.env.BURN_SINCE);
  const h = JSON.parse(
    execFileSync("burn", hargs, { maxBuffer: 16 * 1024 * 1024, encoding: "utf8" }),
  );

  const topSessions = (h.sessions ?? [])
    .slice()
    .sort((a, b) => (b.grandCost ?? 0) - (a.grandCost ?? 0))
    .slice(0, 12);

  // which models touched which files: per-session hotspots, joined on the
  // session's model from `burn sessions list`
  const fileModels = new Map(); // relative path -> Set<model>
  for (const s of topSessions) {
    const model = sessionModels.get(s.sessionId);
    if (!model) continue;
    try {
      const sh = JSON.parse(
        execFileSync(
          "burn",
          ["hotspots", "--json", "--session", s.sessionId, ...(root ? ["--project", root] : [])],
          { maxBuffer: 16 * 1024 * 1024, encoding: "utf8" },
        ),
      );
      for (const f of sh.files ?? []) {
        const p = relativize(f.path);
        if (!fileModels.has(p)) fileModels.set(p, new Set());
        fileModels.get(p).add(model);
      }
    } catch {
      // per-session attribution is best-effort
    }
  }

  hotspots = {
    files: (h.files ?? [])
      .slice()
      .sort((a, b) => (b.totalCost ?? 0) - (a.totalCost ?? 0))
      .slice(0, 15)
      .map((f) => {
        const p = relativize(f.path);
        return {
          path: p,
          totalCost: f.totalCost,
          toolCallCount: f.toolCallCount,
          models: [...(fileModels.get(p) ?? [])].sort(),
        };
      }),
    sessions: topSessions.slice(0, 8).map((s) => ({
      sessionId: s.sessionId,
      label: sessionModels.get(s.sessionId) || "session",
      grandCost: s.grandCost,
    })),
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
