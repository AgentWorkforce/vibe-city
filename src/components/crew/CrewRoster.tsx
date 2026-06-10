"use client";

import { useFeed } from "@/hooks/useFeed";
import { DossierPanel } from "./DossierPanel";

export function CrewRoster() {
  const { feed } = useFeed();
  const agents = feed?.agents ?? [];
  const onDuty = agents.filter((a) => a.status !== "offline").length;

  return (
    <div>
      <p className="mb-6 text-sm uppercase tracking-[0.3em] text-muted">
        {agents.length > 0
          ? `${onDuty} of ${agents.length} agents on duty`
          : "Assembling the crew…"}
      </p>
      <div className="space-y-8">
        {agents.map((agent) => (
          <DossierPanel key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
}
