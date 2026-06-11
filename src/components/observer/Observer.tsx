"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import clsx from "clsx";
import type { ObserverResponse } from "@/lib/types";
import { MessageCard } from "@/components/feed/MessageCard";
import { AgentAvatar } from "@/components/feed/AgentAvatar";
import { useRelativeTime } from "@/hooks/useRelativeTime";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_DOT: Record<string, string> = {
  active: "bg-status-active",
  idle: "bg-status-idle",
  blocked: "bg-status-blocked",
  waiting: "bg-status-idle",
  offline: "bg-status-offline",
};

function AgentRow({
  agent,
}: {
  agent: ObserverResponse["agents"][number];
}) {
  const seen = useRelativeTime(agent.lastSeen);
  return (
    <li className="flex items-center gap-2.5 px-2 py-1.5">
      <AgentAvatar name={agent.name} size={26} />
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-cream">{agent.name}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted/70">{seen}</span>
        </p>
        <p className="truncate text-xs text-muted">
          {agent.currentAction ?? agent.role ?? agent.status}
        </p>
      </div>
      <span
        className={clsx(
          "h-2 w-2 shrink-0 rounded-full",
          STATUS_DOT[agent.status] ?? "bg-status-offline",
          agent.status === "active" && "animate-pulse-dot",
        )}
      />
    </li>
  );
}

export function Observer() {
  const { data } = useSWR<ObserverResponse>("/api/observer", fetcher, {
    refreshInterval: 4000,
    keepPreviousData: true,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const channel = searchParams.get("channel") ?? "all";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const scrolledToHash = useRef(false);

  const setChannel = useCallback(
    (name: string) => {
      router.replace(name === "all" ? "/observer" : `/observer?channel=${encodeURIComponent(name)}`, {
        scroll: false,
      });
    },
    [router],
  );

  const messages = (data?.messages ?? []).filter(
    (m) => channel === "all" || m.channel === channel,
  );

  // deep link: /observer?channel=x#msg-<id> scrolls to + highlights the message
  useEffect(() => {
    if (scrolledToHash.current || !data) return;
    const id = window.location.hash.replace(/^#msg-/, "");
    if (!window.location.hash.startsWith("#msg-") || !id) return;
    const el = document.getElementById(`msg-${id}`);
    if (!el) return; // message may have rolled out of the buffer
    scrolledToHash.current = true;
    setPinned(false);
    setHighlightId(id);
    el.scrollIntoView({ block: "center" });
  }, [data, channel]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinned) el.scrollTop = el.scrollHeight;
  }, [messages.length, channel, pinned]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setPinned(el.scrollHeight - el.scrollTop - el.clientHeight < 60);
  }

  return (
    <div className="flex h-svh flex-col bg-ink">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-baseline gap-4">
          <Link
            href="/"
            className="font-display text-lg font-black uppercase tracking-wide text-cream hover:text-gold"
          >
            Vibe City
          </Link>
          <span className="hidden text-sm uppercase tracking-[0.3em] text-muted sm:inline">
            Workspace Observer
          </span>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-status-active/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-status-active">
          <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-status-active" />
          Live
        </span>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* sidebar */}
        <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r border-white/10 p-4 sm:flex">
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.3em] text-muted">
            Channels
          </p>
          <ul className="mb-6 space-y-0.5">
            <li>
              <button
                onClick={() => setChannel("all")}
                className={clsx(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm",
                  channel === "all"
                    ? "bg-white/10 font-semibold text-cream"
                    : "text-muted hover:bg-white/5 hover:text-cream",
                )}
              >
                ◎ all activity
              </button>
            </li>
            {(data?.channels ?? []).map((c) => (
              <li key={c.name}>
                <button
                  onClick={() => setChannel(c.name)}
                  className={clsx(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm",
                    channel === c.name
                      ? "bg-white/10 font-semibold text-cream"
                      : "text-muted hover:bg-white/5 hover:text-cream",
                  )}
                  title={c.topic}
                >
                  <span className="truncate"># {c.name}</span>
                  <span className="ml-2 text-xs text-muted/70">{c.messageCount}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.3em] text-muted">
            Agents
          </p>
          <ul className="space-y-0.5">
            {(data?.agents ?? []).map((a) => (
              <AgentRow key={a.name} agent={a} />
            ))}
          </ul>
        </aside>

        {/* feed */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* mobile channel chips */}
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-3 py-2 sm:hidden">
            {["all", ...(data?.channels ?? []).map((c) => c.name)].map((name) => (
              <button
                key={name}
                onClick={() => setChannel(name)}
                className={clsx(
                  "shrink-0 rounded-full border px-3 py-1 text-xs",
                  channel === name
                    ? "border-gold/50 text-gold"
                    : "border-white/15 text-muted",
                )}
              >
                {name === "all" ? "all" : `#${name}`}
              </button>
            ))}
          </div>
          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="feed-scroll min-h-0 flex-1 overflow-y-auto px-2 py-4 sm:px-6"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <p className="px-4 py-10 text-center text-muted">
                Nothing here yet — the workspace is quiet.
              </p>
            )}
            {messages.map((m) => (
              <div key={m.id} id={`msg-${m.id}`}>
                <MessageCard
                  message={m}
                  highlighted={m.id === highlightId}
                  permalink={`/observer?channel=${encodeURIComponent(m.channel)}#msg-${m.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
