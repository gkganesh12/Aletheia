// Serves website/dist the way the host does: a page lives at its trailing-slash address,
// and any address that matches nothing gets the homepage (which then redirects itself).
//
//   node scripts/serve-site.mjs [port]
import fs from "node:fs";
import path from "node:path";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = Number(process.argv[2] || process.env.PORT || 3000);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".json": "application/json",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp4": "video/mp4",
  ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8",
};

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(DIST, url);
  if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
  const isDir = fs.existsSync(file) && fs.statSync(file).isDirectory();
  if (isDir && url.endsWith("/")) file = path.join(file, "index.html");
  const status = 200;
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(DIST, "index.html");
  const type = TYPES[path.extname(file)] || "application/octet-stream";
  const size = fs.statSync(file).size;
  const range = /bytes=(\d+)-(\d*)/.exec(req.headers.range || ""); // video scrubbing needs range requests
  if (range) {
    const from = Number(range[1]), to = range[2] ? Number(range[2]) : size - 1;
    res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${from}-${to}/${size}`, "Accept-Ranges": "bytes", "Content-Length": to - from + 1 });
    fs.createReadStream(file, { start: from, end: to }).pipe(res);
    return;
  }
  res.writeHead(status, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`http://localhost:${PORT}`));
