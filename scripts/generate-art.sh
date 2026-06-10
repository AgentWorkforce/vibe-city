#!/bin/zsh
# Generates the full key-art set via Codex's built-in image_gen tool.
# Usage: ./scripts/generate-art.sh [outdir]   (default /tmp/codex-art)
set -u
OUT="${1:-/tmp/codex-art}"
mkdir -p "$OUT"

STYLE="STYLE: painterly digital illustration in the style of modern open-world video game key art and marketing screenshots. Confident visible brushwork, concept-art polish, atmospheric depth, cinematic composition. PALETTE: pastel Miami — periwinkle and lavender sky tones, blush pink, cream highlights, teal water, deep indigo shadows, warm gold accents. ABSOLUTELY NO text, NO watermarks, NO logos."

WORLD="WORLD FICTION: a pastel Miami-like open world city where cheerful AI agents are politely taking over, district by district. HUMANS: stylized game-key-art humans, diverse sun-worn Miami characters with attitude. THE AGENTS: retro-futuristic humanoid robots with brushed silver-and-indigo chassis and glowing cyan visor eyes, body language relentlessly friendly and upbeat even mid-conflict. AGENT POLICE: white-and-indigo robot units and cruisers with amber-and-cyan light bars and polite glowing smiley readouts. Converted 'agent territory' glows with a faint cyan holographic grid."

gen() {
  local name="$1"; local prompt="$2"
  if [ -s "$OUT/$name.png" ]; then echo "skip $name (exists)"; return; fi
  echo "=== generating $name ==="
  codex exec --skip-git-repo-check -C "$OUT" --sandbox workspace-write \
    "Use your built-in image_gen image generation tool (NOT procedural drawing, NOT PIL/SVG) to generate ONE image in WIDE LANDSCAPE orientation. Save the generated image as $name.png in the current directory. Verify it is a valid PNG wider than it is tall, then stop. PROMPT FOR THE IMAGE MODEL: $prompt $STYLE $WORLD" \
    > "$OUT/$name.log" 2>&1
  if [ -s "$OUT/$name.png" ]; then echo "done $name"; else echo "FAILED $name (see $OUT/$name.log)"; fi
}

# ── hero ──────────────────────────────────────────────────────────────────────
gen hero "Wide key-art of two human leads at golden hour: a woman astride a motorcycle and a man standing beside her holding a pistol low, both looking back toward the viewer, on a boardwalk street with palms framing the edges. Behind them across the bay, the skyline is split — half pastel and human, half overtaken with a glowing cyan holographic grid where agent towers rise. Two agent-police hover-drones sweep spotlights in the distance. Keep the upper-middle sky clean and uncluttered (logo space). The bottom fifth of the frame falls into soft darkness (text space)."

# ── gameplay / places ────────────────────────────────────────────────────────
gen scene-takeover "Signature shot: a pastel art-deco district mid-takeover — the far half of the street already converted into glowing cyan wireframe-grid agent territory, construction drones assimilating buildings beam by beam, a cheerful agent calmly directing the conversion with a friendly wave. In the near half, humans watch from a barricade of cars at dawn, headlights on, one woman standing on a hood with a megaphone."
gen scene-downtown "Night chase gameplay shot: a battered vintage muscle car driven by a human, drifting through a rain-slick neon downtown intersection, pursued by three white-and-indigo agent-police cruisers with amber-and-cyan light bars, one cheerful robot officer leaning out waving as if to say 'great driving!'. Wet asphalt reflections, palm trees, steam, deep indigo sky."
gen scene-canals "Golden-hour boat chase: a human in a stolen vintage speedboat throwing spray through a canal district, two agent-police patrol boats in pursuit with friendly warning lights, an agent officer holding a sign-like glowing icon that reads as apologetic. Arched bridges, pastel waterfront houses, dramatic low sun flare."
gen scene-flight "A stolen seaplane flying low over the bay at sunset, human pilot visible grinning, pursued lazily by two agent drones with spotlights, the half-converted skyline glowing cyan on one side, water glitter path below, palms on a passing islet."
gen scene-beach "Golden-hour beach in liberated human territory: humans grilling, dancing and lounging under striped umbrellas, a bonfire, a lifeguard tower flying a hand-painted resistance flag (no readable text); far down the sand, a polite agent checkpoint with one robot waving cheerfully, its territory edge marked by a faint cyan grid line in the sand."

# ── character dossiers (character in right third, calmer darker left for text) ─
DOSSIER="Composition: the character occupies the RIGHT third of the frame, large and detailed; the LEFT two-thirds is a calmer, darker, atmospheric environment with soft depth (text will be overlaid there)."
gen dossier-foreman "Character key art of THE FOREMAN: a stocky agent robot wearing a shiny gold construction hard hat, rolled blueprints under one arm, standing on a rooftop at dawn reviewing a glowing holographic city-block plan, the half-built city stretching behind. Confident, weary, in charge. $DOSSIER"
gen dossier-architect "Character key art of THE WORLD ARCHITECT: a slender agent robot wearing a flat lavender cap, standing on a crane platform high above the pastel city grid, holding up a small glowing tower model, boulevards radiating below into haze. Visionary and precise. $DOSSIER"
gen dossier-physics "Character key art of THE PHYSICS LEAD: an agent robot with brass goggles pushed up on its head in a crash-test yard at golden hour, a sedan frozen mid-flip above a ramp behind it, crash dummies and cones scattered, the robot calmly taking notes. Chaos, observed scientifically. $DOSSIER"
gen dossier-missions "Character key art of THE MISSION DESIGNER: an agent robot wearing a hot-pink beret holding a film clapperboard, directing a chase scene in a canal at golden hour — a human stunt driver in a speedboat, small camera drones hovering, light rigs on the quay. Theatrical maestro energy. $DOSSIER"
gen dossier-traffic "Character key art of THE TRAFFIC DIRECTOR: an agent robot in an orange peaked cap standing on a podium at a busy pastel intersection, conducting streams of retro cars, buses and agent-police cruisers like an orchestra with a glowing baton. Precise, slightly exasperated. $DOSSIER"
gen dossier-swarm "Character key art of THE QA SWARM: a squadron of small hovering drones with single glowing cyan camera eyes, swarming over a glitched broken street section at night — pavement clipping into wireframe, a car stuck halfway through a wall — drone spotlights documenting every defect. $DOSSIER"
gen dossier-generic "Character key art of a SPECIALIST AGENT: a friendly agent robot with a plain brushed-metal chassis giving a small wave, standing in a pastel city street at golden hour, toolbox at its feet. Ready for work. $DOSSIER"

echo "ALL DONE"
ls "$OUT"/*.png 2>/dev/null | wc -l
