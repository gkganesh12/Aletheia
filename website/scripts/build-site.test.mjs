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
