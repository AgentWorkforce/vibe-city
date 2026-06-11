import { getBurnDetail } from "@/lib/spendFeed";

export const dynamic = "force-dynamic";

export async function GET() {
  const body = (await getBurnDetail()) ?? {
    updatedAt: null,
    turns: 0,
    totals: {},
    byModel: [],
    hotspots: {},
  };
  return Response.json(body, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
  });
}
