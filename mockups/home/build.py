#!/usr/bin/env python3
"""Builds the inner pages of the prototype and keeps the nav, menu, footer and cookie
notice identical on every page (including index.html).

Content comes from data/content.json, exported from the current site's website/src/data.
Run from this folder:  python3 build.py
"""
import html, json, re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
DATA = json.loads((ROOT / "data/content.json").read_text())
MAIL = "info@aletheiaai.tech"
e = html.escape

MARK = '<svg viewBox="0 0 64 48" aria-hidden="true"><path class="m-a" d="M0 44 21 6h13L14 44Z"/><path class="m-a" d="m34 9 19 35H39L27 22Z"/><path class="m-b" d="M20 31h11l7 13H27Z"/></svg>'


def nav(home):
    return f'''<header class="nav" data-tone="dark">
    <a class="nav__brand" href="{home or '#top'}" aria-label="Aletheia AI, home">
      <img class="logo logo--dark" src="assets/brand/logo.png" alt="Aletheia AI" width="826" height="160" />
      <img class="logo logo--light" src="assets/brand/logo-light.png" alt="" aria-hidden="true" width="826" height="160" />
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="{home}#work">Work</a>
      <a href="{home}#answers">Services</a>
      <div class="nav__dd">
        <button type="button" aria-haspopup="true">Resources <i aria-hidden="true">+</i></button>
        <div class="nav__menu"><a href="blog.html">Blog</a><a href="case-studies.html">Case studies</a><a href="talks.html">Technical talks</a></div>
      </div>
      <div class="nav__dd">
        <button type="button" aria-haspopup="true">Company <i aria-hidden="true">+</i></button>
        <div class="nav__menu"><a href="about.html">About us</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
      </div>
    </nav>
    <div class="nav__end">
      <a class="nav__cta" href="contact.html"><span>Start a project</span><i aria-hidden="true">↗</i></a>
      <button class="nav__burger" type="button" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
    </div>
  </header>

  <div class="menu" aria-hidden="true">
    <div><h4>Studio</h4><a href="{home}#work">Work</a><a href="{home}#answers">Services</a></div>
    <div><h4>Resources</h4><a href="blog.html">Blog</a><a href="case-studies.html">Case studies</a><a href="talks.html">Technical talks</a></div>
    <div><h4>Company</h4><a href="about.html">About us</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
    <div class="menu__foot"><a href="mailto:{MAIL}">{MAIL}</a><a href="privacy.html">Privacy</a><a href="cookies.html">Cookies</a></div>
  </div>'''


def footer(home):
    return f'''<footer class="foot">
        <div class="foot__cols">
          <div><h4>Studio</h4><a href="{home}#work">Work</a><a href="{home}#answers">Services</a><a href="{home}#under">How we build</a><a href="{home}#name">The name</a></div>
          <div><h4>Resources</h4><a href="blog.html">Blog</a><a href="case-studies.html">Case studies</a><a href="talks.html">Technical talks</a></div>
          <div><h4>Company</h4><a href="about.html">About us</a><a href="careers.html">Careers</a><a href="contact.html">Contact</a></div>
          <div><h4>Legal</h4><a href="privacy.html">Privacy</a><a href="cookies.html">Cookies</a></div>
          <div><h4>Elsewhere</h4><a href="https://www.linkedin.com/company/aletheiaaitech" target="_blank" rel="noopener">LinkedIn</a><a href="https://github.com/Aletheia-Ai-tech" target="_blank" rel="noopener">GitHub</a><a href="https://x.com/ai_aletheia" target="_blank" rel="noopener">X</a><p>Pune, India</p></div>
        </div>
        <div class="foot__base"><span>© 2026 Aletheia AI</span><span>Design &amp; engineering, nothing hidden.</span></div>
        <div class="foot__word" aria-hidden="true">Aletheia</div>
      </footer>'''


COOKIE = '''<div class="cookie" role="dialog" aria-label="Cookies" hidden>
    <p>We use two analytics cookies to see which pages get read. Nothing else, no ads. <a href="cookies.html">Details</a></p>
    <div class="cookie__row"><button type="button" data-cookie="accept">That’s fine</button><button type="button" data-cookie="decline">No thanks</button></div>
  </div>'''


