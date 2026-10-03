// Tells Bing, Yandex, Naver and Seznam (the IndexNow engines) which pages are new or changed,
// so they recrawl within minutes instead of waiting for their next visit. Google does not use IndexNow:
// for Google, submit the sitemap once in Search Console.
//
//   node website/scripts/indexnow.mjs               every page in the live sitemap
//   node website/scripts/indexnow.mjs /blog/x/ /    only these paths
//
// Run it after a deploy has finished, because the engines fetch the key file from the live site.
import { INDEXNOW_KEY, SITE } from "./build-site.mjs";

const host = new URL(SITE).host;
const keyLocation = `${SITE}/${INDEXNOW_KEY}.txt`;

const live = await fetch(keyLocation).then((r) => (r.ok ? r.text() : ""), () => "");
if (live.trim() !== INDEXNOW_KEY) {
  console.error(`The key file is not live yet at ${keyLocation}. Deploy first, then run this again.`);
  process.exit(1);
}

let urlList = process.argv.slice(2).map((p) => new URL(p, SITE).href);
if (!urlList.length) {
  const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
  urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation, urlList }),
});
const meaning = {
  200: "accepted",
  202: "received, key check pending",
  400: "bad request",
  403: "key not valid for this site",
  422: "URLs do not belong to this host",
  429: "too many submissions, try again later",
}[res.status] || "unexpected response";
console.log(`${urlList.length} URLs sent to IndexNow: ${res.status} (${meaning})`);
if (!res.ok) process.exit(1);
