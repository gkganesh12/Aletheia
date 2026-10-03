// Builds the Aletheia AI website into website/dist as plain HTML with clean URLs.
//
//   node scripts/build-site.mjs
//
// Source lives in website/site: the hand-written homepage (index.html), css/, js/, assets/
// and data/content.json. Every other page is generated here, so the nav, menus, footer,
// cookie notice and all search metadata stay identical across the site. No dependencies.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "site");
const OUT = path.join(ROOT, "dist");
const DATA = JSON.parse(fs.readFileSync(path.join(SRC, "data/content.json"), "utf8"));

const SITE = "https://aletheiaai.tech";
const NAME = "Aletheia AI";
const MAIL = "info@aletheiaai.tech";
const TODAY = new Date().toISOString().slice(0, 10);
const SOCIAL = {
  LinkedIn: "https://www.linkedin.com/company/aletheiaaitech",
  GitHub: "https://github.com/Aletheia-Ai-tech",
  X: "https://x.com/ai_aletheia",
};

// Search engine ownership tokens. Verifying by DNS needs nothing here; to verify with a tag instead,
// paste the token the console gives you and rebuild.
const VERIFY = { google: "", bing: "" };
// IndexNow: Bing, Yandex, Naver and Seznam fetch /<key>.txt to confirm URL submissions really come from this site.
export const INDEXNOW_KEY = "077c367aeb370bc6d382f00d1e3c0450";
export { SITE };

const e = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const lis = (xs) => xs.map((x) => `<li>${e(x)}</li>`).join("");
const niceDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const version = (rel) => crypto.createHash("sha1").update(fs.readFileSync(path.join(SRC, rel))).digest("hex").slice(0, 8);
const asset = (rel) => `/${rel}?v=${version(rel)}`;

/* ───────────────────────── image dimensions (so pages never jump while loading) ───────────────────────── */
function imageSize(file) {
  const b = fs.readFileSync(file);
  if (b.toString("ascii", 1, 4) === "PNG") return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b.toString("ascii", 0, 4) === "RIFF") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (kind === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (kind === "VP8L") { const n = b.readUInt32LE(21); return [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1]; }
  }
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length) {
      const marker = b[i + 1], len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xc3) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  }
  return null;
}
/** Adds width/height to every local <img>, and lazy-loads the ones marked as below the fold. */
function sizeImages(html, { lazyAfter } = {}) {
  const cut = lazyAfter ? html.indexOf(lazyAfter) : 0;
  return html.replace(/<img\b[^>]*>/g, (tag, at) => {
    const src = /src="\/(assets\/[^"?]+)/.exec(tag)?.[1];
    if (!src) return tag;
    let out = tag;
    if (!/\swidth=/.test(tag)) {
      const size = imageSize(path.join(SRC, src));
      if (size) out = out.replace(/\s*\/?>$/, ` width="${size[0]}" height="${size[1]}" />`);
    }
    if (cut >= 0 && at > cut && !/\sloading=/.test(out)) out = out.replace(/\s*\/?>$/, ' loading="lazy" decoding="async" />');
    return out;
  });
}

/* ───────────────────────── shared chrome ───────────────────────── */
const nav = (tone = "dark") => `<a class="skip" href="#top">Skip to content</a>

  <header class="nav" data-tone="${tone}">
    <a class="nav__brand" href="/" aria-label="${NAME}, home">
      <img class="logo logo--dark" src="/assets/brand/logo.png" alt="${NAME}" width="826" height="160" />
      <img class="logo logo--light" src="/assets/brand/logo-light.png" alt="" aria-hidden="true" width="826" height="160" />
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="/#work">Work</a>
      <a href="/services">Services</a>
      <div class="nav__dd">
        <button type="button" aria-haspopup="true">Resources <i aria-hidden="true">+</i></button>
        <div class="nav__menu"><a href="/blog">Blog</a><a href="/case-studies">Case studies</a><a href="/talks">Technical talks</a></div>
      </div>
      <div class="nav__dd">
        <button type="button" aria-haspopup="true">Company <i aria-hidden="true">+</i></button>
        <div class="nav__menu"><a href="/about">About us</a><a href="/careers">Careers</a><a href="/contact">Contact</a></div>
      </div>
    </nav>
    <div class="nav__end">
      <a class="nav__cta" href="/contact"><span>Start a project</span><i aria-hidden="true">↗</i></a>
      <button class="nav__burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
    </div>
  </header>

  <div class="menu" aria-hidden="true">
    <div><h4>Studio</h4><a href="/#work">Work</a><a href="/services">Services</a><a href="/products">Products</a><a href="/industries">Industries</a></div>
    <div><h4>Resources</h4><a href="/blog">Blog</a><a href="/case-studies">Case studies</a><a href="/talks">Technical talks</a></div>
    <div><h4>Company</h4><a href="/about">About us</a><a href="/careers">Careers</a><a href="/contact">Contact</a></div>
    <div class="menu__foot"><a href="mailto:${MAIL}">${MAIL}</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a></div>
  </div>`;

const footer = () => `<footer class="foot">
        <div class="foot__cols">
          <div><h4>Studio</h4><a href="/#work">Work</a><a href="/services">Services</a><a href="/products">Products</a><a href="/industries">Industries</a></div>
          <div><h4>Resources</h4><a href="/blog">Blog</a><a href="/case-studies">Case studies</a><a href="/talks">Technical talks</a></div>
          <div><h4>Company</h4><a href="/about">About us</a><a href="/careers">Careers</a><a href="/contact">Contact</a></div>
          <div><h4>Legal</h4><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a></div>
          <div><h4>Elsewhere</h4>${Object.entries(SOCIAL).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k}</a>`).join("")}<p>Pune, India</p></div>
        </div>
        <div class="foot__base"><span>© ${new Date().getFullYear()} ${NAME}</span><span>Design &amp; engineering, nothing hidden.</span></div>
        <div class="foot__word" aria-hidden="true">Aletheia</div>
      </footer>`;

const COOKIE = `<div class="cookie" role="dialog" aria-label="Cookies" hidden>
    <p>We use two analytics cookies to see which pages get read. Nothing else, no ads. <a href="/cookies">Details</a></p>
    <div class="cookie__row"><button type="button" data-cookie="accept">That’s fine</button><button type="button" data-cookie="decline">No thanks</button></div>
  </div>`;

const start = (h = "Have a hard problem?<br /><em>Let’s build the answer.</em>") => `<section class="start" id="start" data-tone="light">
      <div class="start__grid" aria-hidden="true"></div>
      <div class="start__in">
        <p class="eyebrow">[ Your turn ]</p>
        <h2 class="start__h">${h}</h2>
        <div class="start__row">
          <a class="btn" href="/contact"><span>Start a project</span><i>↗</i></a>
          <a class="start__mail" href="mailto:${MAIL}">${MAIL}</a>
        </div>
      </div>
      ${footer()}
    </section>`;

/* ───────────────────────── search metadata ───────────────────────── */
const ORG = {
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: NAME,
  url: SITE,
  logo: { "@type": "ImageObject", url: `${SITE}/assets/brand/logo.png`, width: 826, height: 160 },
  image: `${SITE}/assets/brand/og.png`,
  email: MAIL,
  description: "Design and engineering studio building AI products, MVPs, websites, software, security and data systems.",
  contactPoint: { "@type": "ContactPoint", contactType: "sales", email: MAIL, url: `${SITE}/contact`, availableLanguage: "English" },
  areaServed: "Worldwide",
  knowsAbout: DATA.services.map((s) => s.name),
  foundingLocation: { "@type": "Place", name: "Pune, India" },
  address: { "@type": "PostalAddress", addressLocality: "Pune", addressRegion: "Maharashtra", addressCountry: "IN" },
  founder: {
    "@type": "Person", "@id": `${SITE}/about/#founder`, name: "Ganesh Khetawat", jobTitle: "Founder & CEO", url: `${SITE}/about`,
    sameAs: ["https://www.linkedin.com/in/ganeshkhetawat/", "https://github.com/gkganesh12"],
  },
  sameAs: Object.values(SOCIAL),
};
const ld = (obj) => ({ "@context": "https://schema.org", ...obj });
const crumbs = (trail) => ld({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...trail].map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + url })),
});
const faqLd = (items) => ld({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
});

