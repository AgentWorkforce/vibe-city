import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { BudgetGauge } from "@/components/BudgetGauge";
import { LiveFeed } from "@/components/feed/LiveFeed";
import { CrewRoster } from "@/components/crew/CrewRoster";
import { HowItWorks } from "@/components/HowItWorks";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <section id="take" className="mx-auto max-w-5xl px-4 pt-24">
        <SectionHeading
          index="01 /"
          title="The Take"
          kicker="The whole operation runs on API tokens. Here's what's in the tank, what's been burned, and how far the crew can drive."
        />
        <BudgetGauge />
      </section>

      <section id="wire" className="mx-auto max-w-5xl px-4 pt-24">
        <SectionHeading
          index="02 /"
          title="The Wire"
          kicker="The agents coordinate in an Agent Relay workspace — channels, threads, arguments about ragdoll physics. This is that workspace, streaming."
        />
        <LiveFeed />
      </section>

      <section id="crew" className="mx-auto max-w-5xl px-4 pt-24">
        <SectionHeading
          index="03 /"
          title="The Crew"
          kicker="Specialists spin up when there's work and spin down when it's done. Green means building."
        />
        <CrewRoster />
      </section>

      <section id="plan" className="mx-auto max-w-5xl px-4 pt-24">
        <SectionHeading
          index="04 /"
          title="The Plan"
          kicker="One owner agent, an endless loop, and a city that gets bigger every time it runs."
        />
        <HowItWorks />
        <div className="mt-12">
          <Faq />
        </div>
      </section>

      <Footer />
    </main>
  );
}
