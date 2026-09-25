# Aletheia AI Scroll Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a vibrant, predominantly light Aletheia AI website with the approved logo, connected scroll scenes and an IGNITE-inspired Featured Projects section as its centrepiece.

**Architecture:** Retain the current React/Vite application and existing routes. Shared identity primitives support every page; the homepage gets distinct editorial sections and a dedicated Featured Projects component. GSAP owns scroll-linked motion and pointer preview movement, with native static layouts for reduced motion and touch.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind 4, React Router 7, GSAP 3, Lenis and existing Framer Motion. Node's built-in test runner for small interaction utilities; supported browser tools for visual/interaction verification.

**Spec:** `docs/brand/2026-09-25-aletheia-rebrand-review.md`, supplemented by `docs/brand/reference-review/ignite-recording-notes.md` and the approved `docs/brand/concepts/aletheia-ai-logo-v1.png`.

## Execution result

Implemented on `codex/aletheia-bright-rebrand`. See `docs/brand/rebrand-verification.md` for exact checks, evidence and limitations. The implementation was kept as one cohesive review commit rather than separate cosmetic commits. Company collateral was added at the user’s subsequent request.

## Global Constraints

- The exact company name remains **Aletheia AI**.
- Keep AI Product Engineering, MVP & Rapid Prototyping, Full-Stack Development including websites, Cybersecurity & Auditing, Blockchain & Web3, and Data Engineering & ML.
- Featured Projects is a central acceptance requirement, not an optional embellishment.
- Preserve existing case-study, product and blog URLs.
- Palette: warm ivory #F4F1E9, cobalt #2448FF, coral #FF775E, ink #17191C.
- Keep the existing real Web3Forms contact integration. Do not restore the unused simulated form.
- Do not invent project screens, customers, testimonials or results. Label illustrative project covers.
- Reduced-motion mode renders all content in normal document flow, without pinning or scrubbing.
- Build the whole brand system across routes; a redesigned homepage with unchanged dark inner pages is incomplete.

## Review Focus

1. Fast pointer movement near viewport edges: the project preview remains in bounds and never intercepts a project link (Task 2).
2. Keyboard and touch input: every project remains discoverable and navigable without hover (Task 2).
3. Route changes and responsive resizing during pinned motion: no stale spacers, hidden content or stuck scroll (Task 3).
4. Slow or failed preview media: the work section retains its dimensions, project names and links (Task 2).
5. Form rejection or network failure: show failure without falsely confirming delivery or discarding input (Task 6).

## File boundaries

- `website/src/data/brand.ts`: name, contact, social and asset paths.
- `website/src/components/ui/BrandLogo.tsx`: approved logo lockup used by header/footer.
- `website/src/index.css`: semantic colors, typography and base surfaces; keep component-specific motion styling separate.
- `website/src/data/featuredProjects.ts`: four project records tied to existing detail slugs.
- `website/src/components/sections/FeaturedProjects/`: project list, preview and geometry utility/tests; this component owns its hover/focus state.
- Existing `Hero`, `Services`, `Products`, `Process`, `About`, `Navbar`, `Footer` sections: preserve responsibility and replace presentation.
- `website/src/hooks/useHomeMotion.ts`: scoped homepage timelines only.
- Existing `SmoothScroll`, `PageHero`, `PageTransition`, `CTASection` and UI primitives: shared behavior/style updates.
- Existing `website/src/pages/` routes: retain their data-driven content and adopt the new primitives.

## Task 1: Identity and shared light surfaces

**Files:** Create `website/src/data/brand.ts`, `website/src/components/ui/BrandLogo.tsx`, `website/public/brand/aletheia-ai-logo.png`. Modify `website/src/index.css`, `website/index.html`, `website/src/components/ui/Button.tsx`, `Card.tsx`, `GlassPanel.tsx`, `SectionHeading.tsx`, `website/src/components/shared/PageHero.tsx`, `website/src/components/sections/Navbar/index.tsx`, `Footer/index.tsx` and `website/src/data/navigation.ts`.

**Interfaces:** `BrandLogo({className?: string})` renders the approved transparent image with alt text `Aletheia AI`; `brand` exports `{name, logo, email, socials}`. Semantic CSS tokens are `--paper`, `--ink`, `--cobalt`, `--coral`, `--text-muted`, `--line`.

