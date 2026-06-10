import { unstable_cache } from "next/cache";
import { relay, toFeedResponse } from "@/lib/relay";
import type { FeedResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const EMPTY: Omit<FeedResponse, "generatedAt"> = { messages: [], agents: [] };

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
  try {
    const body = process.env.RELAY_WORKSPACE_KEY
      ? await getLiveFeed()
      : { ...EMPTY, generatedAt: new Date().toISOString() };
    return Response.json(body, {
      headers: { "Cache-Control": "s-maxage=3, stale-while-revalidate=10" },
    });
  } catch {
    // upstream unreachable: serve an empty feed rather than break the page
    return Response.json({ ...EMPTY, generatedAt: new Date().toISOString() });
  }
}
