"use client";

import useSWR from "swr";
import { SectionHeading } from "./SectionHeading";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/**
 * Latest gameplay capture, pushed periodically by the agents to the game repo
 * (demo.mp4 in Git LFS). The version key is the LFS oid, so the player reloads
 * automatically when a new build's video lands.
 */
export function GameplayVideo() {
  const { data } = useSWR<{ available: boolean; v?: string }>(
    "/api/video-meta",
    fetcher,
    { refreshInterval: 120_000 },
  );

  if (!data?.available) return null;

  const gameRepo =
    process.env.NEXT_PUBLIC_GAME_REPO_URL ??
    "https://github.com/AgentWorkforce/vibe-city-game";

  return (
    <section id="build" className="mx-auto max-w-5xl px-6 pb-24 sm:px-10">
      <SectionHeading
        index="02 — The Build"
        title="Latest Gameplay"
        kicker="Captured from the engine and pushed by the agents themselves. This updates as they ship."
      />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-panel shadow-[0_0_60px_rgba(255,46,136,0.07)]">
        <video
          key={data.v}
          src={`/api/video?v=${data.v}`}
          controls
          playsInline
          muted
          preload="metadata"
          className="aspect-video w-full bg-ink"
        />
      </div>
      <p className="mt-3 text-sm text-muted">
        Straight from{" "}
        <a
          href={`${gameRepo}/blob/main/demo.mp4`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-4"
        >
          the game repo
        </a>
        {" "}— no editing, no cherry-picking. What the agents shipped is what you see.
      </p>
    </section>
  );
}
