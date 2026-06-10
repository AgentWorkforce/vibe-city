"use client";

import clsx from "clsx";
import type { CrewAgent } from "@/lib/types";
import { crewProfile } from "@/lib/crew";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { RobotPortrait } from "./RobotPortrait";
import { ArtImage } from "../ArtImage";

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

// Vector fallback while the generated key art for a panel is missing.
function FallbackScene({ variant }: { variant: Parameters<typeof RobotPortrait>[0]["variant"] }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(170deg, #7d8df0 0%, #b3a5ef 45%, #efc8da 78%, #fdf0d5 100%)",
      }}
    >
      <div className="absolute bottom-0 right-8 h-[85%] w-[40%] max-w-[22rem]">
        <RobotPortrait variant={variant} />
      </div>
    </div>
  );
}

export function DossierPanel({ agent }: { agent: CrewAgent }) {
  const lastSeen = useRelativeTime(agent.lastSeen);
  const profile = crewProfile(agent.name, agent.role);
  const offline = agent.status === "offline";

  return (
    <article
      className={clsx(
        "relative overflow-hidden rounded-lg ring-1 ring-white/10",
        offline && "opacity-80 saturate-[0.6]",
      )}
    >
      <ArtImage
        src={`/art/dossier-${profile.variant}.jpg`}
        className="absolute inset-0"
        fallback={<FallbackScene variant={profile.variant} />}
      />
      {/* scrims: left column for text, bottom for the status strip */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,26,0.78)_0%,rgba(10,8,26,0.45)_55%,rgba(10,8,26,0.2)_100%)] sm:bg-[linear-gradient(90deg,rgba(10,8,26,0.85)_0%,rgba(10,8,26,0.55)_40%,transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(5,5,5,0.7))]"
      />

      <div className="relative flex min-h-[26rem] flex-col justify-between p-7 sm:min-h-[30rem] sm:p-12">
        <div className="max-w-xl">
          <h3 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-wide text-cream sm:text-7xl">
            {agent.name}
          </h3>
          <p className="mt-4 max-w-md text-2xl font-semibold leading-tight text-[#46d8e8] sm:text-3xl">
            {profile.tagline}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/90 sm:text-base">
            {profile.bio}
          </p>
          {agent.role && (
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-cream/60">
              {agent.role}
            </p>
          )}
        </div>

        <div className="mt-6 inline-flex w-fit flex-wrap items-center gap-2 rounded-full bg-ink/60 px-4 py-2 text-sm text-cream backdrop-blur-sm">
          <span
            className={clsx(
              "inline-block h-2.5 w-2.5 rounded-full",
              STATUS_DOT[agent.status],
              agent.status === "active" && "animate-pulse-dot",
            )}
          />
          <span className="font-medium">{STATUS_LABEL[agent.status]}</span>
          {agent.currentAction && !offline && (
            <span className="text-cream/70">· {agent.currentAction}</span>
          )}
          <span className="text-cream/50">· seen {lastSeen}</span>
        </div>
      </div>
    </article>
  );
}