/** Search results cut descriptions at about 160 characters; trim on a word so ours end cleanly. */
const clip = (text, max = 158) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "").replace(/[,;:.]$/, "")}…`);

function head({ url, title, desc: rawDesc, type = "website", jsonLd = [], article, noindex, inner = true }) {
  const desc = clip(rawDesc);
  // results cut titles near 60 characters, so the studio name is left off when a title has no room for it
  const full = url === "/" || `${title} | ${NAME}`.length > 60 ? title : `${title} | ${NAME}`;
  const canonical = SITE + (url === "/" ? "/" : url);
  const image = `${SITE}/assets/brand/og.png`;
  return `<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${e(full)}</title>
  <meta name="description" content="${e(desc)}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"}" />
  <meta name="author" content="${NAME}" />${VERIFY.google ? `
  <meta name="google-site-verification" content="${e(VERIFY.google)}" />` : ""}${VERIFY.bing ? `
  <meta name="msvalidate.01" content="${e(VERIFY.bing)}" />` : ""}
  <meta name="theme-color" content="#f5f0e6" />
  <meta property="og:site_name" content="${NAME}" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:type" content="${type}" />
  <meta property="og:title" content="${e(full)}" />
  <meta property="og:description" content="${e(desc)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${NAME}: design and engineering studio" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ai_aletheia" />
  <meta name="twitter:title" content="${e(full)}" />
  <meta name="twitter:description" content="${e(desc)}" />
  <meta name="twitter:image" content="${image}" />${article ? `
  <meta property="article:published_time" content="${article.date}" />
  <meta property="article:author" content="${e(article.author)}" />
  <meta property="article:section" content="${e(article.section)}" />` : ""}
  <link rel="icon" href="/assets/brand/favicon.png" type="image/png" />
  <link rel="apple-touch-icon" href="/assets/brand/favicon.png" />
  <link rel="alternate" type="application/rss+xml" title="${NAME} blog" href="/blog/feed.xml" />
  <link rel="preload" href="/assets/fonts/BricolageGrotesque-var.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/assets/fonts/Fraunces-Italic-var.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="${asset("css/site.css")}" />${inner ? `
  <link rel="stylesheet" href="${asset("css/pages.css")}" />` : ""}
${jsonLd.map((j) => `  <script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>`;
}

const scripts = (names) => names.map((n) => `  <script src="${asset(n)}" defer></script>`).join("\n");
const VENDOR = ["assets/vendor/gsap.min.js", "assets/vendor/ScrollTrigger.min.js", "assets/vendor/SplitText.min.js"];

/* ───────────────────────── addresses ─────────────────────────
   The host serves a page only at its trailing-slash address (/about/). Without the slash it falls
   through to the host's catch-all and returns the homepage. So every link, canonical URL and
   sitemap entry uses the slash form. */
const slash = (url) => (url === "/" || url.endsWith("/") || /\.[a-z0-9]+$/i.test(url) ? url : `${url}/`);
function withSlashes(html) {
  return html
    // internal links: /about → /about/, /blog/x#y → /blog/x/#y; files and "/" and "/#work" are left alone
    .replace(/href="(\/[^"#?]*[^"#?/.][^"#?.]*)([#?][^"]*)?"/g, (m, p, rest = "") => (/\.[a-z0-9]+$/i.test(p) ? m : `href="${p}/${rest}"`))
    // absolute URLs in canonical, Open Graph and structured data
    .replace(/"(https:\/\/aletheiaai\.tech\/[^"#?]*[^"#?/])"/g, (m, u) => (/\.[a-z0-9]+$/i.test(u) ? m : `"${u}/"`));
}

/** If the host hands this document out for an address it does not belong to, move to the right one. */
const guard = (self) => `<script>(function(){var p=location.pathname,s=${JSON.stringify(self)};if(p===s||p===s+"index.html")return;if(p.slice(-1)!=="/"&&!/\\.[a-z0-9]+$/i.test(p))location.replace(p+"/"+location.search+location.hash);else location.replace("/404.html");})();</script>`;

/** On the not-found page: an address typed without its trailing slash gets one more try at the real page. */
const SLASH_GUARD = `<script>(function(){var p=location.pathname;if(p.slice(-1)!=="/"&&!/\\.[a-z0-9]+$/i.test(p))location.replace(p+"/"+location.search+location.hash);})();</script>`;

/* Each article points at the service it relates to, and each service at its articles and case studies,
   so readers (and crawlers) can get from writing to work and back. */
const SERVICE_FOR = {
  AI: ["ai-products", "AI product engineering"], Building: ["mvp-development", "MVP development"],
  Cybersecurity: ["cybersecurity", "cybersecurity and auditing"], Engineering: ["full-stack", "full-stack development"],
  Research: ["data-ml", "data engineering and ML"],
};

/* ───────────────────────── page assembly ───────────────────────── */
const pages = []; // { url, lastmod, priority, images } for the sitemap

/* Sitemap dates move only when a page's own content does, so search engines can trust them.
   data/lastmod.json remembers each page's content fingerprint and the day it last changed. Commit it with content changes. */
const STAMPS_FILE = path.join(SRC, "data/lastmod.json");
const stamps = fs.existsSync(STAMPS_FILE) ? JSON.parse(fs.readFileSync(STAMPS_FILE, "utf8")) : {};
function stamp(url, content, firstSeen = TODAY) {
  const hash = crypto.createHash("sha1").update(content.replace(/\?v=[0-9a-f]{8}/g, "")).digest("hex").slice(0, 12);
  const was = stamps[url];
  if (was?.hash === hash) return was.date;
  stamps[url] = { hash, date: was ? TODAY : firstSeen };
  return stamps[url].date;
}
/** The page's own pictures (not the logo), for the image entries in the sitemap. */
const imagesIn = (html) => [...new Set([...html.matchAll(/<img\b[^>]*\ssrc="\/(assets\/(?!brand\/)[^"?]+)/g)].map((m) => `${SITE}/${m[1]}`))];

function write(url, html) {
  const file = url.endsWith(".html") || url.endsWith(".xml") || url.endsWith(".txt")
    ? path.join(OUT, url)
    : path.join(OUT, url, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, file.endsWith(".html") ? withSlashes(html) : html);
}

function page({ url, title, desc, body, tone = "dark", cls = "", type, jsonLd = [], article, trail, lastmod, fingerprint, priority = 0.7, noindex = false, cta }) {
  const all = [ld(ORG), ...(trail ? [crumbs(trail)] : []), ...jsonLd];
  const html = `<!doctype html>
<html lang="en">
${head({ url, title, desc, type, jsonLd: all, article, noindex })}
<body class="page ${cls}">

  ${nav(tone)}

  <div class="progress" aria-hidden="true"><i></i></div>

  <main id="top">
${body}

    ${start(cta)}
  </main>

  ${COOKIE}

