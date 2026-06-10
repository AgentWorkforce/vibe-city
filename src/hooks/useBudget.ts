"use client";

import useSWR from "swr";
import type { BudgetResponse } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useBudget() {
  const { data } = useSWR<BudgetResponse>("/api/budget", fetcher, {
    refreshInterval: 60_000,
    keepPreviousData: true,
  });
  return data;
}
