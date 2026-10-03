// Checks the generated site: every page is complete for search engines and every internal link lands somewhere.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { build } from "./build-site.mjs";

const { out } = build();
const htmlFiles = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
})(out);

const exists = (url) => {
  const clean = url.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return true;
  const file = path.join(out, clean);
  return fs.existsSync(file) || fs.existsSync(path.join(file, "index.html"));
};

test("builds every route the old site had, plus the new ones", () => {
  const sitemap = fs.readFileSync(path.join(out, "sitemap.xml"), "utf8");
  for (const route of ["/about", "/services", "/services/ai-products", "/products/inscrape", "/industries", "/case-studies/heurisight-rag", "/blog", "/blog/rag-pipeline-architecture-complete-guide", "/contact", "/careers", "/talks", "/privacy", "/cookies"]) {
    assert.ok(exists(route), `missing page ${route}`);
    assert.ok(sitemap.includes(`<loc>https://aletheiaai.tech${route}/</loc>`), `sitemap is missing ${route}/`);
  }
  assert.ok(!sitemap.includes("/404"), "404 page must not be in the sitemap");
});

test("every page has one h1, a title, a description, a canonical URL and valid structured data", () => {
  const titles = new Map();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const rel = path.relative(out, file);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${rel}: expected exactly one h1`);
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
    assert.ok(title && title.length > 10, `${rel}: missing title`);
    assert.ok(!titles.has(title), `${rel}: duplicate title with ${titles.get(title)}`);
    titles.set(title, rel);
    const desc = /<meta name="description" content="([^"]+)"/.exec(html)?.[1];
    assert.ok(desc && desc.length >= 30 && desc.length <= 170, `${rel}: description length ${desc?.length}`);
    assert.match(html, /<link rel="canonical" href="https:\/\/aletheiaai\.tech\//, `${rel}: missing canonical`);
    assert.match(html, /property="og:image"/, `${rel}: missing og:image`);
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
  }
});

test("every internal page link ends in a slash, because the host only serves pages there", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const href = m[1];
      if (href === "/" || /\.[a-z0-9]+$/i.test(href)) continue;
      assert.ok(href.endsWith("/"), `${path.relative(out, file)}: link without trailing slash ${href}`);
    }
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)[1];
    assert.ok(canonical.endsWith("/") || canonical.endsWith(".html"), `${path.relative(out, file)}: canonical ${canonical}`);
  }
});

test("every internal link and local asset resolves", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const m of html.matchAll(/(?:href|src|poster|data-img)="(\/[^"]*)"/g)) {
      assert.ok(exists(m[1]), `${path.relative(out, file)}: broken link ${m[1]}`);
    }
  }
});

test("every image declares its size and has alt text", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const m of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(m[0], /\swidth="\d+"/, `${path.relative(out, file)}: image without dimensions ${m[0].slice(0, 80)}`);
      assert.match(m[0], /\salt="/, `${path.relative(out, file)}: image without alt ${m[0].slice(0, 80)}`);
    }
  }
});

test("titles fit in a search result, and only articles may run long", () => {
  for (const file of htmlFiles) {
    const rel = path.relative(out, file);
    const title = /<title>([^<]+)<\/title>/.exec(fs.readFileSync(file, "utf8"))[1].replace(/&amp;/g, "&");
    if (!/^blog\/.+\//.test(rel)) assert.ok(title.length <= 62, `${rel}: title is ${title.length} characters: ${title}`);
  }
});

test("robots.txt, llms.txt, llms-full.txt and the IndexNow key are published", async () => {
  const { INDEXNOW_KEY } = await import("./build-site.mjs");
  const robots = fs.readFileSync(path.join(out, "robots.txt"), "utf8");
  assert.match(robots, /^User-agent: \*\nAllow: \/$/m);
  assert.match(robots, /^Sitemap: https:\/\/aletheiaai\.tech\/sitemap\.xml$/m);
  assert.ok(!/^Disallow: \/\s*$/m.test(robots), "robots.txt must not block the site");
  for (const bot of ["OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) assert.ok(robots.includes(`User-agent: ${bot}`), `robots.txt does not name ${bot}`);

  const llms = fs.readFileSync(path.join(out, "llms.txt"), "utf8");
  assert.match(llms, /^# Aletheia AI\n\n> /);
  for (const m of llms.matchAll(/\]\(https:\/\/aletheiaai\.tech(\/[^)]*)\)/g)) assert.ok(exists(m[1]), `llms.txt links to a missing page ${m[1]}`);

  const full = fs.readFileSync(path.join(out, "llms-full.txt"), "utf8");
  for (const heading of ["## Services", "## Products", "## Case studies", "## Writing"]) assert.ok(full.includes(heading), `llms-full.txt is missing ${heading}`);
  assert.ok(!/<[a-z][^>]*>/i.test(full), "llms-full.txt should be plain Markdown, not HTML");

  assert.equal(fs.readFileSync(path.join(out, `${INDEXNOW_KEY}.txt`), "utf8"), INDEXNOW_KEY);
});

test("sitemap dates follow the content, not the day of the build", () => {
  const sitemap = fs.readFileSync(path.join(out, "sitemap.xml"), "utf8");
  const stamps = JSON.parse(fs.readFileSync(path.join(out, "..", "site", "data", "lastmod.json"), "utf8"));
  for (const m of sitemap.matchAll(/<loc>https:\/\/aletheiaai\.tech(\/[^<]*)<\/loc><lastmod>([^<]+)<\/lastmod>/g)) {
    const url = m[1] === "/" ? "/" : m[1].replace(/\/$/, "");
    assert.equal(m[2], stamps[url]?.date, `${url}: sitemap date does not match the recorded one`);
  }
  const dates = new Set([...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]));
  assert.ok(dates.size > 1, "every page carries the same date: the recorded dates in data/lastmod.json were lost");
  assert.match(sitemap, /<image:loc>https:\/\/aletheiaai\.tech\/assets\/work\/shot-/);
});

test("the not-found page retries an address that is only missing its trailing slash", () => {
  const html = fs.readFileSync(path.join(out, "404.html"), "utf8");
  assert.match(html, /location\.replace\(p\+"\/"/);
  assert.match(html, /<meta name="robots" content="noindex/);
});

test("every class used in a page has a style rule, so a renamed rule cannot silently unstyle a page", () => {
  const css = ["site.css", "pages.css"].map((f) => fs.readFileSync(path.join(out, "css", f), "utf8")).join("\n").replace(/url\([^)]*\)|\/\*[\s\S]*?\*\//g, "");
  const styled = new Set([...css.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]));
  const hooks = new Set(["bl--1", "def", "dm-linesvg", "hook__l--b", "lens__card--map", "rc--c"]); // script and markup hooks with no styles of their own
  for (const file of htmlFiles) {
    for (const m of fs.readFileSync(file, "utf8").matchAll(/class="([^"]+)"/g)) {
      for (const name of m[1].split(/\s+/).filter(Boolean)) {
        assert.ok(styled.has(name) || hooks.has(name), `${path.relative(out, file)}: class "${name}" has no style rule`);
      }
    }
  }
});
