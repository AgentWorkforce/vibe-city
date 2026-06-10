"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import type { AgentStatus, EventChipData, FeedResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const MAX_CHIPS = 20;

export function useFeed() {
  const prev = useRef<Map<string, AgentStatus> | null>(null);
  const [chips, setChips] = useState<EventChipData[]>([]);

  const { data } = useSWR<FeedResponse>("/api/feed", fetcher, {
    refreshInterval: 4000,
    keepPreviousData: true,
    onSuccess: (next) => {
      const seen = prev.current;
      const fresh: EventChipData[] = [];
      for (const agent of next.agents) {
        const was = seen?.get(agent.name);
        if (seen && !was && agent.status !== "offline") {
          fresh.push({ kind: "spawn", agent: agent.name, to: agent.status, at: next.generatedAt });
        } else if (was && was !== agent.status) {
          fresh.push({
            kind: "status",
            agent: agent.name,
            from: was,
            to: agent.status,
            at: next.generatedAt,
          });
        }
      }
      prev.current = new Map(next.agents.map((a) => [a.name, a.status]));
      if (fresh.length) setChips((c) => [...c, ...fresh].slice(-MAX_CHIPS));
    },
  });

  return { feed: data, chips };
}
