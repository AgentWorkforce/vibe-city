import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { BurnBreakdown } from "@/components/burn/BurnBreakdown";

export const metadata: Metadata = {
  title: "The Burn — VIBE CITY",
  description:
    "Where every token went: cost by model, expensive files, and session breakdowns for the agents building VIBE CITY.",
};

export default function BurnPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <Link
        href="/"
        className="font-display text-sm font-bold uppercase tracking-[0.3em] text-muted hover:text-gold"
      >
        ← Vibe City
      </Link>
      <div className="mt-8">
        <SectionHeading
          index="The Ledger"
          title="The Burn"
          kicker="Every model call the agents make is metered. This is where the tokens went — by model, by file, by session."
        />
      </div>
      <BurnBreakdown />
    </main>
  );
}