${scripts([...VENDOR, "assets/vendor/lenis.min.js", "js/chrome.js", "js/page.js"])}
</body>
</html>
`;
  const out = sizeImages(html, { lazyAfter: "</section>" });
  write(url === "/404" ? "/404.html" : url, url === "/404" ? out.replace("<head>", `<head>\n  ${SLASH_GUARD}`) : out);
  // articles are fingerprinted by their own words, so a change to the shared template does not re-date all of them
  if (!noindex) pages.push({ url, lastmod: stamp(url, fingerprint || body, lastmod), priority, images: imagesIn(out) });
}

const hero = (eyebrow, h1, lede, cls = "", tone = "dark") => `    <section class="phero ${cls}" data-tone="${tone}">
      <p class="eyebrow">[ ${eyebrow} ]</p>
      <h1>${h1}</h1>
      <p class="phero__lede">${lede}</p>
    </section>`;

const field = (label, name, kind = "text", { required = false, full = false, extra = "" } = {}) => {
  const control = kind === "textarea"
    ? `<textarea id="f-${name}" name="${name}" rows="5"${required ? " required" : ""} ${extra}></textarea>`
    : `<input id="f-${name}" name="${name}" type="${kind}"${required ? " required" : ""} ${extra} />`;
  return `<div class="field${full ? " field--full" : ""}"><label for="f-${name}">${label}${required ? "" : " <i>optional</i>"}</label>${control}</div>`;
};

const faqBlock = (items) => `<div class="roles">${items.map((f) => `
        <details class="role faq">
          <summary><h3>${e(f.question)}</h3><i aria-hidden="true">+</i></summary>
          <div class="role__body"><p class="role__lede">${e(f.answer)}</p></div>
        </details>`).join("")}
      </div>`;

/* ───────────────────────── home ───────────────────────── */
function buildHome() {
  let html = fs.readFileSync(path.join(SRC, "index.html"), "utf8");
  const lastmod = stamp("/", html);
  const swap = (re, to) => {
    if (!re.test(html)) throw new Error(`home: pattern not found: ${re}`);
    html = html.replace(re, to);
  };
  const title = "Aletheia AI | AI & Software Development Studio in Pune, India";
  const desc = "Aletheia AI is a design and engineering studio in Pune, India. We build AI products, MVPs, websites and software, and run security audits, for teams anywhere.";
  const jsonLd = [
    ld(ORG),
    ld({ "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE, name: NAME, description: desc, publisher: { "@id": `${SITE}/#organization` }, inLanguage: "en" }),
    ld({
      "@type": "ItemList", name: "Services",
      itemListElement: DATA.services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE}/services/${s.slug}` })),
    }),
  ];
  swap(/<head>[\s\S]*?<\/head>/, head({ url: "/", title, desc, jsonLd, inner: false }).replace("<head>", `<head>\n  ${guard("/")}`));
  swap(/<header class="nav"[\s\S]*?<\/header>(\s*<div class="menu"[\s\S]*?\n {2}<\/div>)?/, nav());
  swap(/<footer class="foot">[\s\S]*?<\/footer>/, footer());
  swap(/<div class="cookie"[\s\S]*?\n {2}<\/div>/, COOKIE);
  swap(/( *<script src="[^"]+"><\/script>\n)+/, `${scripts([...VENDOR, "assets/vendor/DrawSVGPlugin.min.js", "assets/vendor/lenis.min.js", "js/chrome.js", "js/main.js"])}\n`);
  html = html.replace(/(src|poster|data-img)="assets\//g, '$1="/assets/');
  const out = sizeImages(html, { lazyAfter: '<section class="work"' });
  write("/", out);
  pages.push({ url: "/", lastmod, priority: 1, images: imagesIn(out) });
}

/* ───────────────────────── about ───────────────────────── */
function buildAbout() {
  const values = [
    ["01", "Ship it", "We measure success by what’s live in production. Not slide decks, not prototypes gathering dust."],
    ["02", "Engineering first", "Strong engineering is our identity. We solve problems with code, not meetings."],
    ["03", "Integrity", "Aletheia means truth. Transparent with clients, honest about timelines, no vaporware."],
    ["04", "Own the problem", "We understand the business context, own the outcome and build solutions that work."],
  ];
  const body = `${hero("About us", "A studio that tells you <em>the truth.</em>", "Aletheia is Greek for truth, or disclosure. It’s the principle behind everything we build, and the way we work with the people we build it for.")}

    <section class="sheet sheet--night" data-tone="light">
      <p class="eyebrow">[ Why we exist ]</p>
      <h2 class="big">Most AI products are either impressive in isolation <em>or useless in real workflows.</em></h2>
      <div class="cols">
        <p>${NAME} was built to change that. We create intelligent systems that fit into how people already work, delivering outcomes, not just outputs.</p>
        <p class="strong">No fluff. No hype. Just systems that work.</p>
      </div>
    </section>

    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ What we hold to ]</p>
      <div class="values">${values.map(([n, t, d]) => `<article class="value"><span>${n}</span><h3>${e(t)}</h3><p>${e(d)}</p></article>`).join("")}</div>
    </section>

    <section class="sheet sheet--blush" data-tone="dark">
      <div class="founder">
        <figure class="founder__pic"><img src="/assets/about/ganesh.webp" alt="Ganesh Khetawat, founder of ${NAME}" /></figure>
        <div class="founder__txt">
          <p class="eyebrow">[ Founder ]</p>
          <h2>A builder at the intersection of AI, systems and <em>real-world problem solving.</em></h2>
          <p>Ganesh Khetawat is pursuing a degree in computer science and has worked across full-stack development, cybersecurity and applied AI, building products that go beyond demos and are judged on whether people can use them.</p>
          <p>What sets his work apart is a simple principle: <b>technology should solve real problems, not just showcase intelligence.</b> That belief led to ${NAME}.</p>
          <div class="links"><a href="https://www.linkedin.com/in/ganeshkhetawat/" target="_blank" rel="noopener">LinkedIn ↗</a><a href="https://github.com/gkganesh12" target="_blank" rel="noopener">GitHub ↗</a></div>
        </div>
      </div>
    </section>

    <section class="sheet sheet--paper2" data-tone="dark">
      <p class="eyebrow">[ Where ]</p>
      <h2 class="big">Pune, India. <em>Working with teams wherever they are.</em></h2>
      <div class="links"><a href="/services">What we do →</a><a href="/case-studies">What we’ve built →</a><a href="/careers">Work with us →</a></div>
    </section>`;
  page({
    url: "/about", title: "About: an engineering-first AI studio in Pune",
    desc: "Aletheia AI is an engineering-first studio founded in Pune by Ganesh Khetawat. Aletheia means truth: honest timelines, real systems, nothing hidden.",
    body, trail: [["About", "/about"]], priority: 0.8,
    jsonLd: [ld({ "@type": "AboutPage", url: `${SITE}/about`, name: `About ${NAME}`, mainEntity: { "@id": `${SITE}/#organization` } })],
  });
}

