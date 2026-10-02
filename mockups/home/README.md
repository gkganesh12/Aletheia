# Aletheia AI — homepage prototype

A working HTML/CSS/JS prototype of the new site: homepage plus About, Careers, Contact, Blog, Case studies,
Technical talks, Privacy and Cookies. It is **not wired into `website/`**; nothing here affects the live build.

## Run it

```bash
python3 -m http.server 3000 --bind 127.0.0.1
```

Open http://localhost:3000/. Add `?skip` to skip the loader.

## Edit it

- `index.html`, `css/site.css`, `js/main.js` — the homepage and its scroll scenes (GSAP + Lenis, vendored in `assets/vendor/`).
- `build.py` — generates every inner page from `data/content.json` and keeps the nav, menu, footer and cookie notice
  identical on all pages, including `index.html`. Run `python3 build.py` after changing it.
- `css/pages.css`, `js/page.js` — inner-page layout and motion. `js/chrome.js` — menus, cookie choice, forms.
- `assets/art/` — "The Uncovering" still-life series (AI-generated brand art, not staff or client work); `PROMPTS.md` has the brief.

## Before this goes live

- Privacy and Cookies are drafts and need legal review; Google Analytics must only load after consent.
- The six service demos are illustrations with made-up numbers, not captures of client systems.
- Contact and application forms post to the site's existing Web3Forms inbox.
- HeuriSight captures have the tenant name masked; get the client's approval before showing more.