def start(home, h="You’ve built the business.<br /><em>So, what’s next?</em>"):
    return f'''<section class="start" id="start" data-tone="light">
      <div class="start__grid" aria-hidden="true"></div>
      <div class="start__in">
        <p class="eyebrow">[ Your turn ]</p>
        <h2 class="start__h">{h}</h2>
        <div class="start__row">
          <a class="btn" href="contact.html"><span>Start a project</span><i>↗</i></a>
          <a class="start__mail" href="mailto:{MAIL}">{MAIL}</a>
        </div>
      </div>
      {footer(home)}
    </section>'''


def page(slug, title, desc, body, tone="dark"):
    doc = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>{e(title)} — Aletheia AI</title>
  <meta name="description" content="{e(desc)}" />
  <link rel="icon" href="assets/brand/favicon.png" type="image/png" />
  <link rel="preload" href="assets/fonts/BricolageGrotesque-var.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="css/site.css" />
  <link rel="stylesheet" href="css/pages.css" />
</head>
<body class="page page--{slug.split('-')[0]}">

  {nav('index.html').replace('data-tone="dark"', f'data-tone="{tone}"')}

  <div class="progress" aria-hidden="true"><i></i></div>

  <main id="top">
{body}

    {start('index.html')}
  </main>

  {COOKIE}

  <script src="assets/vendor/gsap.min.js"></script>
  <script src="assets/vendor/ScrollTrigger.min.js"></script>
  <script src="assets/vendor/SplitText.min.js"></script>
  <script src="assets/vendor/lenis.min.js"></script>
  <script src="js/chrome.js"></script>
  <script src="js/page.js"></script>