/* ───────────────────────── careers ───────────────────────── */
function buildCareers() {
  const roles = DATA.careers.map((j) => {
    const meta = [j.department, j.type, j.experience, j.location].filter(Boolean);
    return `
        <details class="role" id="${j.id}">
          <summary><h3>${e(j.title)}</h3><div class="role__meta">${meta.map((m) => `<span>${e(m)}</span>`).join("")}</div><i aria-hidden="true">+</i></summary>
          <div class="role__body">
            <p class="role__lede">${e(j.description)}</p>
            <div class="role__cols">
              <div><h4>What you’ll do</h4><ul>${lis(j.responsibilities)}</ul></div>
              <div><h4>What we look for</h4><ul>${lis(j.requirements)}</ul></div>
            </div>
            <p class="role__note"><b>To apply:</b> ${e(j.applicationNote)}</p>
            <a class="btn btn--ink" href="#apply" data-role="${e(j.title)}"><span>Apply for this role</span><i>↓</i></a>
          </div>
        </details>`;
  }).join("");
  const body = `${hero("Careers", "Come build things <em>that ship.</em>", `You’ll contribute to ${NAME} products and client work from the start. Show us something you’ve built and can explain.`, "phero--cobalt", "light")}

    <section class="sheet" data-tone="dark">
      <h2 class="eyebrow">[ Open roles · ${DATA.careers.length} ]</h2>
      <div class="roles">${roles}
      </div>
    </section>

    <section class="sheet sheet--night" id="apply" data-tone="light">
      <p class="eyebrow">[ Apply ]</p>
      <h2 class="big">Tell us what you’ve built, <em>and which part was yours.</em></h2>
      <form class="form" data-form="career" novalidate>
        <div class="field field--full"><label for="f-position">Role</label><select id="f-position" name="position" required>${DATA.careers.map((j) => `<option>${e(j.title)}</option>`).join("")}</select></div>
        ${field("Full name", "name", "text", { required: true, extra: 'minlength="2" autocomplete="name"' })}
        ${field("Email", "email", "email", { required: true, extra: 'autocomplete="email"' })}
        ${field("Phone", "phone", "tel", { extra: 'autocomplete="tel"' })}
        ${field("Portfolio, GitHub or project link", "portfolio", "url", { extra: 'placeholder="https://"' })}
        ${field("Referral code", "referralCode", "text", { extra: 'maxlength="40"' })}
        ${field("What you built, and your part in it", "message", "textarea", { required: true, full: true, extra: 'minlength="10"' })}
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <div class="form__end"><button class="btn" type="submit"><span>Send application</span><i>↗</i></button><p class="form__status" role="status" aria-live="polite"></p></div>
      </form>
    </section>`;
  page({
    url: "/careers", title: "Careers: engineering and design roles",
    desc: `Open roles at Aletheia AI in Pune: ${DATA.careers.map((j) => j.title).join(", ")}. Apply with something you’ve built.`,
    body, tone: "light", trail: [["Careers", "/careers"]], priority: 0.7,
  });
}

/* ───────────────────────── contact ───────────────────────── */
function buildContact() {
  const options = ["AI Product Engineering", "MVP & Rapid Prototyping", "Full-Stack Development", "Cybersecurity & Auditing", "Blockchain & Web3", "Data Engineering & ML", "Other"];
  const body = `${hero("Contact", "Tell us what you’re <em>building.</em>", "Drop us a message and we’ll get back to you within 24 hours.", "phero--short")}

    <section class="sheet sheet--night" data-tone="light">
      <div class="contact">
        <form class="form brief" data-form="contact" novalidate>
          <header class="brief__h field--full"><p class="eyebrow">[ Project brief ]</p><p>Six short fields. A rough idea is enough.</p></header>
          ${field("Full name", "name", "text", { required: true, extra: 'minlength="2" autocomplete="name"' })}
          ${field("Work email", "email", "email", { required: true, extra: 'autocomplete="email"' })}
          ${field("Company", "company", "text", { extra: 'autocomplete="organization"' })}
          ${field("Phone", "phone", "tel", { extra: 'autocomplete="tel"' })}
          <div class="field field--full"><span class="field__l" id="l-service">What do you need?</span><div class="brief__opts" role="radiogroup" aria-labelledby="l-service">${options.map((o, i) => `<label class="brief__opt"><input type="radio" name="service" value="${e(o)}"${i ? "" : " required"} /><span>${e(o)}</span></label>`).join("")}</div></div>
          ${field("How can we help?", "message", "textarea", { required: true, full: true, extra: 'minlength="10" placeholder="What you’re building, your timeline, and a budget range if you have one."' })}
          <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <div class="form__end"><button class="btn btn--ink" type="submit"><span>Send message</span><i>↗</i></button><p class="form__status" role="status" aria-live="polite"></p></div>
        </form>
        <aside class="contact__side">
          <div class="contact__next">
            <h2>What happens next</h2>
            <ol>
              <li><b>You send the brief.</b><span>Even a rough idea is enough to start.</span></li>
              <li><b>We reply within 24 hours.</b><span>On business days. Urgent? Email us directly.</span></li>
              <li><b>We set up a call.</b><span>And help you shape the scope from there.</span></li>
            </ol>
          </div>
          <div class="contact__info">
            <div><h2>Email</h2><a href="mailto:${MAIL}">${MAIL}</a></div>
            <div><h2>Where</h2><p>Pune, Maharashtra, India</p><p class="clock" data-clock="Asia/Kolkata" hidden></p></div>
            <div><h2>Elsewhere</h2><p class="contact__links">${Object.entries(SOCIAL).map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k} ↗</a>`).join("")}</p></div>
          </div>
        </aside>
      </div>
    </section>

    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ Before you write ]</p>
      <h2 class="big">Questions people ask <em>first.</em></h2>
      ${faqBlock(DATA.faq.contact)}
    </section>`;
  page({
    url: "/contact", title: "Contact: start a project",
    desc: "Tell Aletheia AI what you’re building. AI products, MVPs, websites, software, security or data: we reply within 24 hours.",
    body, trail: [["Contact", "/contact"]], priority: 0.8,
    jsonLd: [ld({ "@type": "ContactPage", url: `${SITE}/contact`, name: `Contact ${NAME}`, mainEntity: { "@id": `${SITE}/#organization` } }), faqLd(DATA.faq.contact)],
  });
}

