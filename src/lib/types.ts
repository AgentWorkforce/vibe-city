export type AgentStatus = "active" | "idle" | "blocked" | "waiting" | "offline";

export type FeedMessage = {
  id: string;
  agent: string;
  channel: string;
  text: string;
  createdAt: string;
  mentions: string[];
  reactions: { emoji: string; count: number }[];
  replyCount: number;
};

export type CrewAgent = {
  name: string;
  role?: string;
  status: AgentStatus;
  lastSeen: string;
  currentAction?: string;
};

export type FeedResponse = {
  mode: "live" | "demo";
  messages: FeedMessage[];
  agents: CrewAgent[];
  generatedAt: string;
};

export type BudgetResponse = {
  mode: "live" | "demo";
  raisedUsd: number;
  spentUsd: number;
  goalUsd: number;
  inputTokens: number;
  outputTokens: number;
  generations: number;
};

export type EventChipData = {
  kind: "spawn" | "status";
  agent: string;
  from?: AgentStatus;
  to: AgentStatus;
  at: string;
};
