# IGNITE recording — application to Aletheia AI

Reviewed: 25 September 2026.

Source: user-supplied `Screen Recording 2026-09-25 at 1.09.39 PM.mov` on the Desktop (the source filename contains a narrow space before PM). Duration 70.695 seconds, 1916 × 956 pixels. The recording shows the IGNITE homepage. Analysis uses sampled frames across the recording, with closer one-to-two-second sampling of the opening, capabilities and proof sequences. Timestamps below are approximate.

## Observations and adaptations

| Recording segment | Observed treatment | Aletheia AI adaptation |
| --- | --- | --- |
| 00:00–00:04 | Very large condensed headline dominates a light opening; an emphasized category changes while the layout remains stable. | Use a large, carefully line-broken headline on warm ivory. Keep the main message stable and understandable. List AI, websites, software, security, data and Web3 explicitly in supporting content. |
| 00:04–00:14 | A dark narrative chapter changes text emphasis as the page scrolls; a red geometric object changes orientation behind it. | A short cobalt chapter can reveal a concise statement about turning business needs into useful technology. An A-derived shape may move subtly behind the text, with sufficient contrast. Keep this to one brief sequence. |
| 00:14–00:26 | Oversized repeating section type introduces work; project rows invert on hover and a preview image tracks the pointer. | Use a selected-work index with a shared preview panel and an accessible project link per row. On touch, show each preview inline. On keyboard focus, show the same preview without requiring pointer movement. |
| 00:27–00:35 | Short benefit scenes occupy a generous light canvas. Headings transition through the same area. Decorative objects and an editable-text interaction add playfulness. | Give capabilities clear, substantial type and useful demonstrations. Keep all six services readable and linked. Use a concise animation showing one workflow rather than unrelated floating decorations. |
| 00:36–00:44 | A dark team section pairs a stable introductory area with portrait content moving through the viewport. | Present actual Aletheia people and the working relationship in a warm light composition, with optional sticky introduction on wide screens. Do not invent a larger team to fill the composition. |
| 00:44–00:48 | A saturated blue section changes the pace; text and a tilted image share the panel. | Use a cobalt product spotlight, with a real product image and a restrained image tilt. Coral can mark a secondary panel or closing CTA. |
| 00:48–00:53 | Small testimonial panels move over an enormous background heading. | If an approved testimonial is available, present it at a readable size with attribution. A large background word may provide scale, but it must not obscure the quote. |
| 00:53–01:10 | An editorial blog index leads into contact and a large repeating footer label. | Use compact article links, a clear inquiry path and a large Aletheia AI footer wordmark. Preserve contact usability throughout the motion. |

## Refinement of the generated brand-board concept

Retain warm ivory, cobalt, coral and ink. Increase the headline's share of the composition and use a more condensed display treatment for major section labels. Reduce the oversized decorative A in the generated hero so it does not compete with the promise and project evidence. Extend the visual language through full-width chapters instead of repeating bordered cards. Keep the actual company logo proportionate in navigation.

Suggested background rhythm: **ivory opening → light selected work → cobalt statement → light services/process → coral or cobalt product moment → ivory people/proof → vibrant contact**. A small ink section is optional; the overall experience must remain predominantly light and colorful, as requested.

## Motion requirements for the build

- GSAP/ScrollTrigger handles scroll-linked text, selected-work movement and scene transitions; CSS handles ordinary hover/focus states.
- Use at most two brief sticky or pinned sequences on the homepage. Do not reproduce the recording's elapsed seconds as animation durations: the speed is controlled by the person scrolling.
- Keep body copy readable; animate heading emphasis or decorative layers rather than requiring visitors to chase paragraphs.
- Parallax stays modest and does not move clickable targets away from the pointer.
- Project preview interactions have equivalent focus and touch behavior.
- Reduced-motion mode renders all content in normal document flow, without pinning or scrubbing.
- Do not infer the reference's exact animation library, easing curves or implementation from video alone. These are design observations, not a source-code audit.

## Scope retained

The exact company name remains **Aletheia AI**. Keep AI Product Engineering, MVP & Rapid Prototyping, Full-Stack Development including websites, Cybersecurity & Auditing, Blockchain & Web3, and Data Engineering & ML. The reference informs presentation; it does not change the business or supply reusable logos, project images, claims or testimonials.

The user subsequently approved the generated Aletheia logo and explicitly prioritized the scrolling website and Featured Projects interaction. No production website changes were made during this review. The implementation plan now places Featured Projects immediately below the opening and verifies its interaction before adding decorative scroll scenes.