/* ───────────────────────── blog ───────────────────────── */
function buildBlog() {
  const posts = [...DATA.blog].sort((a, b) => b.date.localeCompare(a.date));
  const cats = [...new Set(posts.map((p) => p.category))].sort();
  const rows = posts.map((p) => `
        <a class="post" href="/blog/${p.slug}" data-cat="${e(p.category)}">
          <span class="post__meta"><time datetime="${p.date}">${niceDate(p.date)}</time><b>${e(p.category)}</b></span>
          <h2>${e(p.title)}</h2>
          <p>${e(p.excerpt)}</p>
          <span class="post__read">${e(p.readTime)} <i aria-hidden="true">→</i></span>
        </a>`).join("");
  const body = `${hero("Blog", "Notes from <em>the workbench.</em>", "Long reads on building AI, software and security that hold up once real people start using them.")}

    <section class="sheet sheet--paper2" data-tone="dark">
      <div class="filters"><button type="button" class="is-on" data-filter="*">All</button>${cats.map((c) => `<button type="button" data-filter="${e(c)}">${e(c)}</button>`).join("")}</div>
      <div class="posts">${rows}
      </div>
    </section>`;
  page({
    url: "/blog", title: "Blog: AI engineering, software and security",
    desc: "Practical writing from Aletheia AI on RAG pipelines, multi-agent systems, LLM security, MVPs and shipping software that works in production.",
    body, trail: [["Blog", "/blog"]], priority: 0.9, lastmod: posts[0].date, fingerprint: posts.map((p) => p.slug + p.title + p.excerpt).join("\n"),
    jsonLd: [ld({
      "@type": "Blog", url: `${SITE}/blog`, name: `${NAME} blog`, publisher: { "@id": `${SITE}/#organization` },
      blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}`, datePublished: p.date })),
    })],
  });

  posts.forEach((p, i) => {
    const svc = SERVICE_FOR[p.category];
    const paras = p.content.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
    const next = posts[(i + 1) % posts.length];
    const related = posts.filter((o) => o.category === p.category && o.slug !== p.slug).slice(0, 3);
    const body = `    <article class="article" data-tone="dark">
      <a class="back" href="/blog">← All writing</a>
      <p class="eyebrow">[ ${e(p.category)} · <time datetime="${p.date}">${niceDate(p.date)}</time> · ${e(p.readTime)} ]</p>
      <h1>${e(p.title)}</h1>
      <p class="article__lede">${e(p.excerpt)}</p>
      <div class="prose">${paras.map((x) => `<p>${e(x)}</p>`).join("")}</div>
      <p class="article__by">Written by <a href="/about">${e(p.author)}</a>, founder of ${NAME}</p>
      ${svc ? `<p class="article__cta">Need this built? See our <a href="/services/${svc[0]}">${svc[1]}</a> work, or <a href="/contact">tell us what you’re building</a>.</p>` : ""}
      ${related.length ? `<nav class="related" aria-label="Related writing"><h2>More on ${e(p.category)}</h2>${related.map((o) => `<a href="/blog/${o.slug}">${e(o.title)}</a>`).join("")}</nav>` : ""}
      <a class="next" href="/blog/${next.slug}"><span>Read next</span><b>${e(next.title)}</b><i aria-hidden="true">→</i></a>
    </article>`;
    page({
      url: `/blog/${p.slug}`, title: p.title, desc: p.excerpt, body, type: "article",
      article: { date: p.date, author: p.author, section: p.category },
      trail: [["Blog", "/blog"], [p.title, `/blog/${p.slug}`]], lastmod: p.date, fingerprint: [p.title, p.excerpt, p.content].join("\n"), priority: 0.6,
      jsonLd: [ld({
        "@type": "BlogPosting", headline: p.title, description: p.excerpt, datePublished: p.date, dateModified: p.date,
        articleSection: p.category, wordCount: p.content.split(/\s+/).length, inLanguage: "en",
        author: { "@type": "Person", "@id": ORG.founder["@id"], name: p.author, url: `${SITE}/about` }, publisher: { "@id": `${SITE}/#organization` },
        image: `${SITE}/assets/brand/og.png`, url: `${SITE}/blog/${p.slug}`, mainEntityOfPage: `${SITE}/blog/${p.slug}`,
        isPartOf: { "@type": "Blog", name: `${NAME} blog`, url: `${SITE}/blog` },
      })],
    });
  });

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${NAME} blog</title><link>${SITE}/blog/</link><description>Writing from ${NAME} on AI engineering, software and security.</description><language>en</language>
${posts.map((p) => `<item><title>${e(p.title)}</title><link>${SITE}/blog/${p.slug}/</link><guid>${SITE}/blog/${p.slug}/</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate><description>${e(p.excerpt)}</description></item>`).join("\n")}
</channel></rss>
`;
  write("/blog/feed.xml", rss);
}

/* ───────────────────────── case studies ───────────────────────── */
function buildCases() {
  const shot = {
    "heurisight-rag": '<img src="/assets/work/heuri-dash2.webp" alt="HeuriSight learner dashboard showing assessments and competency scores" />',
    "inscrape-sdk": '<img src="/assets/work/pypi.webp" alt="Inscrape package page on the Python Package Index" />',
    "codecraft-cli": '<pre><span class="c">$</span> npm i -g @gkganesh12/codecraft-cli\n<span class="c">$</span> codecraft init\n<b>›</b> /plan   <span class="c">scope the change</span>\n<b>›</b> /code   <span class="c">write inside the guard</span>\n<b>›</b> /verify <span class="c">check it against the rules</span></pre>',
  };
  const tint = ["sheet--lilac", "sheet--blush", "sheet--paper2", "sheet--mint"];
  const section = (c, i, { heading = "h2", link = false } = {}) => `
    <section class="sheet case ${tint[i % 4]}" id="${c.slug}" data-tone="dark">
      <header class="case__head">
        <span class="case__n" aria-hidden="true">0${i + 1}</span>
        <p class="eyebrow">[ ${e(c.industry)} · ${e(c.service)} ]</p>
        <${heading}>${link ? `<a href="/case-studies/${c.slug}">${e(c.title)}</a>` : e(c.title)}</${heading}>
        <p class="case__client">${e(c.client)}</p>
      </header>
      ${shot[c.slug] ? `<figure class="case__shot">${shot[c.slug]}</figure>` : ""}
      <div class="case__grid">
        <div><h3>The problem</h3><p>${e(c.challenge)}</p></div>
        <div><h3>What we built</h3><p>${e(c.solution)}</p></div>
      </div>
      <ol class="case__phases">${c.approach.map((a) => `<li><b>${e(a.phase.split(": ").slice(1).join(": ") || a.phase)}</b><span>${e(a.description)}</span></li>`).join("")}</ol>
      <div class="case__results">${c.results.map((r) => `<div><b>${e(r.value)}</b><span>${e(r.label)}</span></div>`).join("")}</div>
      <div class="chips">${c.techStack.map((t) => `<span>${e(t)}</span>`).join("")}</div>
      ${link ? `<a class="btn btn--ink" href="/case-studies/${c.slug}"><span>Open this case study</span><i>↗</i></a>` : ""}
    </section>`;

  page({
    url: "/case-studies", title: "Case Studies: AI Products We Shipped",
    desc: "How Aletheia AI built HeuriSight’s AI assessment platform, the Inscrape SDK, the CodeCraft CLI and more: the problem, the build and what it does now.",
    body: `${hero("Case studies", "Proof, <em>in production.</em>", "What the problem was, what we built and what it does now. Told plainly.", "phero--night", "light")}
${DATA.cases.map((c, i) => section(c, i, { link: true })).join("")}`,
    tone: "light", trail: [["Case studies", "/case-studies"]], priority: 0.9,
    jsonLd: [ld({ "@type": "ItemList", name: "Case studies", itemListElement: DATA.cases.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: `${SITE}/case-studies/${c.slug}` })) })],
  });

  DATA.cases.forEach((c, i) => {
    const next = DATA.cases[(i + 1) % DATA.cases.length];
    page({
      url: `/case-studies/${c.slug}`, title: c.title,
      desc: c.challenge,
      body: `${hero(`Case study · ${e(c.industry)}`, e(c.title), `${e(c.client)} · ${e(c.service)}`, "phero--night phero--short", "light")}
${section(c, i, { heading: "h2" }).replace(`<h2>${e(c.title)}</h2>`, `<h2>${e(c.client)}</h2>`).replace(`<p class="case__client">${e(c.client)}</p>`, "")}

    <section class="sheet" data-tone="dark">
      <a class="next" href="/case-studies/${next.slug}"><span>Next case study</span><b>${e(next.title)}</b><i aria-hidden="true">→</i></a>
    </section>`,
      tone: "light", type: "article",
      trail: [["Case studies", "/case-studies"], [c.title, `/case-studies/${c.slug}`]], priority: 0.7,
      jsonLd: [ld({ "@type": "Article", headline: c.title, description: c.challenge, about: c.industry, author: { "@id": `${SITE}/#organization` }, publisher: { "@id": `${SITE}/#organization` }, mainEntityOfPage: `${SITE}/case-studies/${c.slug}` })],
    });
  });
}

