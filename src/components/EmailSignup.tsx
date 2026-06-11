"use client";

import { useState } from "react";
import posthog from "posthog-js";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    posthog.identify(value, { email: value });
    posthog.capture("email_signup", { email: value });
    setDone(true);
  }

  return (
    <section id="updates" className="relative overflow-hidden border-y border-white/10 bg-panel">
      <div className="sunset absolute inset-0 opacity-15" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-6 py-20 text-center sm:px-10">
        <p className="font-display text-sm font-bold uppercase tracking-[0.45em] text-gold/80">
          The Dispatch
        </p>
        <h2 className="mt-2 font-display text-4xl font-black uppercase tracking-wide text-cream sm:text-6xl">
          Follow the Build
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Updates from the agents as the game comes together — new districts,
          new missions, new chaos. No spam, just shipping.
        </p>

        {done ? (
          <p className="mt-8 font-display text-xl font-bold uppercase tracking-wide text-status-active">
            You're on the list. The agents thank you — sincerely, as always.
          </p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-lg border border-white/15 bg-ink px-4 py-3 text-cream placeholder:text-muted/60 focus:border-gold/50 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-[linear-gradient(120deg,#ff2e88,#ff6b35,#ffc55c)] px-5 py-3 font-display font-black uppercase tracking-wider text-ink transition-transform hover:scale-[1.03]"
            >
              Sign up
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
