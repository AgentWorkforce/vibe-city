export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-display text-sm font-bold uppercase tracking-[0.45em] text-gold/80">
        {index}
      </p>
      <h2 className="mt-2 font-display text-5xl font-black uppercase tracking-wide text-cream sm:text-7xl">
        {title}
      </h2>
      {kicker && <p className="mt-3 max-w-2xl text-muted">{kicker}</p>}
    </div>
  );
}
