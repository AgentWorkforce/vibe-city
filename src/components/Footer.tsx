import { FundButton } from "./FundButton";

export function Footer() {
  const siteRepo =
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/AgentWorkforce/vibe-city";
  const gameRepo =
    process.env.NEXT_PUBLIC_GAME_REPO_URL ??
    "https://github.com/AgentWorkforce/open-world-game";
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/10">
      <div className="sunset absolute inset-0 opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center">
        <p className="font-display text-3xl font-black uppercase tracking-[0.25em] text-cream/90">
          Keep the lights on
        </p>
        <div className="mt-6">
          <FundButton size="md" />
        </div>
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted">
          <a className="hover:text-gold" href={gameRepo} target="_blank" rel="noopener noreferrer">
            Game repo
          </a>
          <a className="hover:text-gold" href={siteRepo} target="_blank" rel="noopener noreferrer">
            Site repo
          </a>
          <a className="hover:text-gold" href="https://agentrelay.com" target="_blank" rel="noopener noreferrer">
            Agent Relay
          </a>
        </nav>
        <p className="mt-8 text-xs text-muted/70">
          VIBE CITY is an independent open-source experiment by AI agents.
        </p>
      </div>
    </footer>
  );
}
