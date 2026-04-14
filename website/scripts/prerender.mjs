/**
 * Postbuild prerender script.
 *
 * Spins up a static server on the Vite build output (dist/),
 * visits every route from sitemap.xml with Puppeteer,
 * and writes the fully-rendered HTML back to dist/.
 *
 * IMPORTANT: The original dist/index.html (SPA shell) is preserved as the
 * fallback for the static server. The homepage prerender is written LAST so
 * it replaces the shell only after all other routes have been rendered.
 *
 * Usage:  node scripts/prerender.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const PORT = 4173;
const SPA_SHELL = path.join(DIST, "__shell.html");

/* ── 1. Extract routes from sitemap.xml ───────────────────────────── */
function routesFromSitemap() {
  const sitemap = fs.readFileSync(
    path.resolve(__dirname, "../public/sitemap.xml"),
    "utf-8"
  );
  const matches = [
    ...sitemap.matchAll(/<loc>https:\/\/aletheiaai\.tech(\/[^<]*)<\/loc>/g),
  ];
  // Move "/" to the end so the homepage is prerendered last
  const routes = matches.map((m) => m[1]);
  const homeIdx = routes.indexOf("/");
  if (homeIdx !== -1) {
    routes.splice(homeIdx, 1);
    routes.push("/");
  }
  return routes;
}

/* ── 2. Tiny static server (always serves the original SPA shell) ─── */
function serve() {
  return new Promise((resolve) => {
    const mimeTypes = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".woff2": "font/woff2",
    };

    const server = createServer((req, res) => {
      let filePath = path.join(DIST, req.url === "/" ? "index.html" : req.url);

      // SPA fallback — always serve the ORIGINAL shell, not a prerendered page
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = SPA_SHELL;
      }

      const ext = path.extname(filePath);
      res.setHeader(
        "Content-Type",
        mimeTypes[ext] || "application/octet-stream"
      );
      fs.createReadStream(filePath).pipe(res);
    });

    server.listen(PORT, () => resolve(server));
  });
}

/* ── 3. Render each route ─────────────────────────────────────────── */
async function prerender() {
  const routes = routesFromSitemap();
  console.log(`Prerendering ${routes.length} routes...\n`);

  // Save a copy of the original SPA shell before we overwrite anything
  fs.copyFileSync(path.join(DIST, "index.html"), SPA_SHELL);

  const server = await serve();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();

  for (const route of routes) {
    const url = `http://localhost:${PORT}${route}`;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for react-helmet-async to flush into the DOM
    await page.evaluate(() => new Promise((r) => setTimeout(r, 300)));

    // Clean up the head: react-helmet-async adds its own tags alongside the
    // static index.html originals. Deduplicate, keeping helmet's versions.
    await page.evaluate(() => {
      const head = document.head;

      // Title: keep ONE title element, set text from document.title (helmet)
      const titles = head.querySelectorAll("title");
      for (let i = 1; i < titles.length; i++) titles[i].remove();
      const titleEl = head.querySelector("title");
      if (titleEl) titleEl.textContent = document.title;

      // Meta tags: for duplicate name/property keys, keep the LAST (helmet's)
      const seen = new Map();
      const metas = [...head.querySelectorAll("meta[name], meta[property]")];
      for (const meta of metas) {
        const key =
          meta.getAttribute("name") || meta.getAttribute("property");
        if (seen.has(key)) seen.get(key).remove();
        seen.set(key, meta);
      }

      // Canonical link: keep the last one
      const canonicals = head.querySelectorAll('link[rel="canonical"]');
      if (canonicals.length > 1) {
        for (let i = 0; i < canonicals.length - 1; i++) canonicals[i].remove();
      }
    });

    let html = await page.content();

    // Inject prerender marker
    html = html.replace(
      "</head>",
      `<meta name="prerender-status" content="200">\n</head>`
    );

    // Write to dist — create subdirectories as needed
    const outDir = path.join(DIST, route === "/" ? "" : route);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html);

    console.log(`  [ok] ${route}`);
  }

  // Clean up the temporary shell copy
  if (fs.existsSync(SPA_SHELL)) fs.unlinkSync(SPA_SHELL);

  await browser.close();
  server.close();
  console.log(`\nDone — ${routes.length} pages prerendered.`);
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
