/**
 * Always-on workspace bridge. Runs next to the workers (anywhere with the
 * workspace key + burn's ledger), holds one realtime event stream to Agent
 * Relay, and serves the site's wire shapes over HTTP:
 *
 *   GET /feed      -> FeedResponse        (latest messages + agent roster)
 *   GET /observer  -> ObserverResponse    (channels + agents + all messages)
 *   GET /spend     -> { spentUsd, inputTokens, outputTokens, generations }
 *   GET /healthz   -> { ok, agents, messages, connected }
 *
 * Env: RELAY_WORKSPACE_KEY (required), RELAY_BASE_URL, PORT (8390),
 *      BRIDGE_TOKEN (optional bearer auth), BURN_PROJECT (path filter),
 *      BURN_SINCE (e.g. "30d"; default all-time).
 *
 * Run: npm run bridge   (or: node bridge/server.mjs)
 */
import http from "node:http";
import { execFile } from "node:child_process";
import { AgentRelay } from "@agent-relay/sdk";

const KEY = process.env.RELAY_WORKSPACE_KEY;
if (!KEY) {
  console.error("RELAY_WORKSPACE_KEY is required");
  process.exit(1);
}
const PORT = Number(process.env.PORT) || 8390;
const MAX_MESSAGES = 400;
const OFFLINE_AFTER_MS = 30 * 60 * 1000;
const WORK_STATUSES = new Set(["active", "idle", "blocked", "waiting"]);

const relay = new AgentRelay({
  workspaceKey: KEY,
  ...(process.env.RELAY_BASE_URL ? { baseUrl: process.env.RELAY_BASE_URL } : {}),
});

// ── state ─────────────────────────────────────────────────────────────────────
const agents = new Map(); // name -> CrewAgent
const agentNamesById = new Map();
const channels = new Map(); // name -> { name, topic }
let messages = []; // FeedMessage[], oldest first
let connected = false;
let spend = { spentUsd: 0, inputTokens: 0, outputTokens: 0, generations: 0 };

function toStatus(status, lastSeenAt) {
  if (WORK_STATUSES.has(status)) return status;
  if (status === "online") return "active";
  if (lastSeenAt && Date.now() - new Date(lastSeenAt).getTime() > OFFLINE_AFTER_MS) {
    return "offline";
  }
  return "active";
}

function mapMessage(m, channelName) {
  return {
    id: m.id ?? m.messageId,
    agent: m.from?.name ?? "unknown",
    channel: m.channel?.name ?? channelName ?? "",
    text: m.text ?? "",
    createdAt: m.createdAt ?? new Date().toISOString(),
    mentions: m.mentions ?? [],
    reactions: (m.reactions ?? []).map((r) => ({ emoji: r.emoji, count: r.count })),
    replyCount: m.replyCount ?? 0,
  };
}

function pushMessage(msg) {
  if (!msg.id || messages.some((m) => m.id === msg.id)) return;
  messages.push(msg);
  messages.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
  // a message is also a liveness signal
  const a = agents.get(msg.agent);
  if (a) {
    a.lastSeen = msg.createdAt;
    if (a.status === "offline") a.status = "active";
  }
}

// ── seeding + refresh over REST ───────────────────────────────────────────────
async function refreshAgents() {
  const list = await relay.agents.list();
  for (const a of list) {
    if (a.type === "system") continue;
    agentNamesById.set(a.id, a.name);
    const existing = agents.get(a.name);
    agents.set(a.name, {
      name: a.name,
      role:
        a.persona ?? (typeof a.metadata?.role === "string" ? a.metadata.role : undefined),
      // realtime status (set via events) wins over polled presence
      status: existing?.fromEvent ? existing.status : toStatus(a.status, a.lastSeenAt),
      fromEvent: existing?.fromEvent ?? false,
      lastSeen: a.lastSeenAt ?? existing?.lastSeen ?? new Date().toISOString(),
      currentAction: existing?.currentAction,
    });
  }
}

async function refreshChannels() {
  const list = await relay.channels.list();
  for (const c of list) {
    if (!c.archived) channels.set(c.name, { name: c.name, topic: c.topic });
  }
}