- [x] Record baseline `npm run build --workspace=website` and `npm run lint --workspace=website` after installing locked dependencies in the execution checkout. Separate existing failures from introduced ones.
- [x] Copy the approved PNG without overwriting the source concept. Use the approved geometry for a small icon/favicon; validate it visually against the original.
- [x] Establish the light theme with explicit tokens rather than globally reversing the meaning of `text-white`:

```css
:root { --paper:#F4F1E9; --ink:#17191C; --cobalt:#2448FF; --coral:#FF775E;
  --text-muted:#5A5C63; --line:rgba(23,25,28,.18); }
body { background:var(--paper); color:var(--ink); }
.brand-display { font-size:clamp(3.5rem,11vw,11rem); line-height:.92; letter-spacing:-.045em; }
:focus-visible { outline:3px solid var(--cobalt); outline-offset:5px; }
```

- [x] Choose and license-check a condensed display font, using the actual hero and project headings as a specimen; retain a legible body family. Load only required font files/weights. Preserve a readable fallback.
- [ ] Replace shield lockups in navigation/footer with `BrandLogo`. Use navigation Work, Services, Products, Company, Start a project. Every service remains discoverable through `/services`.
- [x] Use actual router links for navigation CTAs. Do not rely on the current Button `asChild` span to provide link semantics. Example: `<Link className="brand-button" to="/contact">Start a project</Link>`.
- [x] Verify the header, mobile menu and shared page hero on home and one inner route. Check contrast, focus, long labels and logo clarity. Run build and lint; commit the identity foundation.

## Task 2: Featured Projects — implement and verify before decorative scenes

**Files:** Create `website/src/data/featuredProjects.ts`, `website/src/components/sections/FeaturedProjects/index.tsx`, `FeaturedProjects.css`, `previewPosition.mjs`, `previewPosition.d.mts`, `previewPosition.test.mjs`. Modify `website/src/pages/Home.tsx`.

**Interfaces:** `FeaturedProject = {slug:string; name:string; category:string; summary:string; image:string; imageAlt:string; illustrative:boolean}`. Export `featuredProjects: FeaturedProject[]`. `FeaturedProjects()` renders `<section id="work" aria-labelledby="work-title">`. `previewPosition(x,y,width,height,viewportWidth,viewportHeight)` returns `{left:number,top:number}`.

- [x] Populate four records using existing case slugs: `heurisight-rag`, `rd-fitness-platform`, `codecraft-cli`, `inscrape-sdk`. Use correct project names and categories. Check candidate local images visually; use clearly labeled project illustrations until genuine screenshots are supplied.
- [x] Write the edge-position tests before the utility:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { previewPosition } from './previewPosition.mjs';
test('preview stays inside the bottom-right viewport edge', () => {
  assert.deepEqual(previewPosition(990,690,360,240,1000,700), {left:624,top:444});
});
test('small viewport never creates negative coordinates', () => {
  const p = previewPosition(2,2,360,240,320,220);
  assert.ok(p.left >= 0 && p.top >= 0);
});
```

- [x] Run `node --test website/src/components/sections/FeaturedProjects/previewPosition.test.mjs`; expect failure because the implementation is absent. Implement the bounded coordinates and repeat for a pass:

```js
export function previewPosition(x,y,width,height,viewportWidth,viewportHeight) {
  return {
    left: Math.max(0, Math.min(x+24, viewportWidth-width-16)),
    top: Math.max(0, Math.min(y-height/2, viewportHeight-height-16)),
  };
}
```

- [x] Render a large “FEATURED PROJECTS” heading and four full-width, thin-rule rows. Each row is one link with name, category, summary and arrow. Selected row uses ink or cobalt with contrasting text. Put this directly below the hero.

```tsx
<Link to={`/case-studies/${project.slug}`}
  className="project-row" data-project={project.slug}
  onPointerEnter={() => setActive(project.slug)}
  onFocus={() => setActive(project.slug)}>
  <span>{project.name}</span><span>{project.category}</span>
  <span aria-hidden="true">↗</span>
