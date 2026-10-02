/* Inner pages: smooth scroll, heading rise, nav tone, a little drift. Quieter than the homepage on purpose. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  const lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const nav = $('.nav');
  const toned = $$('[data-tone]').filter((el) => el !== nav);
  const tone = () => {
    let t = nav.dataset.tone;
    for (const el of toned) if (el.getBoundingClientRect().top <= 40) t = el.dataset.tone;
    if (nav.dataset.tone !== t) nav.dataset.tone = t;
  };
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => { gsap.set('.progress i', { scaleY: self.progress }); tone(); } });

  document.fonts.ready.then(() => {
    const h1 = $('.phero h1, .article h1');
    if (h1) {
      const lines = new SplitText(h1, { type: 'lines', mask: 'lines', linesClass: 'line' }).lines;
      gsap.from(lines, { yPercent: 112, duration: 1.1, ease: 'power4.out', stagger: 0.1, delay: 0.15 });
      gsap.from('.phero .eyebrow, .phero__lede, .article .eyebrow, .article__lede, .back', { autoAlpha: 0, y: 14, duration: 0.9, ease: 'power2.out', stagger: 0.08, delay: 0.5 });
    }

    // big statements and case headings rise line by line as their sheet arrives, tied to scroll
    $$('.big, .case__head h2, .founder__txt h2').forEach((el) => {
      const lines = new SplitText(el, { type: 'lines', mask: 'lines' }).lines;
      gsap.from(lines, { yPercent: 110, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: 0.6 } });
    });
    $$('.case__shot, .founder__pic').forEach((el) => {
      gsap.fromTo(el, { yPercent: 7 }, { yPercent: -7, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });

    const startH = $('.start__h');
    if (startH) {
      const lines = new SplitText(startH, { type: 'lines', mask: 'lines' }).lines;
      gsap.from(lines, { yPercent: 110, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.start', start: 'top 75%', end: 'top 15%', scrub: 0.6 } });
    }
    ScrollTrigger.refresh();
  });

  // the block grid in the closing section keeps breathing
  const g = $('.start__grid');
  if (g) {
    const cols = innerWidth <= 820 ? 6 : 12;
    const rows = gsap.utils.clamp(2, 30, Math.ceil(g.offsetHeight / ((g.offsetWidth || 1200) / cols)));
    g.style.setProperty('--cols', cols);
    g.innerHTML = '<i></i>'.repeat(cols * rows);
    const cells = [...g.children];
    let timer = null;
    new IntersectionObserver(([en]) => {
      clearInterval(timer);
      if (en.isIntersecting) timer = setInterval(() => { for (let i = 0; i < 3; i++) gsap.utils.random(cells).classList.toggle('on'); }, 420);
    }).observe(g);
  }
})();
