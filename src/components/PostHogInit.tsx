"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ??
  "phc_yoQVYuFvnFkYzUScnntmoN4DT7HEUzcoKsE5ASfmXiRj";

export function PostHogInit() {
  useEffect(() => {
    if (posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: "https://us.i.posthog.com",
      defaults: "2025-05-24", // autocapture + SPA pageview tracking
    });
  }, []);
  return null;
}
