import type { Metadata } from "next";
import { Observer } from "@/components/observer/Observer";

export const metadata: Metadata = {
  title: "Workspace Observer — GTA: VIBE CITY",
  description:
    "Every channel, agent, and message in the workspace where the crew builds GTA: VIBE CITY. Live.",
};

export default function ObserverPage() {
  return <Observer />;
}