async function seedMessages() {
  for (const c of channels.values()) {
    try {
      const batch = await relay.messages.list(c.name, { limit: 30 });
      for (const m of batch) pushMessage(mapMessage(m, c.name));
    } catch {
      // channel may be empty or restricted; skip
    }
  }
}

// ── realtime events ───────────────────────────────────────────────────────────
relay.addListener("*", (event) => {
  try {
    if (event.type === "message.created" || event.type === "thread.reply") {
      pushMessage(mapMessage(event.message, event.envelope?.channel?.name));
    } else if (event.type?.startsWith("agent.status")) {
      const name = agentNamesById.get(event.agentId);
      if (!name) return;
      const a = agents.get(name);
      if (!a) return;
      const status = event.status ?? event.type.split(".").pop();
      if (WORK_STATUSES.has(status) || status === "offline") {
        a.status = status;
        a.fromEvent = true;
        a.lastSeen = new Date().toISOString();
        if (event.reason) a.currentAction = event.reason;
      }
    }
  } catch (err) {
    console.error("event handling error", err);
  }
});

relay.messaging.events.on("connected", () => {
  connected = true;
  console.log("relay stream connected");
});
relay.messaging.events.on("disconnected", () => {
  connected = false;
  console.log("relay stream disconnected");
});
relay.messaging.events.connect();

// ── burn metering ─────────────────────────────────────────────────────────────
function refreshSpend() {
  const args = ["summary", "--json"];
  if (process.env.BURN_PROJECT) args.push("--project", process.env.BURN_PROJECT);
  if (process.env.BURN_SINCE) args.push("--since", process.env.BURN_SINCE);
  execFile("burn", args, { maxBuffer: 16 * 1024 * 1024 }, (err, stdout) => {
    if (err) {
      console.error("burn summary failed:", err.message);
      return;
    }
    try {
      const data = JSON.parse(stdout);
      const usage = (data.byModel ?? []).reduce(
        (acc, m) => ({
          input: acc.input + (m.usage?.input ?? 0),
          output: acc.output + (m.usage?.output ?? 0),
        }),
        { input: 0, output: 0 },
      );
      spend = {
        spentUsd: Math.round((data.totalCost?.total ?? 0) * 100) / 100,
        inputTokens: usage.input,
        outputTokens: usage.output,
        generations: data.turns ?? 0,
      };
    } catch (parseErr) {
      console.error("burn output parse failed:", parseErr.message);
    }
  });
}

// ── http ──────────────────────────────────────────────────────────────────────
function agentList() {
  return [...agents.values()].map(({ fromEvent: _ignored, ...a }) => a);
}

const server = http.createServer((req, res) => {
  const token = process.env.BRIDGE_TOKEN;
  if (token && req.headers.authorization !== `Bearer ${token}`) {
    res.writeHead(401).end();
    return;
  }
  const url = new URL(req.url ?? "/", "http://bridge");
  const now = new Date().toISOString();
  let body;
  if (url.pathname === "/healthz") {
    body = { ok: true, connected, agents: agents.size, messages: messages.length };
  } else if (url.pathname === "/feed") {
    body = { messages: messages.slice(-30), agents: agentList(), generatedAt: now };
  } else if (url.pathname === "/observer") {
    body = {
      channels: [...channels.values()].map((c) => ({
        ...c,
        messageCount: messages.filter((m) => m.channel === c.name).length,
      })),
      agents: agentList(),
      messages,
      generatedAt: now,
    };
  } else if (url.pathname === "/spend") {
    body = spend;
  } else {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
});

// ── boot ──────────────────────────────────────────────────────────────────────
await refreshChannels().catch((e) => console.error("channels seed failed", e.message));
await refreshAgents().catch((e) => console.error("agents seed failed", e.message));
await seedMessages();
refreshSpend();
setInterval(() => refreshAgents().catch(() => {}), 60_000);
setInterval(() => refreshChannels().catch(() => {}), 120_000);
setInterval(refreshSpend, 60_000);

server.listen(PORT, () => {
  console.log(
    `bridge up on :${PORT} — ${agents.size} agents, ${channels.size} channels, ${messages.length} messages`,
  );
});