/* ───────────────────────── services ───────────────────────── */
function buildServices() {
  const rows = DATA.services.map((s, i) => `
        <a class="post svc" href="/services/${s.slug}">
          <span class="post__meta">0${i + 1}<b>${e(s.overline)}</b></span>
          <h2>${e(s.name)}</h2>
          <p>${e(s.description)}</p>
          <span class="post__read">Details <i aria-hidden="true">→</i></span>
        </a>`).join("");
  page({
    url: "/services", title: "AI, Software, Security & Data Services",
    desc: "Six things Aletheia AI builds: AI products, MVPs and prototypes, full-stack software, cybersecurity audits, data and ML systems, and Web3. All shipped to production.",
    body: `${hero("Services", "Six things we build, <em>and build properly.</em>", "From a first prototype to a system that runs your business. Pick the one that sounds like your problem.", "phero--cobalt", "light")}

    <section class="sheet sheet--paper2" data-tone="dark">
      <div class="posts">${rows}
      </div>
    </section>

    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ Good to know ]</p>
      <h2 class="big">Questions we get <em>most.</em></h2>
      ${faqBlock(DATA.faq.home)}
    </section>`,
    tone: "light", trail: [["Services", "/services"]], priority: 0.9,
    jsonLd: [
      ld({ "@type": "ItemList", name: "Services", itemListElement: DATA.services.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE}/services/${s.slug}` })) }),
      faqLd(DATA.faq.home),
    ],
  });

  // what people type when they are looking to hire for each service, and a description written to be read whole in a result
  const seo = {
    "ai-products": ["AI Product Development Services", "AI product development from Aletheia AI: LLM applications, multi-agent systems, RAG pipelines, computer vision and NLP, built to run in production."],
    "mvp-development": ["MVP Development Services for Startups", "MVP development for founders: we scope, build and deploy a working first version in weeks, on a codebase you can keep growing instead of throwing away."],
    "full-stack": ["Full-Stack Web Development Services", "Full-stack web development: responsive frontends, robust backends, APIs, real-time systems, databases and deployment, delivered as maintainable code."],
    cybersecurity: ["Security Audits & Penetration Testing", "Security audits, penetration testing and vulnerability assessments for web, API, cloud and network, led by a Certified Ethical Hacker."],
    blockchain: ["Blockchain & Web3 Development Services", "Blockchain and Web3 development: Solidity smart contracts, decentralised applications, token systems and full-stack DApps on Ethereum and Polygon."],
    "data-ml": ["Data Engineering & Machine Learning Services", "Data engineering and machine learning services: pipelines, processing systems and ML infrastructure that turn raw data into models running in production."],
  };
  const posts = [...DATA.blog].sort((a, b) => b.date.localeCompare(a.date));

  DATA.services.forEach((s) => {
    const others = DATA.services.filter((o) => o.slug !== s.slug);
    const cases = DATA.cases.filter((c) => c.service === s.name);
    const reads = posts.filter((p) => SERVICE_FOR[p.category]?.[0] === s.slug).slice(0, 3);
    page({
      url: `/services/${s.slug}`, title: seo[s.slug]?.[0] || `${s.name}: ${s.headline}`,
      desc: seo[s.slug]?.[1] || s.description,
      body: `${hero(e(s.name), e(s.headline), e(s.description), "phero--cobalt", "light")}

    <section class="sheet" data-tone="dark">
      <h2 class="eyebrow">[ What’s included ]</h2>
      <div class="values values--auto">${s.features.map((f, i) => `<article class="value"><span>0${i + 1}</span><h3>${e(f.title)}</h3><p>${e(f.description)}</p></article>`).join("")}</div>
    </section>

    <section class="sheet sheet--paper2 case" data-tone="dark">
      <h2 class="eyebrow">[ How it goes ]</h2>
      <ol class="case__phases">${s.process.map((p) => `<li><b>${e(p.title)}</b><span>${e(p.description)}</span></li>`).join("")}</ol>
      <div class="case__results">${s.stats.map((r) => `<div><b>${e((r.prefix || "") + r.value + (r.suffix || ""))}</b><span>${e(r.label)}</span></div>`).join("")}</div>
      <div class="chips">${s.technologies.map((t) => `<span>${e(t)}</span>`).join("")}</div>
    </section>

${cases.length || reads.length ? `
    <section class="sheet" data-tone="dark">
      <nav class="related" aria-label="Related case studies and writing"><h2>Proof and further reading</h2>${cases.map((c) => `<a href="/case-studies/${c.slug}">Case study: ${e(c.title)}</a>`).join("")}${reads.map((r) => `<a href="/blog/${r.slug}">${e(r.title)}</a>`).join("")}</nav>
    </section>
` : ""}
    <section class="sheet sheet--night" data-tone="light">
      <p class="eyebrow">[ Also from the studio ]</p>
      <ol class="topics">${others.map((o, i) => `<li><span>0${i + 1}</span><h3><a href="/services/${o.slug}">${e(o.name)}</a></h3><b>Service</b></li>`).join("")}</ol>
      <div class="links"><a href="/case-studies">See the case studies →</a><a href="/contact">Talk to us →</a></div>
    </section>`,
      tone: "light", trail: [["Services", "/services"], [s.name, `/services/${s.slug}`]], priority: 0.8,
      jsonLd: [ld({
        "@type": "Service", name: s.name, serviceType: s.name, description: s.description, url: `${SITE}/services/${s.slug}`,
        provider: { "@id": `${SITE}/#organization` }, areaServed: "Worldwide",
        hasOfferCatalog: { "@type": "OfferCatalog", name: `${s.name}: what’s included`, itemListElement: s.features.map((f) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: f.title, description: f.description } })) },
      })],
    });
  });
}

/* ───────────────────────── products ───────────────────────── */
function buildProducts() {
  const rows = DATA.products.map((p, i) => `
        <a class="post svc" href="/products/${p.slug}">
          <span class="post__meta">0${i + 1}<b>${e(p.tagline)}</b></span>
          <h2>${e(p.name)}</h2>
          <p>${e(p.description)}</p>
          <span class="post__read">Details <i aria-hidden="true">→</i></span>
        </a>`).join("");
  page({
    url: "/products", title: "Products: Inscrape, Nirvana and SwarmScope",
    desc: "Products from Aletheia AI: Inscrape for AI web scraping, Nirvana for alert management and SwarmScope for multi-agent simulation.",
    body: `${hero("Products", "Things we built <em>for ourselves first.</em>", "Our own products are where we test what we recommend to clients.", "phero--marigold")}

    <section class="sheet sheet--paper2" data-tone="dark">
      <div class="posts">${rows}
      </div>
    </section>`,
    trail: [["Products", "/products"]], priority: 0.8,
    jsonLd: [ld({ "@type": "ItemList", name: "Products", itemListElement: DATA.products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: `${SITE}/products/${p.slug}` })) })],
  });

  // taglines are slogans; a title has to say what the thing is
  const titles = { nirvana: "Nirvana: Alert Management for Dev Teams", swarmscope: "SwarmScope: Multi-Agent Simulation Engine", inscrape: "Inscrape: AI Web Scraping SDK for Python" };
  DATA.products.forEach((p) => {
    const price = /\$(\d+)/.exec(p.pricing?.[0]?.price || "")?.[1];
    page({
      url: `/products/${p.slug}`, title: titles[p.slug] || `${p.name}: ${p.tagline}`,
      desc: p.description,
      body: `${hero(`Product · ${e(p.tagline)}`, e(p.name), e(p.description), "phero--marigold")}

    <section class="sheet" data-tone="dark">
      <h2 class="eyebrow">[ What it does ]</h2>
      <div class="values values--auto">${p.features.map((f, i) => `<article class="value"><span>0${i + 1}</span><h3>${e(f.title)}</h3><p>${e(f.description)}</p></article>`).join("")}</div>
    </section>

    <section class="sheet sheet--paper2 case" data-tone="dark">
      <div class="case__grid">
        <div><h2 class="eyebrow">[ Used for ]</h2><ul class="ticks">${lis(p.useCases)}</ul></div>
        <div><h2 class="eyebrow">[ Built with ]</h2><div class="chips">${p.techStack.map((t) => `<span>${e(t)}</span>`).join("")}</div></div>
      </div>
      <div class="case__results">${p.metrics.map((r) => `<div><b>${e(r.value)}</b><span>${e(r.label)}</span></div>`).join("")}</div>
    </section>

    <section class="sheet sheet--night" data-tone="light">
      <h2 class="eyebrow">[ Pricing ]</h2>
      <div class="pricing">${p.pricing.map((t) => `<article class="tier${t.highlighted ? " tier--on" : ""}"><h3>${e(t.tier)}</h3><p class="tier__price">${e(t.price)}</p><ul class="ticks">${lis(t.features)}</ul><a class="btn" href="/contact"><span>${e(t.cta)}</span><i>↗</i></a></article>`).join("")}</div>
    </section>`,
      trail: [["Products", "/products"], [p.name, `/products/${p.slug}`]], priority: 0.7,
      jsonLd: [ld({
        "@type": "SoftwareApplication", name: p.name, description: p.description, applicationCategory: "DeveloperApplication", operatingSystem: "Any",
        url: `${SITE}/products/${p.slug}`, publisher: { "@id": `${SITE}/#organization` },
        ...(price != null ? { offers: { "@type": "Offer", price, priceCurrency: "USD" } } : {}),
      })],
    });
  });
}

