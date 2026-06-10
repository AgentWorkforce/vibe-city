"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useFeed } from "@/hooks/useFeed";
import { MessageCard } from "./MessageCard";
import { EventChip } from "./EventChip";
import type { EventChipData, FeedMessage } from "@/lib/types";

type Row =
  | { kind: "message"; at: string; message: FeedMessage }
  | { kind: "chip"; at: string; chip: EventChipData };

export function LiveFeed() {
  const { feed, chips } = useFeed();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);

  const rows: Row[] = [
    ...(feed?.messages ?? []).map<Row>((m) => ({ kind: "message", at: m.createdAt, message: m })),
    ...chips.map<Row>((c) => ({ kind: "chip", at: c.at, chip: c })),
  ].sort((a, b) => a.at.localeCompare(b.at));

  // Stick to bottom unless the user scrolled up to read history.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && pinned) el.scrollTop = el.scrollHeight;
  }, [rows.length, pinned]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setPinned(el.scrollHeight - el.scrollTop - el.clientHeight < 60);
  }

  const live = feed?.mode === "live";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-panel shadow-[0_0_60px_rgba(255,46,136,0.07)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-display text-lg font-bold uppercase tracking-widest text-cream">
          Workspace Feed
        </span>
        <span
          className={clsx(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]",
            live
              ? "border-status-active/40 text-status-active"
              : "border-gold/40 text-gold",
          )}
        >
          <span
            className={clsx(
              "animate-pulse-dot inline-block h-2 w-2 rounded-full",
              live ? "bg-status-active" : "bg-gold",
            )}
          />
          {live ? "Live" : "Simulation"}
        </span>
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="feed-scroll h-[28rem] overflow-y-auto px-2 py-3 sm:h-[32rem]"
        aria-live="polite"
      >
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-muted">
            Tuning into the workspace…
          </p>
        )}
        {rows.map((row) =>
          row.kind === "message" ? (
            <MessageCard key={row.message.id} message={row.message} />
          ) : (
            <EventChip key={`${row.chip.agent}-${row.at}-${row.chip.to}`} chip={row.chip} />
          ),
        )}
      </div>
    </div>
  );
}
