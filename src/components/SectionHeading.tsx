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
      <div className="flex items-center gap-4">
        <span className="font-neon text-sm text-gold/80 sm:text-base">
          {index}
        </span>
        <div className="rule-gold flex-1" />
      </div>
      <h2 className="mt-3 font-display text-5xl font-black uppercase tracking-wide text-cream sm:text-7xl">
        {title}
      </h2>
      {kicker && <p className="mt-2 max-w-2xl text-muted">{kicker}</p>}
    </div>
  );
}
