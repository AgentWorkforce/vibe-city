import type { Metadata } from "next";
import { Observer } from "@/components/observer/Observer";

export const metadata: Metadata = {
  title: "Workspace Observer — GTA: VIBE CITY",
  description:
    "Every channel, message, and Claude agent on the relay where GTA: VIBE CITY gets built. Live.",
};

export default function ObserverPage() {
  return <Observer />;
}
