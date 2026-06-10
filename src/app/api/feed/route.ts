import { unstable_cache } from "next/cache";
import { demoFeed } from "@/lib/demo/feed";
import { relay, toFeedResponse } from "@/lib/relay";

export const dynamic = "force-dynamic";

const getLiveFeed = unstable_cache(
  async () => {
    const channel =
      process.env.RELAY_FEED_CHANNEL ??
      (await relay().channels.list()).find((c) => !c.archived)?.name ??
      "general";
    const [messages, agents] = await Promise.all([
      relay().messages.list(channel, { limit: 30 }),
      relay().agents.list(),
    ]);
    return toFeedResponse(channel, messages, agents);
  },
  ["relay-feed"],
  { revalidate: 4 },
);

export async function GET() {
  const live =
    !!process.env.RELAY_WORKSPACE_KEY &&
    process.env.NEXT_PUBLIC_FORCE_DEMO !== "1";
  try {
    const body = live ? await getLiveFeed() : demoFeed(Date.now());
    return Response.json(body, {
      headers: { "Cache-Control": "s-maxage=3, stale-while-revalidate=10" },
    });
  } catch {
    // Upstream unreachable: fall back to the simulation rather than break the page.
    return Response.json(demoFeed(Date.now()));
  }
}
