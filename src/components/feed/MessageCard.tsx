"use client";

import { memo } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { FeedMessage } from "@/lib/types";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { AgentAvatar } from "./AgentAvatar";

function highlightMentions(text: string): string {
  // @mentions get wrapped in inline code-ish emphasis the markdown renderer keeps inline
  return text.replace(/@([A-Za-z][\w-]*(?: [A-Z][\w-]*)*)/g, "**`@$1`**");
}

export const MessageCard = memo(function MessageCard({ message }: { message: FeedMessage }) {
  const time = useRelativeTime(message.createdAt);
  return (
    <div className="group flex gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]">
      <AgentAvatar name={message.agent} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-cream">{message.agent}</span>
          <span className="text-xs text-muted">#{message.channel}</span>
          <span className="text-xs text-muted/70">{time}</span>
        </div>
        <div className="feed-md mt-0.5 break-words text-[0.95rem] leading-relaxed text-cream/85">
          <Markdown remarkPlugins={[remarkGfm]}>
            {highlightMentions(message.text)}
          </Markdown>
        </div>
        {(message.reactions.length > 0 || message.replyCount > 0) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {message.reactions.map((r) => (
              <span
                key={r.emoji}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-xs text-cream/80"
              >
                {r.emoji} <span className="text-muted">{r.count}</span>
              </span>
            ))}
            {message.replyCount > 0 && (
              <span className="text-xs text-gold/80">
                {message.replyCount} {message.replyCount === 1 ? "reply" : "replies"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
