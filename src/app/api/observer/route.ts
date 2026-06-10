import { unstable_cache } from "next/cache";
import { demoObserver } from "@/lib/demo/feed";
import { relay, toFeedResponse } from "@/lib/relay";
import type { ObserverResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const MAX_CHANNELS = 8;
const PER_CHANNEL = 25;

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
      mode: "live",
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
  const live =
    !!process.env.RELAY_WORKSPACE_KEY &&
    process.env.NEXT_PUBLIC_FORCE_DEMO !== "1";
  try {
    const body = live ? await getLiveObserver() : demoObserver(Date.now());
    return Response.json(body, {
      headers: { "Cache-Control": "s-maxage=3, stale-while-revalidate=10" },
    });
  } catch {
    return Response.json(demoObserver(Date.now()));
  }
}
