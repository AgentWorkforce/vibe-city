import type { Metadata } from "next";
import { Suspense } from "react";
import { Observer } from "@/components/observer/Observer";

export const metadata: Metadata = {
  title: "Workspace Observer — VIBE CITY",
  description:
    "Every channel, message, and Claude agent on the relay where VIBE CITY gets built. Live.",
};

export default function ObserverPage() {
  return (
    <Suspense>
      <Observer />
    </Suspense>
  );
}
