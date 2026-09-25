# Aletheia — motion direction research / 25 September 2026

## Brief

The user rejected the photographic revision as dull and clunky. They want the site to feel like a continuous film controlled by scrolling, using one A in twenty visual states before applying the direction. The latest instruction stresses client-project discipline, design principles, web research and better GSAP guidance. This separate concept study does not modify any client website file.

## Reference observations

- [Lusion](https://lusion.co/): inspected live homepage and its opening scroll. Its initial composition pairs concise, large typography with a dominant blue/white/black 3D form in a broad viewport. Important lesson: the object, type and whitespace have distinct roles. Do not copy the geometry, copy or layout literally.
- [Unseen Studio](https://unseen.co/): inspected its entry and live spatial homepage. A coherent architectural scene provides continuity; concise interface labels allow the scene to dominate. Important lesson: movement belongs to an authored environment rather than unrelated floating cards. Avoid a mandatory entry gate for Aletheia.
- [Immersive Garden on Awwwards](https://www.awwwards.com/sites/immersive-garden-website): reviewed its listing and documented section transitions, project listing and rapid-scroll interaction. This was a listing review, not a full live-site performance assessment.
- [GSAP showcase](https://gsap.com/showcase/): official curated starting point for current work, including Unseen Studio, Illoca, Revelatio and Graffico. A showcase is inspiration, not proof of business suitability.
- Original user references: Founderz and Ignite. Preserve the request for scale, colour and energy; avoid translating it into a copy of their branding.

## Recommended visual principle

A as a portal: the mark is an object, an opening, a system and a frame for evidence. Each transition changes the meaning or hierarchy of the same object. Five acts: identity → system → intelligence → work → invitation. The concept uses a geometric A as a motion prop; it is not an approved replacement logo.

Three possible routes were proposed: a portal (recommended for depth and project framing), a folding ribbon (more fluid and graphic), and particles (more computational but easier to become a generic tech visual). The study mixes a brief point-assembly chapter into the portal direction. The client should choose the direction before a homepage implementation.

## Design constraints

- Clear hierarchy: one message and one dominant moving form at a time.
- Repetition and continuity: the same angles, materials and A geometry recur through all twenty states.
- Contrast: a pale canvas, electric blue identity, coral detail and limited acid-yellow editorial accents.
- Rhythm: transitions alternate with reading holds; the project chapter must be understandable without chasing the text.
- Spatial cause and effect: movement opens space or establishes a relationship. Avoid constant random motion.
- Featured work is evidence. Prototype title cards use existing project names and describe the concept honestly; they are not invented product screenshots.
- Motion has an end: resolve to the identity and contact invitation, rather than an endless loop.
- Production must preserve clear service discovery, visible contact access and reduced-motion alternatives. It must be checked on real low-end/mobile hardware before claiming smooth performance.

## Technical research and skills

- [Official ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) supports a single timeline controlled by pinning and scroll progress.
- [Three.js documentation](https://threejs.org/docs/) for real camera perspective, extruded geometry, physical materials and instanced points.
- [GreenSock's official skills repository](https://github.com/greensock/gsap-skills) was reviewed. Installed `gsap-core`, `gsap-timeline`, `gsap-scrolltrigger`, and `gsap-performance` using Codex's skill installer. The files are in the user's Codex skill directory, outside this project. They will be discoverable next turn and were read manually for this work.
- Skill prose is guidance, not unquestionable code. The ScrollTrigger skill contains a `Max.max` typo in an example and an incorrect refresh-priority direction; those examples were not used. The official API remains the reference.

## Running and scope

Independent local prototype: `http://127.0.0.1:4174/`.

Run from repository root: `npx vite --config docs/brand/motion-study/vite.config.mjs`.
Build: `npx vite build --config docs/brand/motion-study/vite.config.mjs`.

It imports the project's existing GSAP and Three.js packages; no production dependencies, routes or homepage components were changed. Twenty thumbnail images are rendered from the same 3D scene. Each selects its exact keyframe. A download control exports the complete storyboard to PNG. A play/pause control and native range control offer a review path independent of manual scrolling. This is an animatic/concept prototype, not a finished client website or a rendered video file.

## Verification

- Standalone Vite production build passed. Its Three.js-containing JavaScript bundle is 670.46 kB minified / 187.90 kB gzip and triggers Vite's bundle-size warning. Production integration still needs a loading and device-performance pass.
- Checked desktop at 1280 × 720 and phone at 390 × 600: readable project frame, visible controls, twenty selectable frames and no horizontal overflow on the phone.
- Verified playback reaches the final state; play/pause resumes and freezes progress; native scrolling advances the sequence; keyboard ArrowRight advances the range control.
- Exported and visually inspected the 2400 × 2400 PNG board with all twenty frames and undistorted thumbnail proportions.
- Fresh phone session reported no console warnings or errors. Reduced-motion handling was source-reviewed, not tested with an OS preference override.
- Verified no changes to `website/` against `c82ce50`, the pre-study commit.
