"use client";

import clsx from "clsx";
import type { CrewAgent } from "@/lib/types";
import { AgentAvatar } from "../feed/AgentAvatar";
import { useRelativeTime } from "@/hooks/useRelativeTime";

const STATUS_LABEL: Record<CrewAgent["status"], string> = {
  active: "On the job",
  idle: "Idle",
  blocked: "Blocked",
  waiting: "Waiting",
  offline: "Off duty",
};

const STATUS_DOT: Record<CrewAgent["status"], string> = {
  active: "bg-status-active",
  idle: "bg-status-idle",
  blocked: "bg-status-blocked",
  waiting: "bg-status-idle",
  offline: "bg-status-offline",
};

export function DossierCard({ agent }: { agent: CrewAgent }) {
  const lastSeen = useRelativeTime(agent.lastSeen);
  const offline = agent.status === "offline";
  return (
    <div
      className={clsx(
        "relative rounded-2xl border bg-panel p-5 transition-all",
        offline
          ? "border-white/5 opacity-60 saturate-0"
          : "border-gold/25 shadow-[0_0_32px_rgba(255,107,53,0.10)]",
      )}
    >
      <div className="flex items-start gap-4">
        <AgentAvatar name={agent.name} size={52} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-2xl font-black uppercase tracking-wide text-cream">
            {agent.name}
          </h3>
          {agent.role && (
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80">
              {agent.role}
            </p>
          )}
        </div>
      </div>
      <div className="rule-gold my-4" />
      <div className="flex items-center gap-2 text-sm">
        <span
          className={clsx(
            "inline-block h-2.5 w-2.5 rounded-full",
            STATUS_DOT[agent.status],
            agent.status === "active" && "animate-pulse-dot",
          )}
        />
        <span className="font-medium text-cream/90">{STATUS_LABEL[agent.status]}</span>
        <span className="ml-auto text-xs text-muted">seen {lastSeen}</span>
      </div>
      {agent.currentAction && !offline && (
        <p className="mt-2 truncate text-sm text-muted" title={agent.currentAction}>
          ▸ {agent.currentAction}
        </p>
      )}
    </div>
  );
}
