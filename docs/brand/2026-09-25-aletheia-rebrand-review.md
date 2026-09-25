# Aletheia — website review and proposed rebrand

Date: 25 September 2026  
Status: Brighter editorial direction and generated logo approved by the user, with the full Aletheia AI company/service scope retained. The user explicitly prioritizes a scrolling website and the IGNITE-style Featured Projects interaction. Website implementation has not started. See the motion addendum in `reference-review/ignite-recording-notes.md` and the implementation plan at `../superpowers/plans/2026-09-25-aletheia-scroll-rebrand.md`.

## The brief

Rebuild Aletheia's brand presence into a distinctive, premium engineering studio website: larger typography, a richer color system, a coherent visitor journey, and purposeful scroll choreography. The requested references are Founderz, IGNITE, and GSAP work on Awwwards.

Confirmed scope: retain the exact company name **Aletheia AI** and its full service offering: AI Product Engineering, MVP & Rapid Prototyping, Full-Stack Development including website building, Cybersecurity & Auditing, Blockchain & Web3, and Data Engineering & ML. The user explicitly wants the existing company scope preserved. Address organizations seeking these services; do not narrow the company to a design studio or to startup customers. Prioritize qualified project inquiries.

Success means a visitor can quickly understand what Aletheia builds, see credible examples, understand how an engagement works, and start a conversation. The site should also have a recognizable identity when viewed as a still image.

## What was reviewed

- Live Aletheia homepage: desktop appearance, section sequence, navigation, hero CTA behavior, and service presentation. About page content was also inspected.
- Local React source: routes, homepage composition, global styling, hero, products, navigation, contact handling, preloader, smooth scrolling, SEO data, and the existing concept page.
- Founderz and IGNITE: live opening views and selected scroll states.
- Awwwards GSAP gallery, the studiors and Pensatori Irrazionali listings, and both studios' live websites.

Limits: this is a design and source audit, not a complete accessibility or performance test. The local preview could not start because Vite dependencies are not installed; live-site inspection was used instead. A requested mobile viewport override did not take effect: the observed page stayed at 1280 × 720. Mobile recommendations below are based on source and require real responsive verification during the build. No inquiry forms were submitted. Reference videos did not all play in the review browser, so recommendations do not depend on unseen footage.

## What feels odd, and how to fix it

| Priority | Finding and evidence | Proposed change |
| --- | --- | --- |
| High | The hero combines a violet/cyan gradient headline, abstract network sphere, dot grid and dark backdrop. These communicate a broad AI category more strongly than Aletheia's particular work. See `website/src/components/sections/Hero/index.tsx`. | Lead with a distinctive wordmark, a plain-language promise and an actual project composition. Make imagery explain something Aletheia built. |
| High | The homepage runs Hero → Services → Products → Stats → Testimonials → FAQ → CTA. It omits the existing case-study section. See `website/src/pages/Home.tsx:22`. | Put selected work immediately after the opening promise. Visitors should see evidence before reading a service catalogue. |
| High | The hero's “Work With Us” button did nothing during live inspection. It looks up `#contact`, which is absent from the homepage DOM. Source: `website/src/components/sections/Hero/index.tsx:134`. | Use a real link to `/contact` for project inquiries. Preserve a separate link to selected work. |
| High | Product “Learn More” buttons have no destination or click handler in the source. Source: `website/src/components/sections/Products/index.tsx:102`. | Link each product directly to its existing detail route and use a descriptive label. |
| High | Services and products repeat rounded, bordered dark cards with muted text. The sections have similar scale and emphasis. | Alternate full-width project visuals, large numbered service rows, a compact process section and a human studio story. Use changes in background color to mark chapters. |
| Medium | Six equal-weight services span AI, MVPs, full-stack, cybersecurity, blockchain and data. The opening message does not establish which buying need is primary. | Group homepage capabilities into AI systems, digital products, and secure infrastructure. Keep specialist detail on service pages. Validate emphasis against the intended customer. |
| Medium | Much of the copy repeats “build,” “ship,” “real,” and contrasts with pitches or slide decks. | Use specific outcomes, deliverables and project context. Make confidence come from evidence and concise writing. |
| Medium | A shield/calligraphic mark signals a different personality from the rounded sans-serif typography and broad product-studio offer. | Develop a consistent wordmark and a simple A-based mark that work in one color, at favicon size and in a large footer. Evaluate existing recognition before replacing the mark. |
| Medium | The preloader imposes a 2.4-second timer followed by an 0.8-second exit, independently of actual load readiness. Hero animations start underneath it. Source: `website/src/components/shared/Preloader.tsx`. | Remove the mandatory wait. Use a brief opening reveal that leaves the message and CTA available immediately. |
| Medium | GSAP and Lenis are installed, but the main scroll narratives live in `/concept`. The homepage mostly uses Framer Motion entrance effects. | Build one coherent homepage sequence with GSAP/ScrollTrigger. Reuse the existing stack; a framework migration is unnecessary. |
| Medium | `SmoothScroll` starts Lenis unconditionally; the reduced-motion hook is not used there or in the main hero. `ScrollToTop` calls `window.scrollTo` during render. | Add a site-wide motion preference policy and route-aware scrolling in an effect. Test back navigation and anchors alongside animation cleanup. |
| Medium | `/concept` describes Inscrape, Nirvana and SwarmScope differently from their main product data. It also introduces additional performance claims. | Reconcile product descriptions with one reviewed source. Do not promote this concept page as the new homepage without correcting its content. |
| Medium | Organization structured data links different social accounts from the visible footer. | Centralize brand name, domain, logo, contact details and social links; reuse them across metadata and UI. |

