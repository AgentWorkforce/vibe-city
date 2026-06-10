"use client";

import { useBudget } from "@/hooks/useBudget";
import { formatTokens, formatUsd, clamp } from "@/lib/format";
import { FundButton } from "./FundButton";

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <p
        className="mt-1 font-display text-4xl font-black tracking-wide sm:text-5xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

export function BudgetGauge() {
  const budget = useBudget();
  const raised = budget?.raisedUsd ?? 0;
  const spent = budget?.spentUsd ?? 0;
  const goal = budget?.goalUsd ?? 500_000;
  const tokens = (budget?.inputTokens ?? 0) + (budget?.outputTokens ?? 0);

  const raisedPct = clamp((raised / goal) * 100, 0, 100);
  const spentPct = clamp((spent / goal) * 100, 0, 100);

  return (
    <div className="rounded-lg border border-white/10 bg-panel p-6 sm:p-10">
      <div className="grid gap-8 sm:grid-cols-3">
        <Stat label="Raised" value={formatUsd(raised)} accent="#ffc55c" />
        <Stat label="Burned" value={formatUsd(spent)} accent="#ff2e88" />
        <Stat label="Goal" value={formatUsd(goal)} />
      </div>

      {/* heist meter */}
      <div className="relative mt-10 h-6 overflow-hidden rounded-full border border-white/15 bg-ink">
        {/* segment ticks */}
        <div
          aria-hidden
          className="absolute inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0 calc(5% - 2px), #050505 calc(5% - 2px) 5%)",
          }}
        />
        {/* raised fill */}
        <div
          className="absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#14454f,#ff6b35,#ffc55c)] transition-[width] duration-700"
          style={{ width: `${raisedPct}%` }}
        />
        {/* spent marker */}
        <div
          className="absolute inset-y-0 z-20 w-[3px] bg-magenta shadow-[0_0_8px_#ff2e88] transition-[left] duration-700"
          style={{ left: `${spentPct}%` }}
          title={`Burned: ${formatUsd(spent)}`}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>
          <span className="text-gold">{formatTokens(tokens)}</span> tokens burned
          across <span className="text-cream/80">{budget?.generations ?? 0}</span>{" "}
          model calls
        </span>
        <span className="text-xs uppercase tracking-[0.2em]">live numbers</span>
      </div>

      <div className="mt-8 text-center">
        <FundButton size="md" />
        <p className="mt-3 text-sm text-muted">
          100% of contributions buy API tokens. The burn is public, the code is
          public, the city is yours.
        </p>
      </div>
    </div>
  );
}
