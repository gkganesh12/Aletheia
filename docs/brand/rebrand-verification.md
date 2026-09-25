# Aletheia AI rebrand — verification and handoff

Date: 25 September 2026. Branch: `codex/aletheia-bright-rebrand`.
Preview: http://127.0.0.1:4173/
Implementation checkout: `/Users/ganeshkhetawat/.codex/worktrees/aletheia-bright-rebrand/AI_Agency`.

## Delivered

- Approved logo; warm ivory, ink, cobalt and coral identity; licensed self-hosted Barlow Condensed display font; updated favicon and 1200 × 630 social image.
- Homepage: Hero → Featured Projects → cobalt statement → all six services → process → products → founder → contact.
- Four full-width project rows with GSAP pointer-follow preview, stable keyboard preview, mobile inline artwork, image-error fallback and actual case-study links. All artwork is explicitly illustrative.
- Conditional Lenis and scoped GSAP scroll motion. Homepage content is visible before effects run. Removed mandatory preloader, generic custom cursor and old 3D hero. Route changes dispose old Lenis inertia.
- Light shared page surfaces across existing routes, readable inner content and preserved detail URLs. Old `/concept` redirects to the approved homepage.
- Product index now describes the actual scraping, alert-management and simulation products; previous security-only framing removed. Real contact transport preserved and rejects HTTP/API errors; reset occurs only after confirmed success.
- Four-page brochure, two-sided business card, company profile/brand guide, blank letterhead, editable letterhead, discovery brief, proposal template and email signature. Standalone ZIP includes logo and licensed display font assets.

## Automated verification

- Baseline production build passed; baseline lint failed with 24 existing errors.
- Final `npm run build --workspace=website`: passed.
- Final `npm run lint --workspace=website`: passed.
- Final `npm test --workspace=website`: 9 passed, 0 failed. Five preview geometry cases and four transport success/rejection/network cases. Tests first failed before the new utility implementations existed.
- Removed obsolete, unreferenced preloader, cursor, 3D scenes and simulated contact component. Fixed media-query subscription and SEO exports; this resolves the baseline lint failures without disabling whole rules.
- Independent code review found four issues: stale route inertia, keyboard preview hidden by scrolling, short-window preview clipping, and landscape menu clipping. All fixed and reviewer rechecked with no remaining substantive findings.

## Browser evidence

Used the actual local application through the supported browser tools.

- Exact viewport dimensions confirmed: 390 × 844, 768 × 1024, 1440 × 900, plus 844 × 390 landscape and 900 × 320 short desktop.
- Home has no horizontal overflow at the checked sizes; mobile uses inline project covers and a compact navigation menu.
- Landscape navigation has a 309px internally scrollable panel; final Start a project link reaches Contact.
- All four project links were reached by Tab; associated artwork changes with focus. Enter opens the correct project.
- Pointer movement across project rows switches artwork. Near bottom-right at 1440 × 900, preview ends at x=1424 and y=884, preserving 16px margins. Its `pointer-events` is `none`.
- Short desktop keyboard preview remained within the 900 × 320 viewport.
- Temporarily removed HeuriSight artwork to force a real image failure: branded HeuriSight fallback retained the preview dimensions and active case-study link. Asset restored afterwards.
- Case-study navigation resets to top and removes the preview. Back navigation and header links remain usable.
- All 47 sitemap routes loaded a meaningful heading, had exactly one canonical and no desktop horizontal overflow. `/concept` intentionally redirects home. Four unknown detail slugs render the appropriate not-found state.
- Case-study EdTech filter leaves one case-study link. FAQ expands. Empty contact submission shows validation errors and focuses the name input without sending an inquiry.
- Saved screenshots and machine-readable route inventory: `website-previews/`.

## Limits and publication

- Contact API success/rejection/network cases were tested with injected network stubs at the transport boundary. Browser validation was checked, but no real message was sent and end-to-end delivery is not claimed.
- Reduced-motion behavior is implemented with media queries and Framer Motion's user setting, and was code-reviewed. Runtime OS preference switching was not exercised by the available browser API.
- No lab or field LCP/CLS/INP numbers were measured; performance targets are not represented as achieved.
- Existing project results/testimonials in the source data are retained; this redesign is not an independent verification of those claims. New homepage and collateral avoid introducing metrics or testimonials.
- Card layout includes 3mm bleed at 90 × 50mm trim. Files are RGB, not CMYK/PDF-X press proofs; the printer should proof/convert for its press. A4 brochure/profile/letterhead are digital/office-print PDFs.
- Website is local and kept on its review branch. No deployment, merge or external publication performed.