The live contact page has a Web3Forms integration in its source. An older, separate contact section simulates submission and uses different contact/service details. The current homepage does not mount that section. Preserve the real integration and prevent the older mock form from being reintroduced during redesign.

Metrics and testimonials are present in local data, but their substantiation and publication approval were not established by this review. Confirm these before featuring them prominently. Product capacity figures should be attached to their product and test context instead of presented as general agency outcomes.

## What to take from the references

| Reference | Observed strength | Application to Aletheia |
| --- | --- | --- |
| [Founderz](https://founderz.com/) | A saturated orange/purple opening, prominent credibility signals, a transition to light content, and large feature panels with product imagery. | Establish a memorable color moment, then give visitors calmer reading areas. Show product evidence beside each claim. |
| [IGNITE](https://igniteagency.com/) | Oversized condensed black typography on white; vivid accents; a dark scroll-revealed narrative; featured work and a direct inquiry path. | Use typography as the main composition, change pace between chapters, and make selected projects prominent. |
| [studiors — Awwwards listing](https://www.awwwards.com/sites/studiors), [live site](https://studiors.be/) | Listed with GSAP; a large sans/italic type contrast, restrained palette, visible project links and a structured method narrative. | Borrow the hierarchy and disciplined type contrast. Keep project access straightforward. |
| [Pensatori Irrazionali — Awwwards listing](https://www.awwwards.com/sites/pensatori-irrazionali), [live site](https://pensatori-irrazionali.com/) | Listed with GSAP and Three.js; distinctive branded imagery, expressive typography and strong transitions into work. | Create a recognizable Aletheia visual motif that extends into project presentation. Its graphics and client logos are reference material, not reusable assets. |

The [Awwwards GSAP gallery](https://www.awwwards.com/websites/gsap/) was used for discovery. The references demonstrate visual principles; this review does not claim that every observed effect uses a particular animation library.

## Three possible directions

### A. Editorial engineering — recommended

Warm ivory, ink, cobalt and controlled coral accents. Oversized type, asymmetrical layouts, full-width project canvases, thin rules and restrained technical annotations. The personality is inventive, precise and approachable. This best connects Aletheia's technical business with the expressive agency presentation requested.

Tradeoff: the quality depends on strong project imagery and disciplined copy. Color alone will not carry it.

### B. Expressive creative technology

White and ink with acid yellow and hot coral; condensed display type; assertive changes in scale; playful project interactions. Closest to IGNITE's energy.

Tradeoff: it can imply a branding/advertising agency unless the opening message and work make the engineering offer explicit.

### C. Cinematic technical atelier

Warm black, silver and a vivid orange accent; highly art-directed product films; large quiet typography and slower reveals.

Tradeoff: it relies on excellent media and remains closer to the current dark visual territory. It is the weakest fit for the requested increase in color.

## Recommended identity system

**Positioning:** Aletheia AI helps businesses apply AI, build websites and software, and develop the data, security and infrastructure those systems need. Preserve all six existing services in the website's navigation and content architecture.

**Brand idea:** make complexity clear. A simple opening or aperture in the A mark becomes a framing device for project images and a reveal motion. The motif connects the brand story to the experience without requiring a separate animated ornament everywhere.

**Working hero copy:**

> Aletheia AI — AI & technology solutions  
> From bold idea  
> to working product.  
> We design and build AI systems, digital platforms and the infrastructure behind them.  
> Explore our work ↘ · Start a project ↗

This is proposed copy. The generated brand board also explores “Intelligence. Put to work.” Final supporting copy must state the breadth of the company clearly.

| Token | Proposed value | Role |
| --- | --- | --- |
| Paper | `#F4F1E9` | Main canvas and spacious editorial sections |
| Ink | `#17191C` | Body copy, wordmark and selected dark chapters |
| Cobalt | `#2448FF` | Primary actions and one signature full-color section |
| Coral | `#FF775E` | Secondary accents and project annotations; pair with ink |
| White | `#FFFFFF` | Text on cobalt and small high-contrast surfaces |

Start with approximately 55% paper, 25% ink, 15% cobalt and 5% coral across the experience. Project media adds further color. Check actual text/background combinations before implementation is accepted.

Typography: select a distinctive grotesk display face using a specimen of the actual Aletheia headline and wordmark. Use approximately 112–180px display text on wide screens, 48–72px on phones, 18–20px body copy and readable navigation. Keep a maximum of two families and reserve small monospaced text for useful project metadata. Confirm font licensing before adding assets.

Imagery: use product screens, architecture explainers tied to a real project, short demonstrations and founder/team photography. Use a clearly labeled illustrative diagram when an approved screen is unavailable. Avoid substituting invented dashboards or fictional results for evidence.

Brand deliverables: wordmark, compact mark, light/dark lockups, favicon, social avatar, social/OG composition, color and type tokens, icon rules, button/link styles, project cover system, voice examples and motion rules.

## Homepage order and scroll storyboard

| Chapter | Visitor's question | Content and composition | Motion |
| --- | --- | --- | --- |
| 1. Opening promise | What do you build? | Large headline, concise description, two clear links and a crop of genuine project work. | Brief line reveal. A project window expands slightly as it enters the next section. |
| 2. Featured Projects — priority feature | Can you show me? | Four full-width project rows: HeuriSight, RD Fitness, CodeCraft CLI and Inscrape. State project name, category and a short description; link to each existing case study. This section appears immediately after the opening. | IGNITE-inspired row inversion and a floating image preview following the pointer. Keyboard focus gets a stable preview; phones get inline images. Large section typography and a short scroll-linked heading transition connect it to the hero. |
| 3. Capabilities | Can you solve my problem? | Three numbered rows: AI systems; digital products; secure infrastructure. Link to the relevant service details. | Reveal supporting media on focus/hover; all descriptions remain available to touch and keyboard users. |
| 4. How we work | What does working together involve? | Understand → Shape → Build → Launch. Each step names a concrete deliverable. | A short progress sequence, with optional desktop sticky label. No forced pause for reading. |
| 5. Built at Aletheia | Do you build your own technology? | Compact showcases for Inscrape, Nirvana and SwarmScope, with demonstrations and real detail links. | Lightweight image/text transitions; avoid another repeated card grid. |
| 6. People and proof | Who will I work with? | Founder/team imagery, clear working relationship, and one approved testimonial if available. | Quiet image reveal and otherwise stable reading. |
| 7. Start a project | What happens next? | Large invitation, a working contact route, direct email and useful next-step expectations. A small FAQ only if it resolves buying objections. | Cobalt closing chapter and a large wordmark; CTA remains continuously usable. |

The scroll should feel like one story with pauses for reading. Limit the homepage to a few memorable sequences. Avoid multiple consecutive pinned sections, mandatory horizontal scrolling, perpetual blur effects and long empty travel between content.

## Site-wide structure

Primary navigation: **Work · Services · Products · Company · Start a project**. Keep all six services directly discoverable under Services; the homepage's three editorial groupings are presentation aids, not a reduction of the offer.

| Existing area | Rebrand treatment |
| --- | --- |
| Home | New narrative and art direction described above. |
| `/case-studies` and details | Label as Work in navigation; retain URLs. Large covers, project facts, problem, approach, result and next project. |
| `/services` and details | Keep the Services label and all six existing service categories. Explicitly include website building under Full-Stack Development. Use deliverables and relevant cases. |
| `/products` and details | Product-specific demonstration, benefits, technical details and an explicit next action. |
| `/about` | Label as Company. Put real people and the working relationship before a long brand manifesto. |
| `/contact` | Clear inquiry form with consistent labels, visible email, real submission states and existing integration. |
| Blog and posts | Apply the same type and color system; maintain article readability, existing content and SEO routes. Link from secondary navigation/footer. |
| Industries and Careers | Apply shared templates and check copy. Keep reachable without crowding primary navigation. |
| `/concept` | Resolve stale product descriptions and decide whether it remains a clearly separate experiment. It is not the source of truth for the rebrand. |

Shared branding must include the navigation, footer, form controls, project covers, page metadata, favicon and OG preview. The redesign is not complete if only the homepage changes.

## Technical direction and rollout

Keep React, TypeScript, Vite, Router, GSAP and Lenis. Give GSAP ownership of scroll-linked transformations and use CSS for simple hover/focus behavior. Existing Framer Motion interactions can remain where they do not compete over the same properties.

1. **Confirm direction:** audience, retained name, selected visual route and desired lead action. Turn the selected proposal into the approved design specification.
2. **Prepare content and identity:** inventory usable product screens and photography; reconcile claims and product copy; develop the logo/type/palette system and two representative page compositions.
3. **Build the shared system and homepage:** tokens, navigation, footer, sections, working links and a responsive static composition; then add the scroll choreography.
4. **Extend to the full site:** work and service detail templates, products, studio, contact, editorial and secondary pages. Preserve established URLs and SEO data.
5. **Verify and prepare release:** desktop/mobile browser review, reduced-motion and keyboard checks, form integration validation, metadata and route checks, build/lint and performance measurement. Review the resulting preview before publication.

Implementation details should address `gsap.context` cleanup, responsive `matchMedia` handling, font/image readiness before measuring scroll positions, and route changes without leaked pin spacers. Retain native scrolling for touch and reduced-motion users, and make all essential content readable without waiting for a reveal. Lazy-load heavy media and avoid making WebGL a prerequisite for understanding the business.

## Acceptance checks for the eventual build

- The message, project evidence and next action are understandable in the first two screens.
- Every homepage product and inquiry CTA goes to a valid destination.
- The wordmark, colors, typography and content voice are consistent across all existing routes.
- Keyboard navigation, visible focus, menu escape behavior and meaningful link labels work.
- Reduced motion removes scrubbing, pinning and unnecessary movement without hiding content.
- Verify at 390px, 768px and 1440px, including landscape and resizing around pinned scenes.
- Existing case-study, product and blog deep links remain valid; new fallback handling is intentional.
- Contact success and failure states reflect the real service response. Do not send a live test inquiry without explicit authorization.
- Target LCP ≤2.5s, CLS ≤0.1 and INP ≤200ms; measure actual results rather than assuming the animation stack guarantees them.
- Build and lint pass, with any pre-existing failures distinguished from redesign regressions.

## Current direction

The user approved the brighter editorial direction and the generated logo, and clarified that **Aletheia AI remains the same full-service AI and technology company**. Prepare the approved logo for production without changing its design. Featured Projects is a central acceptance requirement, not an optional embellishment. Incorporate the supplied recording's type hierarchy, project interactions and section rhythm while using Aletheia's own identity and content.