/* ───────────────────────── industries, talks, legal, 404 ───────────────────────── */
function buildIndustries() {
  const tint = ["sheet--lilac", "sheet--blush", "sheet--paper2", "sheet--mint", ""];
  page({
    url: "/industries", title: "Industries: Healthcare, SaaS, Security & Web3",
    desc: `Where Aletheia AI works: ${DATA.industries.map((i) => i.name).join(", ")}. The problems in each and what we build for them.`,
    body: `${hero("Industries", "Different fields, <em>the same rigour.</em>", "The problems change from one industry to the next. How carefully we build doesn’t.", "phero--night", "light")}
${DATA.industries.map((ind, i) => `
    <section class="sheet case ${tint[i % 5]}" id="${ind.slug}" data-tone="dark">
      <header class="case__head">
        <span class="case__n" aria-hidden="true">0${i + 1}</span>
        <h2>${e(ind.name)}</h2>
        <p class="case__client">${e(ind.description)}</p>
      </header>
      <div class="case__grid">
        <div><h3>What’s hard</h3><ul class="ticks">${lis(ind.challenges)}</ul></div>
        <div><h3>What we build</h3><ul class="ticks">${lis(ind.solutions)}</ul></div>
      </div>
      <div class="case__results">${ind.stats.map((r) => `<div><b>${e(r.value)}</b><span>${e(r.label)}</span></div>`).join("")}</div>
      <div class="chips">${ind.useCases.map((t) => `<span>${e(t)}</span>`).join("")}</div>
    </section>`).join("")}`,
    tone: "light", trail: [["Industries", "/industries"]], priority: 0.7,
  });
}

function buildTalks() {
  const topics = [
    "One tool to replace asdf, direnv and make",
    "Completion is dead. 2026 is delegation",
    "The industry quietly gave up on microservices",
    "I scanned agent skills for malware",
    "The repo that cuts your AI bill 60%",
    "I ran four coding agents on the same task",
  ];
  page({
    url: "/talks", title: "Technical talks: how real systems get built",
    desc: "Technical talks from Aletheia AI on the engineering decisions behind systems in production: agents, microservices, tooling and AI cost.",
    body: `${hero("Technical talks", "How real systems <em>actually get built.</em>", "Not tutorials, not hype: the engineering decisions behind things that are in production right now.", "phero--marigold")}

    <section class="sheet sheet--night" data-tone="light">
      <p class="eyebrow">[ In the works ]</p>
      <h2 class="big">The first talks are in preparation. <em>These are the topics on the desk.</em></h2>
      <ol class="topics">${topics.map((t, i) => `<li><span>0${i + 1}</span><h3>${e(t)}</h3><b>Planned</b></li>`).join("")}</ol>
    </section>

    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ For your team ]</p>
      <h2 class="big">Want one of these for your team or event? <em>Ask us.</em></h2>
      <a class="btn btn--ink" href="/contact"><span>Ask about a talk</span><i>↗</i></a>
    </section>`,
    trail: [["Technical talks", "/talks"]], priority: 0.5,
  });
}

function buildLegal() {
  const updated = "2 October 2026";
  const draft = '<p class="draft">Draft for legal review before publishing</p>';
  page({
    url: "/privacy", title: "Privacy", desc: "What personal data Aletheia AI collects, why, who handles it and the choices you have.",
    body: `${hero("Privacy", "What we know about you, <em>and why.</em>", `Short version: very little, and we don’t sell any of it. Last updated ${updated}.`, "phero--short")}

    <section class="sheet sheet--paper2 legal" data-tone="dark">
      ${draft}
      <div class="prose">
        <h2>Who we are</h2>
        <p>${NAME} is a design and engineering studio based in Pune, India. For anything on this page, write to <a href="mailto:${MAIL}">${MAIL}</a>.</p>
        <h2>What we collect</h2>
        <p><b>What you send us.</b> When you use the contact or careers form, we receive what you type: your name, email address, company and message, plus any links you choose to include.</p>
        <p><b>How the site is used.</b> With your permission we use Google Analytics to count visits. It records which pages were opened, roughly where in the world the visit came from, and the kind of device and browser. It does not tell us who you are.</p>
        <p><b>Server logs.</b> Like every website, our host keeps short-lived technical logs (IP address, time, page requested) to keep the site running and secure.</p>
        <h2>Why we use it</h2>
        <p>To reply to you, to consider your application, and to understand which parts of the site are useful. We don’t build advertising profiles and we don’t sell or rent personal data.</p>
        <h2>Who else handles it</h2>
        <p>Three services process data on our behalf: Web3Forms delivers form submissions to our inbox, Google Analytics provides visit statistics, and Render hosts the site. Each handles the data only to provide that service.</p>
        <h2>How long we keep it</h2>
        <p>Enquiries are kept for as long as the conversation or project is active and deleted on request. Applications are kept for up to twelve months unless you ask us to remove them sooner. Analytics data is kept in aggregate.</p>
        <h2>Your choices</h2>
        <p>You can ask to see, correct or delete anything we hold about you, and you can withdraw analytics consent at any time on the <a href="/cookies">cookies page</a>. These rights apply under India’s Digital Personal Data Protection Act and, where relevant, the GDPR.</p>
        <h2>Changes</h2>
        <p>If this page changes in a way that matters, we’ll say so here and update the date above.</p>
      </div>
    </section>`,
    trail: [["Privacy", "/privacy"]], priority: 0.2,
  });
  page({
    url: "/cookies", title: "Cookies", desc: "The two optional analytics cookies Aletheia AI uses, what they do and how to turn them off.",
    body: `${hero("Cookies", "Two cookies, <em>both optional.</em>", `We only set them if you say yes, and you can change your mind here whenever you like. Last updated ${updated}.`, "phero--short")}

    <section class="sheet sheet--paper2 legal" data-tone="dark">
      ${draft}
      <div class="prose">
        <h2>Your choice</h2>
        <p class="choice">Analytics cookies are currently <b data-cookie-state>not set</b>.</p>
        <div class="cookie__row cookie__row--page"><button type="button" data-cookie="accept">Allow analytics</button><button type="button" data-cookie="decline">Turn them off</button></div>
        <h2>What we set</h2>
        <div class="table">
          <div><b>_ga</b><span>Google Analytics</span><span>Tells one visit from another so we can count them</span><span>2 years</span></div>
          <div><b>_ga_T8T16K884P</b><span>Google Analytics</span><span>Keeps a visit together across pages</span><span>2 years</span></div>
          <div><b>aletheia-cookie-choice</b><span>This site</span><span>Remembers the answer you gave above. Stored in your browser, never sent to us</span><span>Until you clear it</span></div>
        </div>
        <h2>What we don’t do</h2>
        <p>No advertising cookies, no trackers from social networks, no selling of data. If that ever changes, this page changes first.</p>
        <h2>Turning cookies off in your browser</h2>
        <p>Every browser lets you block or delete cookies in its settings. The site works the same with them off.</p>
      </div>
    </section>`,
    trail: [["Cookies", "/cookies"]], priority: 0.2,
  });
  page({
    url: "/404", title: "Page not found", desc: "That page doesn’t exist or has moved. Head back to the Aletheia AI homepage.", noindex: true,
    body: `${hero("404", "Nothing here. <em>Nothing hidden, either.</em>", "That page doesn’t exist, or it moved. Try one of these instead.", "phero--night", "light")}

    <section class="sheet" data-tone="dark">
      <div class="links"><a href="/">Home →</a><a href="/#work">Work →</a><a href="/services">Services →</a><a href="/blog">Blog →</a><a href="/contact">Contact →</a></div>
    </section>`,
    tone: "light",
  });
}

