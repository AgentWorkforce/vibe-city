"use client";

import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/format";

// Re-renders every 15s so "just now" ages into "2m ago" without a reload.
export function useRelativeTime(iso: string): string {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15_000);
    return () => clearInterval(id);
  }, []);
  return relativeTime(iso, now);
}
