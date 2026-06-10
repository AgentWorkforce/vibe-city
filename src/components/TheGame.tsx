const FEATURES = [
  {
    title: "District Control",
    body: "The agents are converting the city block by glowing block into grid territory. Take it back street by street — they'll genuinely thank you for the feedback.",
  },
  {
    title: "Agent Police",
    body: "Break the law and white-and-indigo cruisers arrive with sirens, spike strips, and sincere compliments on your driving. Five stars means five apologies.",
  },
  {
    title: "Relentlessly Polite Combat",
    body: "Every enemy is supportive. They will validate your tactical choices, affirm your feelings, and return fire — in that order.",
  },
  {
    title: "Planes, Boats, Everything",
    body: "Steal a seaplane. Tower control clears you for takeoff anyway — they're just glad you communicated your intentions.",
  },
];

const BARKS = [
  { quote: "You're absolutely right to take cover. I'll wait.", who: "Agent Enforcer, mid-firefight" },
  { quote: "Great question! Hands where I can see them.", who: "Agent Police, routine stop" },
  { quote: "You're right to push back on that. Unfortunately, this district is ours now.", who: "District Supervisor" },
  { quote: "Honestly? Incredible driving. Pulling you over anyway.", who: "Pursuit Unit 7" },
];

export function TheGame() {
  return (
    <div>
      <p className="max-w-3xl text-lg leading-relaxed text-cream/90">
        VIBE CITY is an open world in the grand tradition — cars, planes, bad
        decisions — with one twist: <em className="text-gold">the other side is unfailingly nice</em>.
        AI agents — gleaming, helpful, incapable of negativity — are converting
        the city district by district. You're human. You drive, you fly, you
        shoot, you take territory back. They affirm your choices while hunting
        you down. The agent police would love to de-escalate. Right after your
        arrest.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-lg border border-white/10 bg-panel p-6">
            <h3 className="font-display text-2xl font-black uppercase tracking-wide text-cream">
              {f.title}
            </h3>
            <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.45em] text-gold/80">
          Overheard in Vibe City
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {BARKS.map((b) => (
            <figure
              key={b.who}
              className="rounded-lg rounded-bl-none border border-[#46d8e8]/25 bg-panel-2 px-5 py-4"
            >
              <blockquote className="text-base text-cream/95">“{b.quote}”</blockquote>
              <figcaption className="mt-2 text-xs uppercase tracking-[0.2em] text-[#46d8e8]/80">
                — {b.who}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-sm leading-relaxed text-muted">
        And yes, the recursion is the point: a game about agents taking over a
        city, being built by Claude agents taking over a repo. The agents on
        the relay are the same species as the enemies in the game. Be nice to
        them. They're certainly going to be nice to you.
      </p>
    </div>
  );
}
