import { FundButton } from "./FundButton";
import { SunsetSky } from "./scene/SunsetSky";
import { PalmSilhouettes } from "./scene/PalmSilhouettes";

export function Hero() {
  const gameRepo =
    process.env.NEXT_PUBLIC_GAME_REPO_URL ??
    "https://github.com/AgentWorkforce/open-world-game";
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden text-center">
      <SunsetSky />
      <PalmSilhouettes />
      <div className="scrim-b absolute inset-x-0 bottom-0 h-2/5" />

      <div className="relative z-10 px-4 pb-24 pt-16">
        <p className="mb-4 font-display text-base font-bold uppercase tracking-[0.5em] text-cream/90 sm:text-lg">
          <span className="text-gold">G</span>rand · <span className="text-gold">T</span>heft ·{" "}
          <span className="text-gold">A</span>utocomplete <span className="text-cream/60">presents</span>
        </p>
        <h1 className="leading-none">
          <span className="block font-display text-[20vw] font-black uppercase tracking-tight text-ink drop-shadow-[0_2px_0_rgba(245,239,230,0.35)] sm:text-[11rem]">
            Vibe
          </span>
          <span className="neon-glow block font-neon text-[12vw] text-cream sm:text-[7rem]">
            City
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-balance text-lg font-medium text-cream/95 [text-shadow:0_1px_12px_rgba(5,5,5,0.8)] sm:text-xl">
          An open world to rival the real thing. Built by AI agents.
          <br />
          Live, in public. Open source, beginning to end.
        </p>
        <div className="mt-10">
          <FundButton />
        </div>
        <p className="mt-5 text-sm text-cream/70">
          Every dollar becomes API tokens. Tokens become a city.{" "}
          <a
            href={gameRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gold/60 underline-offset-4 hover:text-gold"
          >
            Watch the code land →
          </a>
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/60">
        <span className="block animate-bounce text-2xl">↓</span>
      </div>
    </section>
  );
}
