/* Aletheia — homepage prototype motion.
   Every scene is scrubbed to scroll (no pop-in reveals); small things that should feel alive run on a clock. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const small = () => innerWidth <= 820;
  const hash = location.hash;
  const skip = new URLSearchParams(location.search).has('skip') || hash.length > 1;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const clamp01 = gsap.utils.clamp(0, 1);

  if (reduce) { root.classList.remove('is-loading'); return; }

  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

  const lenis = new Lenis({ lerp: 0.085 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  const gridDims = () => (innerHeight > innerWidth ? [5, 9] : [9, 6]);
  function fillGrid(el, cols, rows) {
    el.style.setProperty('--cols', cols);
    el.style.setProperty('--rows', rows);
    el.innerHTML = '<i></i>'.repeat(cols * rows);
    return [...el.children];
  }

  // wrap each word of an element's own text in a mask, leaving child elements alone
  function wrapWords(el) {
    [...el.childNodes].forEach((n) => {
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(' '); return; }
        const m = document.createElement('span'); m.className = 'qw';
        const i = document.createElement('span'); i.textContent = part;
        m.append(i); frag.append(m);
      });
      n.replaceWith(frag);
    });
  }

  /* ───────── nav tone + progress + cursor ───────── */
  const nav = $('.nav');
  let stageTl = null;
  const toneSections = [['.work', 'dark'], ['.reel', 'light'], ['.under', 'dark'], ['.belief', 'dark'], ['.name', 'light'], ['.start', 'light']]
    .map(([s, t]) => [$(s), t]);
  const scrollWatchers = [];
  function updateTone() {
    let tone = stageTl && stageTl.time() > 2.3 ? 'light' : 'dark';
    for (const [el, t] of toneSections) if (el.getBoundingClientRect().top <= 40) tone = t;
    if (nav.dataset.tone !== tone) nav.dataset.tone = tone;
  }

  function chrome() {
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { gsap.set('.progress i', { scaleY: self.progress }); updateTone(); scrollWatchers.forEach((f) => f()); } });

    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      const to = id === '#answers' && stageTl ? stageTl.scrollTrigger.labelToScroll('answers') : target;
      lenis.scrollTo(to, { duration: 1.8 });
    }));

    if (!fine) return;
    const cur = $('.cursor'), label = $('.cursor__label');
    const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    let px = -1, py = -1, shown = null;
    const show = (t) => {
      if (t === shown) return;
      shown = t;
      if (t) {
        label.textContent = t.dataset.cursor;
        gsap.to(label, { scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)', overwrite: true });
      } else {
        gsap.to(label, { scale: 0, rotation: -14, duration: 0.3, ease: 'power2.in', overwrite: true });
      }
    };
    addEventListener('pointermove', (e) => {
      px = e.clientX; py = e.clientY; cx(px); cy(py);
      label.classList.toggle('is-left', px > innerWidth - 300);
    });
    document.addEventListener('pointerover', (e) => show(e.target.closest('[data-cursor]')));
    // the page moves under a still cursor, so re-check what it is resting on while scrolling
    scrollWatchers.push(() => {
      if (px < 0) return;
      const el = document.elementFromPoint(px, py);
      show(el ? el.closest('[data-cursor]') : null);
    });
  }

  /* ───────── 00 loader: blocks, 0→100, welcome ───────── */
  function loader(onOpen) {
    const el = $('.loader');
    if (skip) { el.remove(); root.classList.remove('is-loading'); lenis.start(); onOpen(0); return; }
    const blocks = fillGrid($('.loader__grid'), ...gridDims());
    const num = $('.loader__num');
    const count = { v: 0 };
    gsap.set('.loader__w > span', { yPercent: (i) => (i ? -112 : 112) });

    gsap.timeline()
      .to(count, {
        v: 100, duration: 2.2, ease: 'power1.inOut',
        snap: { v: [0, 7, 11, 24, 36, 41, 54, 62, 70, 88, 98, 99, 100] },
        onUpdate: () => { num.textContent = Math.round(count.v); },
      }, 0.3)
      .to('.loader__count > *', { yPercent: -125, autoAlpha: 0, duration: 0.7, ease: 'power3.in', stagger: 0.05 }, '+=0.3')
      .to('.loader__w > span', { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.08 }, '-=0.1')
      .to('.loader__w > span', { yPercent: (i) => (i ? 112 : -112), duration: 0.6, ease: 'power3.in' }, '+=0.75')
      .to('.loader__meta', { autoAlpha: 0, duration: 0.3 }, '<')
      .add(() => { el.style.background = 'none'; root.classList.remove('is-loading'); lenis.start(); onOpen(0.25); })
      .to(blocks, { opacity: 0, scale: 0.86, duration: 0.5, ease: 'power3.inOut', stagger: { each: 0.016, from: 'random' } })
      .add(() => el.remove());
  }

  /* ───────── 01 hero: stack → bloom, parallax, focus ───────── */
  let heroCards = [];
  function heroSetup() {
    heroCards = $$('.hc').filter((c) => getComputedStyle(c).display !== 'none');
    gsap.set('.hook__l > span', { yPercent: 112 });
    gsap.set('.scribble path', { drawSVG: '0%' });
    gsap.set(['.nav', '.hero__meta'], { autoAlpha: 0 });
    heroCards.forEach((c) => {
      const inn = $('.hc__in', c);
      inn.dataset.cursor = `${c.dataset.name} · ${c.dataset.kind}`;
      gsap.set(inn, { clipPath: 'inset(0% 0% 100% 0%)' });
    });
  }

  function heroIntro(delay) {
    const pin = $('.stage__pin');
    const pr = pin.getBoundingClientRect();
    const ins = heroCards.map((c) => $('.hc__in', c));
    const centers = heroCards.map((c) => { const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; });
    const stackW = pr.width * (small() ? 0.4 : 0.17);

    // everything starts as one pile in the middle of the screen
    ins.forEach((inn, i) => gsap.set(inn, {
      x: pr.left + pr.width / 2 - centers[i].x,
      y: pr.top + pr.height / 2 - centers[i].y,
      scale: stackW / centers[i].w,
    }));

    let live = false;
    gsap.timeline({ delay, onComplete: () => { live = true; } })
      .to(ins, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power3.inOut', stagger: 0.06 })
      .set(ins, { clearProps: 'clipPath' })
      .to(ins, { x: 0, y: 0, scale: 1, duration: 1.35, ease: 'expo.inOut', stagger: { each: 0.03, from: 'end' } }, '-=0.15')
      .to('.hook__l > span', { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.1 }, '-=0.85')
      .to('.scribble path', { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.45')
      .to(['.nav', '.hero__meta'], { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, '-=0.9');

    if (!fine) return;

    // depth parallax
    const par = heroCards.map((c) => {
      const p = $('.hc__p', c);
      return { d: +c.dataset.depth, x: gsap.quickTo(p, 'x', { duration: 1, ease: 'power3' }), y: gsap.quickTo(p, 'y', { duration: 1, ease: 'power3' }) };
    });
    pin.addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      par.forEach((p) => { p.x(-nx * 54 * p.d); p.y(-ny * 54 * p.d); });
    });

    // focus one, the rest step back
    // resting state is soft so the headline leads; the card under the cursor comes into focus
    const rest = { x: 0, y: 0, scale: 1, opacity: 0.82, filter: 'blur(3px)' };
    gsap.to(ins, { ...rest, duration: 1.1, ease: 'power2.out', delay: delay + 3.1 });
    const focus = (k) => {
      if (!live) return;
      ins.forEach((inn, i) => {
        if (k < 0) { heroCards[i].style.zIndex = ''; gsap.to(inn, { ...rest, duration: 0.8, ease: 'power3.out', overwrite: 'auto' }); return; }
        if (i === k) { heroCards[i].style.zIndex = 6; gsap.to(inn, { x: 0, y: 0, scale: 1.22, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', overwrite: 'auto' }); return; }
        const dx = centers[i].x - centers[k].x, dy = centers[i].y - centers[k].y;
        const dist = Math.hypot(dx, dy) || 1;
        const push = Math.max(0, 1 - dist / (innerWidth * 0.7)) * 50;
        gsap.to(inn, { x: (dx / dist) * push, y: (dy / dist) * push, scale: 0.96, opacity: 0.7, filter: 'blur(4px)', duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      });
    };
    ins.forEach((inn, i) => {
      inn.addEventListener('pointerenter', () => focus(i));
      inn.addEventListener('pointerleave', () => focus(-1));
    });
  }

  /* ───────── 01 stage: fly through → question → wash → dock → answers ───────── */
  function stage() {
    const pin = $('.stage__pin'), track = $('.answers__track'), qt = $('.question__t');
    const wash = fillGrid($('.wash'), ...gridDims());
    wrapWords(qt);
    const qws = $$('.qw > span', qt);
    gsap.set(qws, { yPercent: 118 });
    gsap.set('.chip__t', { yPercent: 118 });
    gsap.set(track, { visibility: 'visible', x: innerWidth });

    const travel = () => track.scrollWidth - innerWidth;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.stage', start: 'top top',
        end: () => `+=${Math.round(innerHeight * 3.3 + travel() + innerWidth)}`,
        pin, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
      },
    });
    stageTl = tl;

    heroCards.forEach((c) => {
      const d = +c.dataset.depth;
      tl.to(c, { z: 640 + d * 310, duration: 1, ease: 'power2.in' }, 0)
        .to(c, { autoAlpha: 0, duration: 0.22 }, 0.78);
    });
    tl.to('.hero__meta', { autoAlpha: 0, duration: 0.2 }, 0.05)
      .to('.hook__l > span', { yPercent: -118, duration: 0.45, ease: 'power2.in', stagger: 0.07 }, 0.12)
      .to(qws, { yPercent: 0, duration: 0.5, ease: 'power3.out', stagger: 0.045 }, 0.72)
      .to('.chip__bg', { scaleX: 1, duration: 0.35, ease: 'power2.inOut' }, 1.2)
      .to('.chip__t', { yPercent: 0, duration: 0.4, ease: 'power3.out' }, 1.3)
      // the page changes colour block by block, the same way it opened
      .to(wash, { opacity: 1, duration: 0.2, stagger: { amount: 0.55, from: 'random' } }, 2.1)
      .to(qt, { color: '#f5f0e6', duration: 0.3 }, 2.35)
      // the question becomes the heading of what follows
      .to(qt, {
        y: () => (small() ? 78 : 92) - qt.offsetTop,
        scale: () => (small() ? 0.5 : 0.36),
        duration: 0.7, ease: 'power2.inOut',
      }, 2.95)
      .addLabel('answers', 3.75)
      .fromTo(track, { x: () => innerWidth }, { x: () => -travel(), duration: 4.3 }, 3.3);

    const bgs = $$('.answers__bgs i');
    $$('.ans[data-i]').forEach((a) => {
      const bg = bgs[+a.dataset.i - 1];
      a.addEventListener('pointerenter', () => gsap.to(bg, { opacity: 1, duration: 0.7, ease: 'power3.inOut', overwrite: true }));
      a.addEventListener('pointerleave', () => gsap.to(bg, { opacity: 0, duration: 0.7, ease: 'power3.inOut', overwrite: true }));
    });
  }

  /* ───────── 02 work: sticky title, tiles drift past at their own pace ───────── */
  function work() {
    const split = new SplitText('.work__h', { type: 'words,chars', charsClass: 'char' });
    gsap.from(split.chars, {
      yPercent: 70, opacity: 0, rotation: () => gsap.utils.random(-14, 14), stagger: 0.03, ease: 'power2.out',
      scrollTrigger: { trigger: '.work', start: 'top 85%', end: 'top 10%', scrub: 0.6 },
    });
    $$('.tile').forEach((t) => {
      const lag = +t.dataset.lag || 1;
      const k = () => (small() ? 0.35 : 1);
      gsap.fromTo(t, { y: () => innerHeight * 0.2 * lag * k() }, {
        y: () => -innerHeight * 0.3 * lag * k(), ease: 'none',
        scrollTrigger: { trigger: t, start: 'top bottom', end: 'bottom top', scrub: 0.3 + lag * 0.7, invalidateOnRefresh: true },
      });
    });
  }

  /* ───────── 03 reel: side galleries part, the mask opens to full screen ───────── */
  function reel() {
    const video = $('.reel__mask video'), mask = $('.reel__mask');
    const words = new SplitText('.reel__title > span', { type: 'words', wordsClass: 'word' }).words;
    gsap.set(words, { opacity: 0, y: 26 });
    const ease = gsap.parseEase('power2.inOut');
    const left = $$('.rc--l, .rc--lo'), right = $$('.rc--r, .rc--ro');
    if (new URLSearchParams(location.search).has('novideo')) video.style.display = 'none'; // screenshot tools that can't capture video
    if (small()) { video.poster = 'assets/video/reel-portrait-poster.jpg'; video.src = 'assets/video/reel-portrait.mp4'; } // phones get the portrait cut
    const play = () => video.play().catch(() => {});

    ScrollTrigger.create({
      trigger: '.reel', start: 'top top', end: '+=230%', pin: '.reel__stage', scrub: true,
      onEnter: play, onEnterBack: play, onLeave: () => video.pause(), onLeaveBack: () => video.pause(),
      onUpdate(self) {
        const p = self.progress;
        const m = small() ? [30, 31] : [22, 37.5];
        const e = ease(clamp01(p / 0.72));
        const tb = ((1 - e) * m[0]).toFixed(2), lr = ((1 - e) * m[1]).toFixed(2), r = ((1 - e) * 16).toFixed(1);
        mask.style.setProperty('--m', `inset(${tb}% ${lr}% ${tb}% ${lr}% round ${r}px)`);
        mask.style.setProperty('--dim', (clamp01((p - 0.45) / 0.35) * 0.66).toFixed(3));
        const g = clamp01(p / 0.7) * (innerWidth / 2.4);
        gsap.set(left, { x: -g });
        gsap.set(right, { x: g });
        const tp = clamp01((p - 0.5) / 0.34), n = words.length;
        words.forEach((w, i) => {
          const o = clamp01((tp - i / n) / (1.5 / n));
          gsap.set(w, { opacity: o, y: (1 - o) * 26 });
        });
      },
    });
  }

  /* ───────── 04 under: a lens that follows the cursor, clipped per panel so it splits at each seam ───────── */
  function under() {
    const lenses = $$('.lens');
    const size = () => ({ w: lenses[0].offsetWidth, h: lenses[0].offsetHeight });
    // before the cursor moves (and on touch) each lens rests over its own panel's screenshot
    const rest = () => {
      const { w, h } = size();
      lenses.forEach((l) => {
        const flip = l.closest('.panel--flip');
        gsap.set(l, small()
          ? { x: flip ? 14 : innerWidth - w - 14, y: innerHeight - h - 22 }
          : { x: innerWidth * (flip ? 0.12 : 0.64), y: innerHeight * 0.52 - h / 2 });
      });
    };
    rest();
    addEventListener('resize', () => { if (!fine) rest(); });

    if (fine) {
      const xs = lenses.map((l) => gsap.quickTo(l, 'x', { duration: 0.7, ease: 'power3' }));
      const ys = lenses.map((l) => gsap.quickTo(l, 'y', { duration: 0.7, ease: 'power3' }));
      addEventListener('pointermove', (e) => {
        const { w, h } = size();
        xs.forEach((f) => f(e.clientX - w / 2));
        ys.forEach((f) => f(e.clientY - h / 2));
      });
    }

    $$('.panel__surface img').forEach((img) => {
      gsap.fromTo(img, { yPercent: 9 }, { yPercent: -9, ease: 'none', scrollTrigger: { trigger: img.closest('.panel'), start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });

    // hover a craft → another real image lands on the pile
    const stack = $('.lens__stack');
    let z = 1;
    $$('.craft').forEach((c) => {
      const on = () => {
        if (c.classList.contains('is-on')) return;
        $$('.craft').forEach((o) => o.classList.toggle('is-on', o === c));
        const d = document.createElement('div');
        d.className = 'lens__img';
        d.style.zIndex = ++z;
        d.innerHTML = `<div class="art" style="--c:${c.dataset.c}; --pos:${c.dataset.pos}" data-shot="${c.dataset.shot}"><img src="${c.dataset.img}" alt="" onerror="this.parentNode.classList.add('is-missing')" /></div>`;
        if (stack.childElementCount > 6) stack.firstElementChild.remove();
        stack.append(d);
        gsap.fromTo(d, { scale: 0, rotation: gsap.utils.random(-16, 16) }, { scale: 1, rotation: gsap.utils.random(-5, 5), duration: 1, ease: 'power4.out' });
      };
      c.addEventListener('pointerenter', on);
      c.addEventListener('click', on);
    });
  }

  /* ───────── 05 belief: two words swap, the claim changes ───────── */
  function belief() {
    const firsts = $$('.swap > span:nth-child(1)'), lasts = $$('.swap > span:nth-child(2)');
    gsap.set(lasts, { y: 0, yPercent: 125 });
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.belief', start: 'top top', end: '+=230%', pin: '.belief__stage', scrub: 0.6 },
    })
      .to(firsts, { yPercent: -125, duration: 0.7, stagger: 0.14 }, 0.2)
      .to(lasts, { yPercent: 0, duration: 0.7, stagger: 0.14 }, 0.2)
      .to('.rule', { scaleX: 1, duration: 0.3 }, 1.08)
      .to({}, { duration: 0.3 });
  }

  /* ───────── 06 name: one long line; each letter turns upright as it arrives ───────── */
  function name() {
    const stageEl = $('.name__stage'), wrap = $('.name__wrap'), text = $('.name__text');
    const chars = new SplitText(text, { type: 'chars', charsClass: 'ch' }).chars;
    const end = () => Math.max(0, wrap.scrollWidth - innerWidth);
    const wl = wrap.getBoundingClientRect().left;
    const lefts = chars.map((c) => c.getBoundingClientRect().left - wl);
    gsap.set(chars, { rotation: () => gsap.utils.random(-30, 30), rotationX: 180, transformPerspective: 700 });

    const first = chars.filter((_, i) => lefts[i] < innerWidth * 0.92);
    const rest = chars.filter((_, i) => lefts[i] >= innerWidth * 0.92);

    gsap.to(first, {
      rotation: 0, rotationX: 0, ease: 'power2.out', stagger: 0.06,
      scrollTrigger: { trigger: stageEl, start: 'top 82%', end: 'top 8%', scrub: 0.5 },
    });

    const total = end();
    const tl = gsap.timeline({
      scrollTrigger: { trigger: stageEl, start: 'top top', end: () => `+=${end()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
    });
    tl.to(wrap, { x: () => -end(), ease: 'none', duration: 1 }, 0);
    rest.forEach((c) => {
      const at = clamp01((lefts[chars.indexOf(c)] - innerWidth * 0.94) / (total || 1));
      tl.to(c, { rotation: 0, rotationX: 0, ease: 'power2.out', duration: 0.11 }, at);
    });
  }

  /* ───────── 07 start: heading rises, blocks keep breathing ───────── */
  function start() {
    const lines = new SplitText('.start__h', { type: 'lines', mask: 'lines' }).lines;
    gsap.from(lines, { yPercent: 110, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.start', start: 'top 75%', end: 'top 15%', scrub: 0.6 } });

    const g = $('.start__grid');
    const cols = small() ? 6 : 12;
    const rows = gsap.utils.clamp(2, 30, Math.ceil(g.offsetHeight / ((g.offsetWidth || 1200) / cols)));
    const cells = fillGrid(g, cols, rows);
    let timer = null;
    new IntersectionObserver(([en]) => {
      clearInterval(timer);
      if (en.isIntersecting) timer = setInterval(() => { for (let i = 0; i < 3; i++) gsap.utils.random(cells).classList.toggle('on'); }, 420);
    }).observe(g);
  }

  /* ───────── live demos: one small working piece per service, looping on a clock ───────── */
  function demos() {
    const hold = (tl, t) => tl.to({}, { duration: t });
    const build = {
      // an assistant reads a long document and answers with page references
      agent(d) {
        const user = $('.dm-user', d), lis = $$('.dm-ans li', d), chips = $$('.dm-chips span', d);
        const text = user.dataset.text, o = { n: 0 };
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
        tl.set([user, ...lis, ...chips], { autoAlpha: 0, y: 6 })
          .set(user, { autoAlpha: 1, y: 0 })
          .fromTo(o, { n: 0 }, { n: text.length, duration: 1.3, ease: 'none', onUpdate: () => { user.textContent = text.slice(0, Math.round(o.n)); } })
          .to(lis, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.3 }, '+=0.4')
          .to(chips, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.1 }, '-=0.05');
        hold(tl, 3.6).to([user, ...lis, ...chips], { autoAlpha: 0, duration: 0.35 });
        return tl;
      },
      // a sketch becomes a clickable prototype, then a live product
      mvp(d) {
        const win = $('.dm-win', d), stage = $('.dm-stage', d);
        const nav = $('.dm-nav', d), hero = $('.dm-hero', d), tiles = $$('.dm-row i', d), btn = $('.dm-btn', d), dots = $$('.dm-top i', d);
        const parts = [nav, hero, ...tiles, btn];
        const label = (t) => () => { stage.textContent = t; };
        const clear = 'rgba(22,19,14,0)', grey = 'rgba(22,19,14,0.13)', line = 'rgba(22,19,14,0.45)';
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        tl.call(label('Week 1 · sketch'))
          .set(win, { backgroundColor: clear, borderStyle: 'dashed', borderColor: line })
          .set(parts, { backgroundColor: clear, borderColor: line })
          .set(dots, { backgroundColor: clear });
        hold(tl, 1.4)
          .call(label('Week 2 · clickable'))
          .to(parts, { backgroundColor: grey, borderColor: clear, duration: 0.5, stagger: 0.06 })
          .to(win, { borderColor: 'rgba(22,19,14,0.8)', duration: 0.4 }, '<');
        hold(tl, 1.3)
          .call(label('Week 4 · live'))
          .to(win, { backgroundColor: '#fffdf8', duration: 0.5 })
          .to(nav, { backgroundColor: '#2747ff', duration: 0.4 }, '<')
          .to(hero, { backgroundColor: '#cfc8ff', duration: 0.4 }, '<0.08')
          .to(tiles, { backgroundColor: (i) => ['#ffb400', '#f24b2a', '#0e6b50'][i], duration: 0.4, stagger: 0.08 }, '<0.08')
          .to(btn, { backgroundColor: '#16130e', duration: 0.4 }, '<0.1')
          .to(dots, { backgroundColor: (i) => ['#f24b2a', '#ffb400', '#0e6b50'][i], duration: 0.3 }, '<');
        hold(tl, 3.2);
        return tl;
      },
      // a shop that keeps working at 2 a.m.
      store(d) {
        const toasts = $$('.dm-toasts li', d), clock = $('.dm-clock', d);
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
        tl.call(() => { clock.textContent = '02:14'; })
          .set(toasts, { autoAlpha: 0, y: 14 })
          .to(toasts, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)', stagger: 0.75 }, 0.5)
          .call(() => { clock.textContent = '02:15'; }, null, 2.2);
        hold(tl, 3.4).to(toasts, { autoAlpha: 0, duration: 0.35 });
        return tl;
      },
      // every record is checked; a changed one is refused
      sec(d) {
        const marks = $$('.dm-checks b', d), verdict = $('.dm-verdict', d);
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
        tl.set(marks, { autoAlpha: 0 }).set(verdict, { autoAlpha: 0, scale: 0.85 })
          .to(marks, { autoAlpha: 1, duration: 0.2, stagger: 0.55 }, 0.5)
          .to(verdict, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '+=0.3');
        hold(tl, 3.4).to([...marks, verdict], { autoAlpha: 0, duration: 0.3 });
        return tl;
      },
      // the week so far, then where Friday is heading
      data(d) {
        const line = $('.dm-linesvg', d), fore = $$('.dm-f', d), dot = $('.dm-dot', d), tag = $('.dm-tag', d);
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        tl.set(line, { clipPath: 'inset(0% 100% 0% 0%)', autoAlpha: 1 }).set(fore, { autoAlpha: 0 }).set(dot, { scale: 0, autoAlpha: 1 }).set(tag, { autoAlpha: 0 })
          .to(line, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power2.inOut' }, 0.3)
          .to(fore, { autoAlpha: 1, duration: 0.15, stagger: 0.14 })
          .to(dot, { scale: 1, duration: 0.5, ease: 'back.out(2.5)' })
          .to(tag, { autoAlpha: 1, duration: 0.3 }, '<');
        hold(tl, 3.4).to([line, ...fore, dot, tag], { autoAlpha: 0, duration: 0.3 });
        return tl;
      },
      // each new record locks onto the one before it
      chain(d) {
        const blks = $$('.dm-blk', d);
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
        tl.set(blks, { autoAlpha: 0, x: -12, backgroundColor: '#ffb400' });
        blks.forEach((b, i) => {
          tl.to(b, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, 0.4 + i * 0.8)
            .to(b, { backgroundColor: '#f5f0e6', duration: 0.5 }, 0.85 + i * 0.8);
        });
        hold(tl, 3.2).to(blks, { autoAlpha: 0, duration: 0.3 });
        return tl;
      },
    };

    $$('.demo[data-demo]').forEach((d) => {
      const tl = build[d.dataset.demo](d);
      if (d.closest('.hc')) tl.progress(0.55, false); // hero cards open already filled in, not blank
      tl.pause();
      new IntersectionObserver(([en]) => tl.paused(!en.isIntersecting)).observe(d);
    });
  }

  /* ───────── boot ───────── */
  document.fonts.ready.then(() => {
    heroSetup();
    stage();
    work();
    reel();
    under();
    belief();
    name();
    start();
    demos();
    chrome();
    loader(heroIntro);
    const land = () => {
      ScrollTrigger.refresh();
      if (hash.length < 2) return;
      const target = hash === '#answers' && stageTl ? stageTl.scrollTrigger.labelToScroll('answers') : $(hash);
      if (target) lenis.scrollTo(target, { immediate: true, force: true });
    };
    if (document.readyState === 'complete') land();
    else addEventListener('load', land);
  });
})();
