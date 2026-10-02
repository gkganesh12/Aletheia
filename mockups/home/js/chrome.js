/* Shared on every page: mobile menu, dropdowns on touch, cookie choice. No dependencies. */
(() => {
  const root = document.documentElement;
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.menu');

  if (burger && menu) {
    const set = (open) => {
      root.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    };
    burger.addEventListener('click', () => set(!root.classList.contains('menu-open')));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  // dropdowns open on hover/focus in CSS; a tap toggles focus so they work on touch too
  document.querySelectorAll('.nav__dd > button').forEach((b) => b.addEventListener('click', () => {
    if (document.activeElement === b && b.dataset.open) { b.blur(); delete b.dataset.open; } else { b.focus(); b.dataset.open = '1'; }
  }));

  /* cookie choice — stored only in this browser */
  const KEY = 'aletheia-cookie-choice';
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch { /* private mode: ask again next visit */ } };
  const banner = document.querySelector('.cookie');
  const state = document.querySelector('[data-cookie-state]');
  const paint = () => { if (state) state.textContent = read() === 'accept' ? 'allowed' : 'not set'; };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cookie]');
    if (!b) return;
    write(b.dataset.cookie);
    paint();
    if (banner) { banner.classList.remove('is-in'); setTimeout(() => { banner.hidden = true; }, 900); }
    // production: load Google Analytics here only when the choice is "accept"
  });

  /* ───────── page behaviour that has to work with or without motion ───────── */
  const $$ = (q, c = document) => [...c.querySelectorAll(q)];
  const relayout = () => { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); };

  // blog filters
  const filters = $$('.filters button');
  filters.forEach((b) => b.addEventListener('click', () => {
    filters.forEach((o) => o.classList.toggle('is-on', o === b));
    $$('.post').forEach((p) => { p.hidden = b.dataset.filter !== '*' && p.dataset.cat !== b.dataset.filter; });
    relayout();
  }));

  // careers: one role open at a time; "Apply" pre-selects that role in the form
  const roles = $$('.role');
  roles.forEach((r) => r.addEventListener('toggle', () => {
    if (r.open) roles.forEach((o) => { if (o !== r) o.open = false; });
    relayout();
  }));
  $$('[data-role]').forEach((a) => a.addEventListener('click', () => {
    const sel = document.querySelector('#f-position');
    if (sel) sel.value = a.dataset.role;
  }));
  const refInput = document.querySelector('#f-referralCode');
  if (refInput) {
    const code = (new URLSearchParams(location.search).get('ref') || '').trim().toUpperCase();
    if (/^[A-Z0-9_-]{1,40}$/.test(code)) refInput.value = code;
  }

  /* forms: same delivery as the current site (Web3Forms → the studio inbox) */
  const W3F_KEY = 'b1d6246c-dfe6-41f6-8c93-7374d0c9919c';
  const payloadFor = {
    contact: (d) => ({
      subject: `New inquiry from ${d.name} — ${d.service}`,
      from_name: d.name, name: d.name, email: d.email,
      company: d.company || 'Not provided', phone: d.phone || 'Not provided',
      service: d.service, message: d.message,
    }),
    career: (d) => {
      const ref = /^[A-Z0-9_-]{1,40}$/.test((d.referralCode || '').trim().toUpperCase()) ? d.referralCode.trim().toUpperCase() : '';
      return {
        subject: `Job Application: ${d.position} — ${d.name}${ref ? ` [Ref: ${ref}]` : ''}`,
        from_name: d.name, name: d.name, email: d.email,
        phone: d.phone || 'Not provided', portfolio: d.portfolio || 'Not provided',
        position: d.position, referral_code: ref || 'Not provided', message: d.message,
      };
    },
  };
  $$('form[data-form]').forEach((form) => {
    const status = form.querySelector('.form__status');
    const say = (cls, html) => { status.className = `form__status ${cls}`; status.innerHTML = html; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      $$('.field', form).forEach((f) => {
        const el = f.querySelector('input, select, textarea');
        const bad = !el.checkValidity();
        f.classList.toggle('is-bad', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      if (!ok) { say('is-bad', 'Please fill in the highlighted fields.'); return; }
      const d = Object.fromEntries(new FormData(form));
      if (d.botcheck) return; // bots tick the hidden box
      form.classList.add('is-busy');
      say('', 'Sending…');
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payloadFor[form.dataset.form](d), access_key: W3F_KEY }),
        });
        const out = await res.json();
        if (!res.ok || out.success !== true) throw new Error(out.message || 'Submission failed');
        form.reset();
        say('is-ok', form.dataset.form === 'career' ? 'Application sent. We’ll be in touch.' : 'Message sent. We’ll be in touch soon.');
      } catch {
        say('is-bad', 'Something went wrong. Please try again or email <a href="mailto:info@aletheiaai.tech">info@aletheiaai.tech</a>.');
      } finally {
        form.classList.remove('is-busy');
      }
    });
  });

  paint();
  if (banner && !read()) {
    banner.hidden = false;
    const delay = root.classList.contains('is-loading') ? 7000 : 1400;
    setTimeout(() => banner.classList.add('is-in'), delay);
  }
})();
