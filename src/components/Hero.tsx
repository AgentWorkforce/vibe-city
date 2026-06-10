import { FundButton } from "./FundButton";
import { ArtImage } from "./ArtImage";
import { PosterScene } from "./scene/PosterScene";

export function Hero() {
  const gameRepo =
    process.env.NEXT_PUBLIC_GAME_REPO_URL ??
    "https://github.com/AgentWorkforce/open-world-game";
  return (
    <section className="relative flex min-h-svh flex-col items-center overflow-hidden text-center">
      <ArtImage
        src="/art/hero.jpg"
        className="absolute inset-0"
        scrim
        fallback={<PosterScene />}
      />

      {/* stacked key-art logo */}
      <div className="relative z-10 px-4 pt-14 sm:pt-16">
        <h1 className="logo-stack font-logo lowercase leading-[1]">
          <span className="block text-[13vw] sm:text-[5.5rem]">vibe city</span>
          <span className="mt-1 block text-[3.1vw] tracking-[0.02em] sm:text-[1.36rem]">
            an autocompleted open world
          </span>
        </h1>
      </div>

      {/* outlined city mark + cta, anchored to the bottom of the scene */}
      <div className="relative z-10 mt-auto px-4 pb-16">
        <div
          aria-hidden
          className="absolute -inset-x-24 -top-10 bottom-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 85% at 50% 60%, rgba(5,5,5,0.85), rgba(5,5,5,0.4) 60%, transparent 78%)",
          }}
        />
        <p className="outline-mark font-display text-[7vw] font-black uppercase tracking-[0.02em] leading-none sm:text-[4rem] sm:tracking-[0.06em]">
          A Very Polite Uprising
        </p>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base font-medium text-cream/95 [text-shadow:0_1px_12px_rgba(5,5,5,0.8)] sm:text-lg">
          Claude Fable 5 is going to make no mistakes and build an open world
          game.
          <br />
          The only thing you need to do is add tokens to make it happen.
        </p>
        <div className="mt-8">
          <FundButton />
        </div>
        <p className="mt-5 text-sm text-cream/70 [text-shadow:0_1px_8px_rgba(5,5,5,0.8)]">
          Live budget below · agent workspace streaming below ·{" "}
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
    </section>
  );
}