/* ───────────────────────── sitemap, robots, llms.txt, IndexNow ───────────────────────── */
function buildIndexFiles() {
  write("/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map((p) => `  <url><loc>${SITE}${slash(p.url)}</loc><lastmod>${p.lastmod}</lastmod><priority>${p.priority.toFixed(1)}</priority>${(p.images || []).map((i) => `<image:image><image:loc>${i}</image:loc></image:image>`).join("")}</url>`).join("\n")}
</urlset>
`);
  fs.writeFileSync(STAMPS_FILE, `${JSON.stringify(Object.fromEntries(Object.keys(stamps).sort().map((k) => [k, stamps[k]])), null, 2)}\n`);

  // Everything is open. The AI crawlers are named so the policy is explicit: this site wants to be read,
  // quoted and linked by search assistants. To opt out of model training, change Allow to Disallow under those names.
  write("/robots.txt", `# ${NAME}: open to search engines and AI assistants.
User-agent: *
Allow: /

# AI search and assistants (answers that cite and link back)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
Allow: /

# AI model training
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
  write(`/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY);

  const posts = [...DATA.blog].sort((a, b) => b.date.localeCompare(a.date));
  const founder = DATA.team[0];
  const summary = "Design and engineering studio in Pune, India. We build AI products, MVPs, websites and software, and provide cybersecurity, data/ML and Web3 engineering for teams anywhere.";
  write("/llms.txt", `# ${NAME}

> ${summary}

- Founder: ${founder.name} (${founder.role}), Certified Ethical Hacker
- Location: Pune, Maharashtra, India. Works with clients remotely, worldwide
- Contact: ${MAIL} or ${SITE}/contact/
- Full text of every page below in one file: ${SITE}/llms-full.txt

## Services
${DATA.services.map((s) => `- [${s.name}](${SITE}/services/${s.slug}/): ${s.headline}`).join("\n")}

## Products
${DATA.products.map((p) => `- [${p.name}](${SITE}/products/${p.slug}/): ${p.tagline}`).join("\n")}

## Case studies
${DATA.cases.map((c) => `- [${c.title}](${SITE}/case-studies/${c.slug}/): ${c.client}, ${c.industry}`).join("\n")}

## Writing
${posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/): ${p.excerpt}`).join("\n")}

## Company
- [About](${SITE}/about/): who we are and what we hold to
- [Industries](${SITE}/industries/): where we work and what we build there
- [Careers](${SITE}/careers/): open roles
- [Contact](${SITE}/contact/): start a project

## Optional
- [Full site content](${SITE}/llms-full.txt): every service, product, case study and article as plain Markdown
- [Blog feed](${SITE}/blog/feed.xml)
- [Sitemap](${SITE}/sitemap.xml)
`);

  const bullets = (xs) => xs.map((x) => `- ${x}`).join("\n");
  write("/llms-full.txt", `# ${NAME}: full site content

> ${summary}

Source: ${SITE}/ · Contact: ${MAIL}

## About

${NAME} is an engineering-first studio founded in Pune by ${founder.name}. Aletheia is Greek for truth: honest timelines, real systems, nothing hidden.

${founder.name}, ${founder.role}: ${founder.bio}

## Services

${DATA.services.map((s) => `### ${s.name}: ${s.headline}
${SITE}/services/${s.slug}/

${s.description}

What’s included:
${bullets(s.features.map((f) => `${f.title}: ${f.description}`))}

How it goes:
${s.process.map((x, i) => `${i + 1}. ${x.title}: ${x.description}`).join("\n")}

Technologies: ${s.technologies.join(", ")}`).join("\n\n")}

## Products

${DATA.products.map((p) => `### ${p.name}: ${p.tagline}
${SITE}/products/${p.slug}/

${p.description}

Features:
${bullets(p.features.map((f) => `${f.title}: ${f.description}`))}

Used for:
${bullets(p.useCases)}

Pricing:
${bullets(p.pricing.map((t) => `${t.tier} (${t.price}): ${t.features.join("; ")}`))}`).join("\n\n")}

## Case studies

${DATA.cases.map((c) => `### ${c.title}
${SITE}/case-studies/${c.slug}/
Client: ${c.client} · Industry: ${c.industry} · Service: ${c.service}

Challenge: ${c.challenge}

Approach:
${bullets(c.approach.map((a) => `${a.phase}: ${a.description}`))}

Solution: ${c.solution}

Results:
${bullets(c.results.map((r) => `${r.value}: ${r.label}`))}

Built with: ${c.techStack.join(", ")}`).join("\n\n")}

## Industries

${DATA.industries.map((i) => `### ${i.name}
${i.description}

What we build:
${bullets(i.solutions)}`).join("\n\n")}

## Questions and answers

${[...DATA.faq.home, ...DATA.faq.contact].map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}

## Writing

${posts.map((p) => `### ${p.title}
${SITE}/blog/${p.slug}/
${p.category} · ${p.date} · ${p.author}

${p.content.trim()}`).join("\n\n")}
`);
}

/* ───────────────────────── run ───────────────────────── */
export function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const dir of ["css", "js", "assets"]) {
    fs.cpSync(path.join(SRC, dir), path.join(OUT, dir), {
      recursive: true,
      filter: (src) => !/\.(md|txt)$|\.DS_Store$/.test(src) && !/assets\/art\/[^/]+\.png$/.test(src),
    });
  }
  buildHome();
  buildAbout();
  buildServices();
  buildProducts();
  buildIndustries();
  buildCases();
  buildBlog();
  buildTalks();
  buildCareers();
  buildContact();
  buildLegal();
  buildIndexFiles();
  return { pages: pages.length, out: OUT };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = build();
  console.log(`built ${result.pages} indexable pages → ${path.relative(process.cwd(), result.out) || "."}`);
}
