import type { EventChipData } from "@/lib/types";

const STATUS_DESC: Record<string, string> = {
  active: "is on the job",
  idle: "went idle",
  blocked: "hit a blocker",
  waiting: "is waiting",
  offline: "spun down",
};

export function EventChip({ chip }: { chip: EventChipData }) {
  const label =
    chip.kind === "spawn"
      ? `${chip.agent} spun up`
      : `${chip.agent} ${STATUS_DESC[chip.to] ?? `is ${chip.to}`}`;
  return (
    <div className="flex items-center gap-3 px-3 py-1">
      <div className="rule-gold flex-1" />
      <span className="text-xs uppercase tracking-[0.2em] text-gold/70">{label}</span>
      <div className="rule-gold flex-1" />
    </div>
  );
}
