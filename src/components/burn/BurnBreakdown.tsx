"use client";

import useSWR from "swr";
import { formatTokens, formatUsd } from "@/lib/format";

type CostBlock = {
  total?: number;
  input?: number;
  output?: number;
  reasoning?: number;
  cacheRead?: number;
  cacheCreate?: number;
};

type BurnDetail = {
  updatedAt: string | null;
  turns: number;
  totals: CostBlock;
  byModel: Array<{
    model: string;
    turns: number;
    usage?: {
      input?: number;
      output?: number;
      reasoning?: number;
      cacheRead?: number;
      cacheCreate5m?: number;
      cacheCreate1h?: number;
    };
    cost?: CostBlock;
  }>;
  hotspots: {
    files?: Array<{ path: string; totalCost?: number; toolCallCount?: number }>;
    sessions?: Array<{ sessionId: string; grandCost?: number }>;
  };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function usd(value?: number): string {
  return formatUsd(Math.round((value ?? 0) * 100) / 100);
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-5">
      <p className="text-xs uppercase tracking-[0.3em] text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-cream sm:text-4xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function BurnBreakdown() {
  const { data } = useSWR<BurnDetail>("/api/burn", fetcher, {
    refreshInterval: 60_000,
    keepPreviousData: true,
  });

  const totals = data?.totals ?? {};
  const models = data?.byModel ?? [];
  const files = data?.hotspots?.files ?? [];
  const sessions = data?.hotspots?.sessions ?? [];

  return (
    <div className="space-y-12">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Total burned" value={usd(totals.total)} sub={`${data?.turns ?? 0} model turns`} />
        <Card label="Output" value={usd(totals.output)} sub="the thinking" />
        <Card
          label="Cache + input"
          value={usd((totals.input ?? 0) + (totals.cacheRead ?? 0) + (totals.cacheCreate ?? 0))}
          sub="the remembering"
        />
      </div>

      <div>
        <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-wide text-cream">
          By model
        </h3>
        <div className="overflow-x-auto rounded-lg border border-white/10 bg-panel">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3 text-right">Turns</th>
                <th className="px-4 py-3 text-right">Input</th>
                <th className="px-4 py-3 text-right">Output</th>
                <th className="px-4 py-3 text-right">Cache read</th>
                <th className="px-4 py-3 text-right">Cost</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.model} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-cream">{m.model}</td>
                  <td className="px-4 py-3 text-right text-cream/80">{m.turns}</td>
                  <td className="px-4 py-3 text-right text-muted">
                    {formatTokens(m.usage?.input ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {formatTokens((m.usage?.output ?? 0) + (m.usage?.reasoning ?? 0))}
                  </td>
                  <td className="px-4 py-3 text-right text-muted">
                    {formatTokens(m.usage?.cacheRead ?? 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gold">
                    {usd(m.cost?.total)}
                  </td>
                </tr>
              ))}
              {models.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    No burn data yet — the meter starts with the first model call.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {files.length > 0 && (
        <div>
          <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-wide text-cream">
            Expensive files
          </h3>
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-panel">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.2em] text-muted">
                  <th className="px-4 py-3">File</th>
                  <th className="px-4 py-3 text-right">Tool calls</th>
                  <th className="px-4 py-3 text-right">Attributed cost</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.path} className="border-b border-white/5 last:border-0">
                    <td className="max-w-md truncate px-4 py-2.5 font-mono text-xs text-cream/85">
                      {f.path}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted">{f.toolCallCount ?? 0}</td>
                    <td className="px-4 py-2.5 text-right text-gold">{usd(f.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sessions.length > 0 && (
        <div>
          <h3 className="mb-4 font-display text-2xl font-black uppercase tracking-wide text-cream">
            Expensive sessions
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {sessions.map((s) => (
              <div
                key={s.sessionId}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-panel px-4 py-3"
              >
                <span className="truncate font-mono text-xs text-muted">{s.sessionId}</span>
                <span className="ml-4 font-semibold text-gold">{usd(s.grandCost)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-muted">
        {data?.updatedAt && (
          <>Updated {new Date(data.updatedAt).toLocaleString()} · </>
        )}
        Metered by{" "}
        <a
          href="https://github.com/AgentWorkforce/burn"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline underline-offset-4"
        >
          burn
        </a>
        , the token-spend ledger for agent CLIs.
      </p>
    </div>
  );
}
