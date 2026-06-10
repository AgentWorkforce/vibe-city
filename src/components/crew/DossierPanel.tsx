"use client";

import clsx from "clsx";
import type { CrewAgent } from "@/lib/types";
import { crewProfile } from "@/lib/crew";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { RobotPortrait } from "./RobotPortrait";

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

// Pastel scene palettes, cycled per panel like alternating key-art spreads.
const SCENES = [
  "linear-gradient(170deg, #7d8df0 0%, #b3a5ef 45%, #efc8da 78%, #fdf0d5 100%)",
  "linear-gradient(190deg, #b3a5ef 0%, #efc8da 50%, #fdf0d5 85%, #9fdede 100%)",
  "linear-gradient(165deg, #6f80e8 0%, #a08fe0 40%, #f6cfd8 80%, #ffe9b8 100%)",
];

function MiniSkyline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 800 120"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-x-0 bottom-0 h-24 w-full opacity-60"
    >
      <g>
        {[
          [0, 50, 52, 70], [60, 30, 40, 90], [110, 58, 46, 62], [170, 22, 34, 98],
          [220, 46, 56, 74], [290, 34, 42, 86], [350, 56, 50, 64], [420, 18, 38, 102],
          [470, 44, 54, 76], [540, 30, 44, 90], [600, 52, 48, 68], [660, 26, 36, 94],
          [710, 48, 60, 72], [780, 36, 40, 84],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="#8f7fd4" />
            <rect x={x} y={y} width={Math.max(6, w * 0.25)} height={h} fill="#ffd9c2" opacity="0.45" />
            <rect x={x} y={y} width={w} height={4} fill="#ffe2c4" opacity="0.6" />
          </g>
        ))}
      </g>
      <rect y="104" width="800" height="16" fill="#67b9c9" opacity="0.85" />
      <rect y="104" width="800" height="4" fill="#ffe9b8" opacity="0.5" />
    </svg>
  );
}

export function DossierPanel({ agent, index }: { agent: CrewAgent; index: number }) {
  const lastSeen = useRelativeTime(agent.lastSeen);
  const profile = crewProfile(agent.name, agent.role);
  const offline = agent.status === "offline";
  const flipped = index % 2 === 1;

  return (
    <article
      className={clsx(
        "relative overflow-hidden rounded-3xl ring-1 ring-white/10 transition-all",
        offline && "opacity-75 saturate-[0.55]",
      )}
      style={{ background: SCENES[index % SCENES.length] }}
    >
      <MiniSkyline />
      {/* warm sun pocket + pink wash for the painted-light feel */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 70% 78%, rgba(255,217,160,0.9), transparent 70%), radial-gradient(ellipse 60% 60% at 25% 20%, rgba(255,154,210,0.55), transparent 70%)",
        }}
      />
      {/* indigo scrim behind the text column so cream type reads on pastel art */}
      <div
        aria-hidden
        className={clsx(
          "absolute inset-0 bg-[linear-gradient(180deg,rgba(40,32,84,0.85)_0%,rgba(40,32,84,0.55)_55%,transparent_82%)]",
          flipped
            ? "sm:bg-[linear-gradient(270deg,rgba(40,32,84,0.82)_0%,rgba(40,32,84,0.55)_42%,transparent_68%)]"
            : "sm:bg-[linear-gradient(90deg,rgba(40,32,84,0.82)_0%,rgba(40,32,84,0.55)_42%,transparent_68%)]",
        )}
      />

      <div
        className={clsx(
          "relative grid min-h-[24rem] gap-4 p-7 sm:p-10",
          "sm:grid-cols-[3fr_2fr]",
          flipped && "sm:[direction:rtl]",
        )}
      >
        <div className="sm:[direction:ltr] flex flex-col justify-center">
          <h3 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-wide text-cream drop-shadow-[0_2px_8px_rgba(40,32,84,0.6)] sm:text-6xl">
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
          <div className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-ink/55 px-4 py-2 text-sm text-cream backdrop-blur-sm">
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

        <div className="sm:[direction:ltr] relative mx-auto h-64 w-full max-w-[18rem] self-end sm:h-80">
          <RobotPortrait variant={profile.variant} />
        </div>
      </div>
    </article>
  );
}