</body>
</html>
'''
    (ROOT / f"{slug}.html").write_text(doc)


def hero(eyebrow, h1, lede, cls="", tone="dark"):
    return f'''    <section class="phero {cls}" data-tone="{tone}">
      <p class="eyebrow">[ {eyebrow} ]</p>
      <h1>{h1}</h1>
      <p class="phero__lede">{lede}</p>
    </section>'''


def nice_date(iso):
    y, m, d = map(int, iso.split("-"))
    return date(y, m, d).strftime("%-d %b %Y")


# ───────────────────────── about ─────────────────────────
VALUES = [
    ("01", "Ship it", "We measure success by what’s live in production. Not slide decks, not prototypes gathering dust."),
    ("02", "Engineering first", "Strong engineering is our identity. We solve problems with code, not meetings."),
    ("03", "Integrity", "Aletheia means truth. Transparent with clients, honest about timelines, no vaporware."),
    ("04", "Own the problem", "We understand the business context, own the outcome and build solutions that work."),
]
about = hero("About us", "A studio that tells you <em>the truth.</em>",
             "Aletheia is Greek for truth, or disclosure. It’s the principle behind everything we build, and the way we work with the people we build it for.")
about += '''
    <section class="sheet sheet--night" data-tone="light">
      <p class="eyebrow">[ Why we exist ]</p>
      <h2 class="big">Most AI products are either impressive in isolation <em>or useless in real workflows.</em></h2>
      <div class="cols">
        <p>Aletheia AI was built to change that. We create intelligent systems that fit into how people already work, delivering outcomes, not just outputs.</p>
        <p class="strong">No fluff. No hype. Just systems that work.</p>
      </div>
    </section>

    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ What we hold to ]</p>
      <div class="values">''' + "".join(
    f'<article class="value"><span>{n}</span><h3>{e(t)}</h3><p>{e(d)}</p></article>' for n, t, d in VALUES) + '''</div>
    </section>

    <section class="sheet sheet--blush" data-tone="dark">
      <div class="founder">
        <figure class="founder__pic"><img src="assets/about/ganesh.webp" alt="Ganesh Khetawat, founder of Aletheia AI" /></figure>
        <div class="founder__txt">
          <p class="eyebrow">[ Founder ]</p>
          <h2>A builder at the intersection of AI, systems and <em>real-world problem solving.</em></h2>
          <p>Ganesh Khetawat is pursuing a degree in computer science and has worked across full-stack development, cybersecurity and applied AI, building products that go beyond demos and are judged on whether people can use them.</p>
          <p>What sets his work apart is a simple principle: <b>technology should solve real problems, not just showcase intelligence.</b> That belief led to Aletheia AI.</p>
          <div class="links"><a href="https://www.linkedin.com/in/ganeshkhetawat/" target="_blank" rel="noopener">LinkedIn ↗</a><a href="https://github.com/gkganesh12" target="_blank" rel="noopener">GitHub ↗</a></div>
        </div>
      </div>
    </section>

    <section class="sheet sheet--paper2" data-tone="dark">
      <p class="eyebrow">[ Where ]</p>
      <h2 class="big">Pune, India. <em>Working with teams wherever they are.</em></h2>
    </section>'''
page("about", "About us", "Aletheia AI is a design and engineering studio founded in Pune, India.", about)

# ───────────────────────── careers ─────────────────────────
def field(label, name, kind="text", required=False, full=False, extra=""):
    req = " required" if required else ""
    opt = "" if required else " <i>optional</i>"
    cls = "field field--full" if full else "field"
    if kind == "textarea":
        control = f'<textarea id="f-{name}" name="{name}" rows="5"{req} {extra}></textarea>'
    else:
        control = f'<input id="f-{name}" name="{name}" type="{kind}"{req} {extra} />'
    return f'<div class="{cls}"><label for="f-{name}">{label}{opt}</label>{control}</div>'


roles = ""
for j in DATA["careers"]:
    lis = lambda xs: "".join(f"<li>{e(x)}</li>" for x in xs)
    meta = [j["department"]] + [j[k] for k in ("type", "experience", "location") if j.get(k)]
    spans = "".join(f"<span>{e(m)}</span>" for m in meta)
    roles += f"""
        <details class="role" id="{j['id']}">
          <summary><h3>{e(j['title'])}</h3><div class="role__meta">{spans}</div><i aria-hidden="true">+</i></summary>
          <div class="role__body">
            <p class="role__lede">{e(j['description'])}</p>
            <div class="role__cols">
              <div><h4>What you’ll do</h4><ul>{lis(j['responsibilities'])}</ul></div>
              <div><h4>What we look for</h4><ul>{lis(j['requirements'])}</ul></div>
            </div>
            <p class="role__note"><b>To apply:</b> {e(j['applicationNote'])}</p>
            <a class="btn btn--ink" href="#apply" data-role="{e(j['title'])}"><span>Apply for this role</span><i>↓</i></a>
          </div>
        </details>"""
options = "".join(f'<option>{e(j["title"])}</option>' for j in DATA["careers"])
careers = hero("Careers", "Come build things <em>that ship.</em>",
               "You’ll contribute to Aletheia AI products and client work from the start. Show us something you’ve built and can explain.",
               "phero--cobalt", "light")
careers += f"""
    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ Open roles · {len(DATA['careers'])} ]</p>
      <div class="roles">{roles}
      </div>
    </section>

    <section class="sheet sheet--night" id="apply" data-tone="light">
      <p class="eyebrow">[ Apply ]</p>
      <h2 class="big">Tell us what you’ve built, <em>and which part was yours.</em></h2>
      <form class="form" data-form="career" novalidate>
        <div class="field field--full"><label for="f-position">Role</label><select id="f-position" name="position" required>{options}</select></div>
        {field("Full name", "name", required=True, extra='minlength="2" autocomplete="name"')}
        {field("Email", "email", "email", required=True, extra='autocomplete="email"')}
        {field("Phone", "phone", "tel", extra='autocomplete="tel"')}
        {field("Portfolio, GitHub or project link", "portfolio", "url", extra='placeholder="https://"')}
        {field("Referral code", "referralCode", extra='maxlength="40"')}
        {field("What you built, and your part in it", "message", "textarea", required=True, full=True, extra='minlength="10"')}
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" />
        <div class="form__end"><button class="btn" type="submit"><span>Send application</span><i>↗</i></button><p class="form__status" role="status" aria-live="polite"></p></div>
      </form>
    </section>"""
page("careers", "Careers", "Open roles at Aletheia AI.", careers, tone="light")

# ───────────────────────── contact ─────────────────────────
SERVICES = ["AI Product Engineering", "MVP & Rapid Prototyping", "Full-Stack Development", "Cybersecurity & Auditing", "Blockchain & Web3", "Data Engineering & ML", "Other"]
svc = '<option value="" selected disabled>Choose one</option>' + "".join(f"<option>{e(x)}</option>" for x in SERVICES)
contact = hero("Contact", "Tell us what you’re <em>building.</em>",
               "Drop us a message and we’ll get back to you within 24 hours.", "phero--short")
contact += f"""
    <section class="sheet sheet--night" data-tone="light">
      <div class="contact">
        <form class="form" data-form="contact" novalidate>
          {field("Full name", "name", required=True, extra='minlength="2" autocomplete="name"')}
          {field("Work email", "email", "email", required=True, extra='autocomplete="email"')}
          {field("Company", "company", extra='autocomplete="organization"')}
          {field("Phone", "phone", "tel", extra='autocomplete="tel"')}
          <div class="field field--full"><label for="f-service">What do you need?</label><select id="f-service" name="service" required>{svc}</select></div>
          {field("How can we help?", "message", "textarea", required=True, full=True, extra='minlength="10"')}
          <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" />
          <div class="form__end"><button class="btn" type="submit"><span>Send message</span><i>↗</i></button><p class="form__status" role="status" aria-live="polite"></p></div>
        </form>
        <aside class="contact__info">
          <div><h4>Email</h4><a href="mailto:{MAIL}">{MAIL}</a></div>
          <div><h4>Where</h4><p>Pune, Maharashtra, India</p></div>
          <div><h4>Elsewhere</h4><a href="https://www.linkedin.com/company/aletheiaaitech" target="_blank" rel="noopener">LinkedIn ↗</a><a href="https://github.com/Aletheia-Ai-tech" target="_blank" rel="noopener">GitHub ↗</a><a href="https://x.com/ai_aletheia" target="_blank" rel="noopener">X ↗</a></div>
        </aside>
      </div>
    </section>"""
page("contact", "Contact", "Get in touch with Aletheia AI.", contact)

# ───────────────────────── blog ─────────────────────────
posts = sorted(DATA["blog"], key=lambda p: p["date"], reverse=True)
cats = sorted({p["category"] for p in posts})
rows = ""
for p in posts:
    rows += f'''
        <a class="post" href="blog-{p["slug"]}.html" data-cat="{e(p["category"])}">
          <span class="post__meta">{nice_date(p["date"])}<b>{e(p["category"])}</b></span>
          <h3>{e(p["title"])}</h3>
          <p>{e(p["excerpt"])}</p>
          <span class="post__read">{e(p["readTime"])} <i aria-hidden="true">→</i></span>
        </a>'''
chips = '<button type="button" class="is-on" data-filter="*">All</button>' + "".join(
    f'<button type="button" data-filter="{e(c)}">{e(c)}</button>' for c in cats)
blog = hero("Blog", "Notes from <em>the workbench.</em>",
            "Long reads on building AI, software and security that hold up once real people start using them.")
blog += f'''
    <section class="sheet sheet--paper2" data-tone="dark">
      <div class="filters">{chips}</div>
      <div class="posts">{rows}
      </div>
    </section>'''
page("blog", "Blog", "Writing from Aletheia AI on AI engineering, software and security.", blog)

for i, p in enumerate(posts):
    paras = "".join(f"<p>{e(x.strip())}</p>" for x in re.split(r"\n\s*\n", p["content"]) if x.strip())
    nxt = posts[(i + 1) % len(posts)]
    body = f'''    <article class="article" data-tone="dark">
      <a class="back" href="blog.html">← All writing</a>
      <p class="eyebrow">[ {e(p["category"])} · {nice_date(p["date"])} · {e(p["readTime"])} ]</p>
      <h1>{e(p["title"])}</h1>
      <p class="article__lede">{e(p["excerpt"])}</p>
      <div class="prose">{paras}</div>
      <p class="article__by">Written by {e(p["author"])}</p>
      <a class="next" href="blog-{nxt["slug"]}.html"><span>Read next</span><b>{e(nxt["title"])}</b><i aria-hidden="true">→</i></a>
    </article>'''
    page(f'blog-{p["slug"]}', p["title"], p["excerpt"], body)

# ───────────────────────── case studies ─────────────────────────
SHOT = {
    "heurisight-rag": '<img src="assets/work/heuri-dash2.webp" alt="HeuriSight dashboard" />',
    "inscrape-sdk": '<img src="assets/work/pypi.webp" alt="Inscrape on the Python Package Index" />',
    "codecraft-cli": '<pre><span class="c">$</span> npm i -g @gkganesh12/codecraft-cli\n<span class="c">$</span> codecraft init\n<b>›</b> /plan   <span class="c">scope the change</span>\n<b>›</b> /code   <span class="c">write inside the guard</span>\n<b>›</b> /verify <span class="c">check it against the rules</span></pre>',
}
TINT = ["sheet--lilac", "sheet--blush", "sheet--paper2", "sheet--mint"]
cases = hero("Case studies", "Proof, <em>in production.</em>",
             "What the problem was, what we built and what it does now. Told plainly.",
             "phero--night", "light")
for i, c in enumerate(DATA["cases"]):
    phases = "".join(f'<li><b>{e(a["phase"].split(": ", 1)[-1])}</b><span>{e(a["description"])}</span></li>' for a in c["approach"])
    results = "".join(f'<div><b>{e(r["value"])}</b><span>{e(r["label"])}</span></div>' for r in c["results"])
    stack = "".join(f"<span>{e(t)}</span>" for t in c["techStack"])
    shot = f'<figure class="case__shot">{SHOT[c["slug"]]}</figure>' if c["slug"] in SHOT else ""
    cases += f'''
    <section class="sheet case {TINT[i % 4]}" id="{c["slug"]}" data-tone="dark">
      <header class="case__head">
        <span class="case__n">0{i + 1}</span>
        <p class="eyebrow">[ {e(c["industry"])} · {e(c["service"])} ]</p>
        <h2>{e(c["title"])}</h2>
        <p class="case__client">{e(c["client"])}</p>
      </header>
      {shot}
      <div class="case__grid">
        <div><h4>The problem</h4><p>{e(c["challenge"])}</p></div>
        <div><h4>What we built</h4><p>{e(c["solution"])}</p></div>
      </div>
      <ol class="case__phases">{phases}</ol>
      <div class="case__results">{results}</div>
      <div class="chips">{stack}</div>
    </section>'''
page("case-studies", "Case studies", "Case studies from Aletheia AI.", cases, tone="light")

# ───────────────────────── technical talks ─────────────────────────
TOPICS = [
    "One tool to replace asdf, direnv and make",
    "Completion is dead. 2026 is delegation",
    "The industry quietly gave up on microservices",
    "I scanned agent skills for malware",
    "The repo that cuts your AI bill 60%",
    "I ran four coding agents on the same task",
]
talks = hero("Technical talks", "How real systems <em>actually get built.</em>",
             "Not tutorials, not hype: the engineering decisions behind things that are in production right now.",
             "phero--marigold")
talks += '''
    <section class="sheet sheet--night" data-tone="light">
      <p class="eyebrow">[ In the works ]</p>
      <h2 class="big">The first talks are in preparation. <em>These are the topics on the desk.</em></h2>
      <ol class="topics">''' + "".join(f"<li><span>0{i + 1}</span><h3>{e(t)}</h3><b>Planned</b></li>" for i, t in enumerate(TOPICS)) + f'''</ol>
    </section>

    <section class="sheet" data-tone="dark">
      <p class="eyebrow">[ For your team ]</p>
      <h2 class="big">Want one of these for your team or event? <em>Ask us.</em></h2>
      <a class="btn btn--ink" href="mailto:{MAIL}?subject=Technical%20talk"><span>Ask about a talk</span><i>↗</i></a>
    </section>'''
page("talks", "Technical talks", "Technical talks from Aletheia AI.", talks)

# ───────────────────────── legal ─────────────────────────
UPDATED = "2 October 2026"
privacy = hero("Privacy", "What we know about you, <em>and why.</em>",
               f"Short version: very little, and we don’t sell any of it. Last updated {UPDATED}.", "phero--short")
privacy += f'''
    <section class="sheet sheet--paper2 legal" data-tone="dark">
      <p class="draft">Draft for legal review before publishing</p>
      <div class="prose">
        <h2>Who we are</h2>
        <p>Aletheia AI is a design and engineering studio based in Pune, India. For anything on this page, write to <a href="mailto:{MAIL}">{MAIL}</a>.</p>
        <h2>What we collect</h2>
        <p><b>What you send us.</b> When you use the contact or careers form, we receive what you type: your name, email address, company and message, plus any links or files you choose to include.</p>
        <p><b>How the site is used.</b> With your permission we use Google Analytics to count visits. It records which pages were opened, roughly where in the world the visit came from, and the kind of device and browser. It does not tell us who you are.</p>
        <p><b>Server logs.</b> Like every website, our host keeps short-lived technical logs (IP address, time, page requested) to keep the site running and secure.</p>
        <h2>Why we use it</h2>
        <p>To reply to you, to consider your application, and to understand which parts of the site are useful. We don’t build advertising profiles and we don’t sell or rent personal data.</p>
        <h2>Who else handles it</h2>
        <p>Three services process data on our behalf: Web3Forms delivers form submissions to our inbox, Google Analytics provides visit statistics, and Render hosts the site. Each handles the data only to provide that service.</p>
        <h2>How long we keep it</h2>
        <p>Enquiries are kept for as long as the conversation or project is active and deleted on request. Applications are kept for up to twelve months unless you ask us to remove them sooner. Analytics data is kept in aggregate.</p>
        <h2>Your choices</h2>
        <p>You can ask to see, correct or delete anything we hold about you, and you can withdraw analytics consent at any time on the <a href="cookies.html">cookies page</a>. These rights apply under India’s Digital Personal Data Protection Act and, where relevant, the GDPR.</p>
        <h2>Changes</h2>
        <p>If this page changes in a way that matters, we’ll say so here and update the date above.</p>
      </div>
    </section>'''
page("privacy", "Privacy", "How Aletheia AI handles personal data.", privacy)

cookies = hero("Cookies", "Two cookies, <em>both optional.</em>",
               f"We only set them if you say yes, and you can change your mind here whenever you like. Last updated {UPDATED}.", "phero--short")
cookies += '''
    <section class="sheet sheet--paper2 legal" data-tone="dark">
      <p class="draft">Draft for legal review before publishing</p>
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
    </section>'''
page("cookies", "Cookies", "The cookies Aletheia AI uses.", cookies)

# ───────────────────────── keep index.html in step ─────────────────────────
idx = (ROOT / "index.html").read_text()
idx, n1 = re.subn(r'<header class="nav".*?</header>(\s*<div class="menu".*?\n  </div>)?', lambda m: nav(""), idx, count=1, flags=re.S)
idx, n2 = re.subn(r'<footer class="foot">.*?</footer>', lambda m: footer(""), idx, count=1, flags=re.S)
idx = re.sub(r'\n  <div class="cookie".*?\n  </div>\n', "\n", idx, flags=re.S)
idx = idx.replace('\n  <script src="assets/vendor/gsap.min.js"></script>', f'\n  {COOKIE}\n\n  <script src="assets/vendor/gsap.min.js"></script>', 1)
if 'js/chrome.js' not in idx:
    idx = idx.replace('<script src="js/main.js"></script>', '<script src="js/chrome.js"></script>\n  <script src="js/main.js"></script>')
idx = idx.replace('<a class="btn" href="mailto:info@aletheiaai.tech" data-cursor="Say hello">', '<a class="btn" href="contact.html" data-cursor="Say hello">')
idx = idx.replace('<link rel="icon" href="assets/mark.svg" type="image/svg+xml" />', '<link rel="icon" href="assets/brand/favicon.png" type="image/png" />')
assert n1 == 1 and n2 == 1
(ROOT / "index.html").write_text(idx)

print(f"built: about, careers, contact, blog (+{len(posts)} posts), case-studies, talks, privacy, cookies; index nav/footer synced")
