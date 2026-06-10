// Renders source plates for the painterly pipeline from /art-source/[slot].
// Usage: node scripts/render-plates.mjs [baseUrl] [outDir]
import { chromium } from "/Users/will/Projects/AgentWorkforce/relay/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3941";
const out = process.argv[3] ?? "/tmp/plates";
mkdirSync(out, { recursive: true });

const VARIANTS = ["foreman", "architect", "physics", "missions", "traffic", "swarm", "generic"];

const browser = await chromium.launch();

// hero: 1920x1200 plate
const hero = await browser.newPage({ viewport: { width: 1920, height: 1200 } });
await hero.goto(`${base}/art-source/hero`, { waitUntil: "networkidle" });
await hero.waitForTimeout(600);
await hero.screenshot({ path: `${out}/hero.png` });
console.log("plated hero");

// portraits: 1120x1440 transparent plates
const p = await browser.newPage({ viewport: { width: 1120, height: 1440 } });
for (const v of VARIANTS) {
  await p.goto(`${base}/art-source/portrait-${v}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/portrait-${v}.png`, omitBackground: true });
  console.log(`plated portrait-${v}`);
}
await browser.close();
