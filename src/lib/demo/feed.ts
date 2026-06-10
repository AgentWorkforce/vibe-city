import type {
  CrewAgent,
  FeedMessage,
  FeedResponse,
  ObserverResponse,
} from "../types";
import { LOOP_MS, SCRIPT, STATUS_TRACKS } from "./script";

const CHANNEL_TOPICS: Record<string, string> = {
  build: "The main line — world gen, traffic, physics",
  qa: "Regressions, repros, and receipts",
  missions: "Beats, barks, and double-crosses",
};

// Stateless looping clock: every serverless instance computes the same feed for
// the same wall-clock time, so demo mode needs no coordination or storage.
export function demoFeed(nowMs: number): FeedResponse {
  const t = nowMs % LOOP_MS;
  const loopStart = nowMs - t;

  const messages: FeedMessage[] = SCRIPT.filter((e) => e.atMs <= t)
    .slice(-30)
    .map((e) => ({
      id: `demo-${e.atMs}`,
      agent: e.agent,
      channel: e.channel,
      text: e.text,
      createdAt: new Date(loopStart + e.atMs).toISOString(),
      mentions: e.mentions ?? [],
      reactions: e.reactions ?? [],
      replyCount: e.replyCount ?? 0,
    }));

  const agents: CrewAgent[] = STATUS_TRACKS.map((track) => {
    const current = track.intervals.reduce(
      (acc, i) => (i.fromMs <= t ? i : acc),
      track.intervals[0],
    );
    return {
      name: track.name,
      role: track.role,
      status: current.status,
      currentAction: current.currentAction,
      lastSeen: new Date(loopStart + t).toISOString(),
    };
  });

  return {
    mode: "demo",
    messages,
    agents,
    generatedAt: new Date(nowMs).toISOString(),
  };
}

export function demoObserver(nowMs: number): ObserverResponse {
  const base = demoFeed(nowMs);
  const t = nowMs % LOOP_MS;
  const loopStart = nowMs - t;
  // observer shows everything emitted so far this loop, across all channels
  const messages: FeedMessage[] = SCRIPT.filter((e) => e.atMs <= t).map((e) => ({
    id: `demo-${e.atMs}`,
    agent: e.agent,
    channel: e.channel,
    text: e.text,
    createdAt: new Date(loopStart + e.atMs).toISOString(),
    mentions: e.mentions ?? [],
    reactions: e.reactions ?? [],
    replyCount: e.replyCount ?? 0,
  }));
  const channels = [...new Set(SCRIPT.map((e) => e.channel))].map((name) => ({
    name,
    topic: CHANNEL_TOPICS[name],
    messageCount: messages.filter((m) => m.channel === name).length,
  }));
  return { ...base, channels, messages };
}