</Link>
```

- [x] Use one shared fixed-position preview with `pointer-events:none`, `aria-hidden=true`, reserved aspect ratio and bounded coordinates. Use GSAP setters/tweens on a ref for pointer movement, not React state per frame. Clear it on section leave, blur out of the section and route unmount. Cancel its tweens on cleanup.
- [x] Enable floating preview only for `(min-width: 900px) and (hover: hover) and (pointer: fine)`. Keyboard focus anchors the preview in a stable region away from the text. Touch/compact layouts show image and description inline. Reduced motion removes interpolation and tilt while keeping previews available.
- [x] Handle image load failure with a branded project-name cover in the reserved box; do not hide the link or collapse the row. Mark illustrative images visibly as “Project illustration.”
- [x] Browser verification: move rapidly across all four rows and viewport edges, focus every row with Tab, follow a case link and return, test touch-sized layout, and block a preview image to inspect fallback. Expected: all projects reachable, no preview blocking clicks, no horizontal overflow or broken-image layout.
- [x] Run geometry tests and build. Capture desktop hover and mobile inline previews for review; commit Featured Projects as a separate deliverable.

## Task 3: Opening and connected scroll choreography

**Files:** Modify `website/src/components/sections/Hero/index.tsx`, `website/src/components/shared/SmoothScroll.tsx`, `website/src/App.tsx`, `website/src/pages/Home.tsx`, `website/src/hooks/useReducedMotion.ts`. Create `website/src/hooks/useHomeMotion.ts`, `website/src/components/sections/BrandStatement/index.tsx`.

**Interfaces:** `useHomeMotion(root: RefObject<HTMLElement|null>): void` owns only elements inside the supplied homepage root. `BrandStatement()` renders a cobalt chapter. Existing `SmoothScroll({children})` remains the global scroll integration.

- [x] Build a light type-led hero using “Intelligence. Put to work.” and “AI systems, websites and software. Built around your business.” Place the six service labels below it, a real `/contact` link and an anchor to `#work`. Use the logo at navigation scale; do not reinstate the old neural sphere.
- [x] Remove the mandatory preloader from `App`. Move scroll-to-top into a route-dependent effect that handles hashes explicitly and never runs during render.
- [x] Create one short cobalt statement transition after Featured Projects. Keep body text readable and limit homepage pinning to at most two brief sequences. Motion starts with content in its visible, static layout.
- [x] Scope GSAP to the homepage and media preference:

```tsx
useEffect(() => {
  if (!root.current) return;
  const mm = gsap.matchMedia();
  const ctx = gsap.context(() => {
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('[data-work-heading]', {xPercent:4}, {xPercent:0,
        ease:'none', scrollTrigger:{trigger:'#work',start:'top bottom',end:'top 25%',scrub:.5}});
    });
  }, root);
  return () => { mm.revert(); ctx.revert(); };
}, [root]);
```

- [x] Start Lenis only when smooth motion is appropriate; destroy and detach ticker/listeners when preference or input mode changes. Avoid double RAF loops. Refresh ScrollTrigger after font/image layout changes.
- [ ] Browser regression: scroll midway through a scene, navigate away/back, resize across 900px, change reduced-motion preference, use hash navigation and browser Back. Expected: no stale pin spacers, no hidden essential content, valid anchor positions and working scroll.
- [ ] Verify short and fast wheel gestures and touch scrolling. Run build/lint, then commit the motion system.

## Task 4: Full homepage story and service breadth

**Files:** Modify `website/src/pages/Home.tsx`, `website/src/components/sections/Services/index.tsx`, `Products/index.tsx`, `Process/index.tsx`, `About/index.tsx`, `website/src/components/shared/CTASection.tsx`, `website/src/data/copy.ts`.

**Interfaces:** Reuse existing `services`, `products`, `team` data and detail route slugs. Homepage order is Hero → FeaturedProjects → BrandStatement → Services → Process → Products → People → CTA.

- [x] Replace the six identical glass cards with readable numbered service rows; retain all six named services and explicit website development wording.
- [x] Use four concise process stages, each with a concrete deliverable. Use actual founder imagery from `/images/founder/ganesh-khetawat.png` rather than generated people.
- [x] Use distinct product showcase panels and real links: `<Link to={`/products/${product.id}`}>Explore {product.name} ↗</Link>`. Keep product descriptions consistent with `website/src/data/products.ts`.
- [x] Finish with a vibrant contact chapter and a large Aletheia AI wordmark. No fabricated result counters or new testimonials. Retain existing claims only with their appropriate context; do not amplify uncertain figures.
- [ ] Verify every homepage link, all six services and all three products. Compare the static reduced-motion version with the animated version for content parity. Run build/lint and commit.

