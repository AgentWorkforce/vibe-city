import { notFound } from "next/navigation";
import { PosterScene } from "@/components/scene/PosterScene";
import { RobotPortrait } from "@/components/crew/RobotPortrait";
import type { PortraitVariant } from "@/lib/crew";

// Source-plate renderer for the painterly pipeline (scripts/paint.py).
// /art-source/hero            -> full poster scene, viewport-sized
// /art-source/portrait-<v>    -> single robot on transparent background

const VARIANTS: PortraitVariant[] = [
  "foreman",
  "architect",
  "physics",
  "missions",
  "traffic",
  "swarm",
  "generic",
];

export function generateStaticParams() {
  return [
    { slot: "hero" },
    ...VARIANTS.map((v) => ({ slot: `portrait-${v}` })),
  ];
}

export default async function ArtSource({
  params,
}: {
  params: Promise<{ slot: string }>;
}) {
  const { slot } = await params;
  if (slot === "hero") {
    return (
      <div className="relative h-svh w-screen overflow-hidden">
        <PosterScene />
      </div>
    );
  }
  const variant = slot.replace(/^portrait-/, "") as PortraitVariant;
  if (!slot.startsWith("portrait-") || !VARIANTS.includes(variant)) notFound();
  return (
    <div
      className="h-svh w-screen"
      style={{ background: "transparent" }}
      data-portrait
    >
      {/* body paints --color-ink and a grain overlay; clear both for real alpha */}
      <style>
        {"html, body { background: transparent !important; } body > svg { display: none !important; }"}
      </style>
      <RobotPortrait variant={variant} scenery={false} />
    </div>
  );
}
