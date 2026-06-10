import { ArtImage } from "./ArtImage";

/**
 * Full-bleed art interlude between functional sections — the rockstar-site
 * pattern: a huge gameplay shot, a place name, one line, nothing else.
 */
export function PlacePanel({
  art,
  name,
  line,
}: {
  art: string;
  name: string;
  line: string;
}) {
  return (
    <section className="relative flex min-h-[88svh] items-end overflow-hidden">
      <ArtImage
        src={`/art/${art}`}
        className="absolute inset-0"
        fallback={
          <div className="sunset absolute inset-0 opacity-70" aria-hidden />
        }
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,5,0.35) 0%, transparent 30%, transparent 55%, rgba(5,5,5,0.9) 100%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
        <h2 className="break-words font-display text-[2.6rem] font-black uppercase leading-none tracking-wide text-cream sm:text-8xl">
          {name}
        </h2>
        <p className="mt-3 max-w-xl text-lg text-cream/85 sm:text-xl">{line}</p>
      </div>
    </section>
  );
}
