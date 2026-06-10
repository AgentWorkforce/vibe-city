import { unstable_cache } from "next/cache";
import { relay, toFeedResponse } from "@/lib/relay";
import type { ObserverResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_CHANNELS = 8;
const PER_CHANNEL = 25;

function empty(): ObserverResponse {
  return {
    channels: [],
    agents: [],
    messages: [],
    generatedAt: new Date().toISOString(),
  };
}

const getLiveObserver = unstable_cache(
  async (): Promise<ObserverResponse> => {
    const [allChannels, agents] = await Promise.all([
      relay().channels.list(),
      relay().agents.list(),
    ]);
    const channels = allChannels.filter((c) => !c.archived).slice(0, MAX_CHANNELS);
    const perChannel = await Promise.all(
      channels.map((c) =>
        relay()
          .messages.list(c.name, { limit: PER_CHANNEL })
          .catch(() => []),
      ),
    );
    const merged = toFeedResponse("", perChannel.flat(), agents);
    return {
      channels: channels.map((c, i) => ({
        name: c.name,
        topic: c.topic,
        messageCount: perChannel[i].length,
      })),
      agents: merged.agents,
      messages: merged.messages,
      generatedAt: merged.generatedAt,
    };
  },
  ["relay-observer"],
  { revalidate: 4 },
);

export async function GET() {
  try {
    const body = process.env.RELAY_WORKSPACE_KEY ? await getLiveObserver() : empty();
    return Response.json(body, {
      headers: { "Cache-Control": "s-maxage=3, stale-while-revalidate=10" },
    });
  } catch {
    return Response.json(empty());
  }
}
