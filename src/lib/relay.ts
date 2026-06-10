import "server-only";
import { AgentRelay } from "@agent-relay/sdk";
import type {
  RelayAgent,
  RelayMessage,
} from "@agent-relay/sdk";
import type { AgentStatus, CrewAgent, FeedMessage, FeedResponse } from "./types";

let client: AgentRelay | undefined;

export function relay(): AgentRelay {
  return (client ??= new AgentRelay({
    workspaceKey: process.env.RELAY_WORKSPACE_KEY!,
    ...(process.env.RELAY_BASE_URL ? { baseUrl: process.env.RELAY_BASE_URL } : {}),
  }));
}

const STATUSES: AgentStatus[] = ["active", "idle", "blocked", "waiting", "offline"];

function toStatus(status: string | undefined): AgentStatus {
  // The workspace reports richer statuses than presence; anything unknown
  // (e.g. "online") is treated as active so the roster errs lively.
  if (STATUSES.includes(status as AgentStatus)) return status as AgentStatus;
  if (status === "online") return "active";
  return "offline";
}

export function toFeedResponse(
  channel: string,
  messages: RelayMessage[],
  agents: RelayAgent[],
): FeedResponse {
  const feedMessages: FeedMessage[] = messages
    .map((m) => ({
      id: m.id,
      agent: m.from?.name ?? "unknown",
      channel: m.channel?.name ?? channel,
      text: m.text,
      createdAt: m.createdAt ?? new Date().toISOString(),
      mentions: m.mentions ?? [],
      reactions: (m.reactions ?? []).map((r) => ({ emoji: r.emoji, count: r.count })),
      replyCount: m.replyCount ?? 0,
    }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const crew: CrewAgent[] = agents
    .filter((a) => a.type !== "system")
    .map((a) => ({
      name: a.name,
      role:
        a.persona ??
        (typeof a.metadata?.role === "string" ? a.metadata.role : undefined),
      status: toStatus(a.status),
      lastSeen: a.lastSeenAt ?? new Date().toISOString(),
    }));

  return {
    messages: feedMessages,
    agents: crew,
    generatedAt: new Date().toISOString(),
  };
}