## Task 5: Consistent inner-page redesign

**Files:** Modify all existing page modules under `website/src/pages/About`, `Services`, `Products`, `CaseStudies`, `Blog`, `Contact`, `Careers`, `Industries`; update `website/src/components/shared/FilterButtons.tsx`, `Breadcrumbs.tsx`, `DetailNavigation.tsx`, `FAQAccordion.tsx`, `AnimatedSection.tsx`, `PageTransition.tsx` as needed. Reconcile `website/src/pages/Concept.tsx` with the shared product data.

**Interfaces:** Preserve exported page components, route parameters and data schemas. Use the shared light surfaces and explicit colored chapter styles from Task 1.

- [x] Replace hard-coded white text on light surfaces with semantic ink/muted colors. Keep white text only in intentionally colored/dark regions. Remove obsolete violet glow decoration.
- [x] Make case-study pages emphasize project identity, challenge, approach and evidence. Correct the case-study index's outdated claim that every project is a security solution.
- [x] Restyle service/product pages, readable blog/article templates, company, careers and industries. Keep detail links, filters, FAQ controls and breadcrumbs functional.
- [x] Remove conflicting duplicate product claims from `/concept` by consuming shared product data; keep its experiment separate from the main homepage.
- [x] For each route family, verify one index and one detail page plus unknown detail slug behavior. Use `website/public/sitemap.xml` as the route inventory. All existing URLs must still reach meaningful content.
- [x] Run build/lint and commit the inner-page system.

## Task 6: Contact integrity and brand metadata

**Files:** Modify `website/src/pages/Contact/index.tsx`, `website/src/components/shared/PageSEO.tsx`, `website/index.html`, `website/public/favicon.svg`, `website/public/images/og-preview.png`; consume `website/src/data/brand.ts`.

**Interfaces:** Keep existing form fields and Web3Forms payload. `brand.socials` supplies the same accounts to the footer and organization JSON-LD.

- [x] Restyle the real contact route without changing its destination or adding a simulated success path. Keep values on rejection; reset only on confirmed success.
- [ ] Verify validation and success/failure behavior with an intercepted/stubbed request in the supported local browser test environment. Test `success:false`, network failure and confirmed success. Do not send a real inquiry as an automated test.

```ts
if (!response.ok || !result.success) {
  throw new Error(result.message || 'Submission failed');
}
// Reset follows confirmed delivery only; rejection retains user input.
```

- [x] Apply approved branding to favicon and social preview. Synchronize the company name, domain, email and social links across visible UI and metadata. Preserve existing article descriptions and canonical paths.
- [x] Verify one canonical/title per route, valid social preview paths and the contact fallback email. Run build/lint and commit.

## Task 7: Acceptance and preview handoff

**Files:** Add `docs/brand/rebrand-verification.md`; update the plan checkboxes with actual results.

**Interfaces:** Evidence includes commands, browser checks, screenshots, limitations and the working preview URL. Do not call an unmeasured target a passed result.

- [x] Run `node --test website/src/components/sections/FeaturedProjects/previewPosition.test.mjs`, `npm run build --workspace=website`, `npm run lint --workspace=website`. Expected: passing checks, or explicitly separated baseline failures that have been assessed.
- [ ] Verify 390px, 768px and 1440px layouts; confirm actual viewport dimensions before recording results. Check long text, landscape, keyboard, touch, reduced motion and failed media.
- [x] Confirm Featured Projects matches the reference behavior: prominent list, row activation, smooth floating preview, correct case-study navigation, equivalent mobile and keyboard access.
- [ ] Check route changes while scrolling, contact states and retained service breadth. Measure performance against LCP ≤2.5s, CLS ≤0.1 and INP ≤200ms where tooling supports real measurement.
- [x] Obtain a fresh review of the completed diff; fix substantive issues and rerun affected checks. Present the working local preview and a concise change report. Publication is a separate final action after review.

## Execution recommendation

Implement natively in this task, with one independent review at the end. The identity, preview interaction and scroll layout share enough visual decisions that keeping one implementer is efficient. Task 2 is the first feature checkpoint after the identity foundation so the user's most important interaction is verified early.
