# Aletheia AI — engineering story revision

## Direction

The first bright rebrand relied on condensed all-caps headlines and generic geometric covers. The user asked for more considered art direction, the visual confidence of Founderz, and a scroll-led experience that shows a real engineering company.

The revised identity uses normal-width DM Sans, a cobalt opening with coral strands drawn in SVG, and quiet ivory, sage and lavender chapters. The visual idea is many strands becoming one working system. The approved logo remains. Featured work immediately follows the opening.

Homepage order: positioning and Signal/Code toggle → featured HeuriSight architecture and four project links → three-stage build narrative → public repository commits → six capabilities → three owned products → founder → contact.

## References and sources

- https://founderz.com/ — user's primary reference; confident colour and unified composition. User's screenshot informed this revision.
- https://igniteagency.com/ — agency presentation and work-led navigation.
- https://www.awwwards.com/websites/storytelling/ — storytelling research.
- https://basement.studio/ — visual identity connected to actual work.
- https://www.14islands.com/ — restrained typography and room around work.
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — scroll-linked progress and matchMedia lifecycle.
- https://github.com/gkganesh12/Inscrape — actual Python SDK example.
- Public commit sources and full URLs are stored in `website/src/data/buildLog.ts`. The selection was fetched from GitHub and verified on September 25, 2026. It is explicitly a curated snapshot, not live telemetry or an activity total.
- Project diagrams use existing case-study content. They are labelled illustrations, not product screenshots. No new performance metrics or customer endorsements were invented. Unsubstantiated percentage language was removed from Nirvana's product summary.

## Motion and interaction

GSAP moves the opening strands with scroll, subtly translates the feature diagram, advances a sticky system board through problem → connected system → release, fills the build progress line, and applies mild founder-photo parallax. The Signal/Code toggle preserves the animated SVG in the DOM. Motion is scoped and reverted on unmount/media changes.

Desktop/tablet storytelling runs from 600px wide and 650px tall, with reduced motion disabled. Narrow phones, short windows and reduced-motion preferences receive a readable static composition. Existing mouse-following project previews, keyboard placement, mobile inline covers and real case-study links remain.

## Verification

- Production build: passed (`npm run build --workspace=website`).
- ESLint: passed (`npm run lint --workspace=website`).
- Existing nine meaningful preview-bounds and contact-submission tests: passed.
- `git diff --check`: passed.
- Browser review at 1440×1000, 768×1024, 390×844 and 320×740.
- Tablet board observed at stages 1 and 2 with changing progress; desktop sticky stage progression observed.
- Signal/Code toggle checked on desktop and mobile. Mobile SDK source link fits inside its panel.
- All 47 routes audited at 320px: meaningful H1, one canonical link, no horizontal document overflow. Audit saved in `website-previews-v2/route-audit-320.json`.
- Narrow-phone HeuriSight diagram node bounds verified within the illustration. Shared detail navigation now stacks on phones; form inputs/grid children can shrink.
- No console warnings/errors seen in the desktop review.
- Independent source review found two responsive issues; both corrected and reviewed again with no remaining actionable findings.
- Reduced-motion support reviewed in source; OS-level reduced-motion emulation was not performed in this revision.
- Contact delivery behavior is covered by existing tests; no real enquiry was sent.

Screenshots are in `website-previews-v2`. The implementation remains in the local `codex/aletheia-bright-rebrand` branch; it has not been deployed.

## Hiring announcement

The accompanying `hiring/` folder contains a portrait graphic generated with the built-in image tool, a ready-to-copy caption, and the full prompt. It shares the cobalt/ivory/coral strand identity. The announcement lists interns, developers and designers, using the existing public company email. No job location, pay, employment mode or deadline is assumed. Nothing has been posted externally.
