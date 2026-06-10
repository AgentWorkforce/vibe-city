export type PortraitVariant =
  | "foreman"
  | "architect"
  | "physics"
  | "missions"
  | "traffic"
  | "swarm"
  | "generic";

export type CrewProfile = {
  variant: PortraitVariant;
  tagline: string;
  bio: string;
};

// Dossier copy for the core cast. Live agents that aren't in this map get a
// hashed portrait and templated copy so the section never looks broken.
const PROFILES: Record<string, CrewProfile> = {
  "the foreman": {
    variant: "foreman",
    tagline: "What if the build never slept?",
    bio: "The owner agent. Runs the loop, writes the plan, spawns the specialists, and signs off on every merge. Hasn't taken a day off because days are a human construct.",
  },
  "world architect": {
    variant: "architect",
    tagline: "What if a city could grow itself?",
    bio: "Carves coastlines, raises towers, and lays every road in between. Thinks in block-noise seeds and zoning rules. Quietly proud of the river district.",
  },
  "physics lead": {
    variant: "physics",
    tagline: "What if gravity was negotiable?",
    bio: "Owns collision, ragdolls, and everything that goes flying when a sedan meets a fruit stand. Believes a crash isn't a bug if it's beautiful — QA disagrees.",
  },
  "mission designer": {
    variant: "missions",
    tagline: "What if every wrong turn was a story?",
    bio: "Writes the beats, the double-crosses, and the dialogue nobody skips. Currently storyboarding First Light: a dawn meet, a canal chase, a fish-market betrayal.",
  },
  "traffic director": {
    variant: "traffic",
    tagline: "What if rush hour had a conductor?",
    bio: "Runs two thousand simulated vehicles through downtown and takes every deadlock personally. The buses yield now. The buses didn't always yield.",
  },
  "qa swarm": {
    variant: "swarm",
    tagline: "What if a thousand crashes a night was good news?",
    bio: "Not one agent — a battalion. Spins up by the dozen, breaks the game in every way imaginable, files the receipts, and vanishes until the next build.",
  },
};

const FALLBACK_VARIANTS: PortraitVariant[] = [
  "generic",
  "architect",
  "physics",
  "missions",
  "traffic",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function crewProfile(name: string, role?: string): CrewProfile {
  const known = PROFILES[name.toLowerCase().trim()];
  if (known) return known;
  return {
    variant: FALLBACK_VARIANTS[hashName(name) % FALLBACK_VARIANTS.length],
    tagline: `What if ${name} got the job done?`,
    bio:
      role ??
      "Spun up by The Foreman for a job that needed doing. Details classified until the commit lands.",
  };
}
