// Renders the studio shots in this folder into website/site/assets/work/.
//
//   node website/shots/render.mjs            all shots
//   node website/shots/render.mjs oxide      one shot
//
// Needs playwright (root devDependency) and cwebp. Set PW_CHROME to use a specific
// Chromium binary when the bundled browser is not installed.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, "..", "site", "assets", "work");

// name → [page, output file, scale, query]
const SHOTS = {
  curate: ["curate.html", "shot-curate.webp", 1.25],
  heurisight: ["heurisight.html", "shot-heurisight.webp", 1.25, "?view=learning"],
  "heurisight-profile": ["heurisight.html", "shot-heurisight-profile.webp", 1.25, "?view=profile"],
  nanda: ["nanda.html", "shot-nanda.webp", 1.25],
  nirvana: ["nirvana.html", "shot-nirvana.webp", 1],
  oxide: ["oxide.html", "shot-oxide.webp", 1.25],
  cook: ["cook.html", "shot-cook.webp", 1.25],
  signet: ["signet.html", "shot-signet.webp", 1.25],
  basera: ["basera.html", "shot-basera.webp", 1.25],
  cyber: ["cyber.html", "shot-cyber.webp", 1.25],
  hemo: ["hemo.html", "shot-hemo.webp", 1.25],
  // flat screens for the "under the surface" panels and the case-study page
  "heuri-flat": ["heurisight.html", "heuri-dash2.webp", 1.25, "?view=learning&flat"],
};

const want = process.argv.slice(2);
const names = want.length ? want : Object.keys(SHOTS);
const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "shots-"));

for (const name of names) {
  const [file, out, scale, query = ""] = SHOTS[name] ?? [];
  if (!file) { console.error(`unknown shot: ${name}`); process.exitCode = 1; continue; }
  const ctx = await browser.newContext({ viewport: { width: 1700, height: 1500 }, deviceScaleFactor: scale });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(HERE, file)).href + query, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = path.join(tmp, `${name}.png`);
  await page.locator(".board").screenshot({ path: png });
  execFileSync("cwebp", ["-quiet", "-q", "86", "-m", "6", png, "-o", path.join(OUT, out)]);
  console.log(`${name} → assets/work/${out} (${Math.round(fs.statSync(path.join(OUT, out)).size / 1024)} KB)`);
  await ctx.close();
}

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
