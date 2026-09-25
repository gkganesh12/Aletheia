# Aletheia AI — photographic homepage revision

The user rejected the abstract engineering illustration direction and requested a more natural landing page using stock photography and substantial scroll-driven motion.

## Design

- Sunlit workspace hero with oversized sans-serif type and a restrained italic serif accent. Warm ivory, terracotta and sage keep the page light.
- Hero frame expands from inset to full width as the visitor scrolls. The photograph and headline move at different speeds.
- HeuriSight and RD Fitness receive large, staggered photographic features; CodeCraft and Inscrape retain accessible hover/focus previews and real case-study links.
- The three-stage process uses a sticky photographic sequence, parallax and a progress line. Phones show the photographs inline with their text.
- All six service areas, products, verified repository commits, actual founder portrait and contact routes remain available. Repository history sits after the products.
- Photography is clearly identified as stock. It does not claim to show Aletheia employees, premises, client facilities or shipped product interfaces. See `website/public/images/editorial/SOURCES.md` for attribution.

## Implementation and checks

- Local responsive WebP images, smaller phone variants, explicit image dimensions, lazy loading below the fold and high-priority hero loading.
- GSAP context and media-query cleanup on route changes. Scroll animations require a suitable viewport and no reduced-motion preference. Reduced motion and short screens use an inline process layout; no text depends on animation to become readable.
- Browser checks: desktop 1440×1000, tablet 768×1024, phones 390×844 and 320×740. No horizontal overflow observed at these sizes. Phone hero correctly selects the smaller image.
- Verified chapter changes and progress while scrolling; checked image coverage and keyboard preview transitions. Fixed an overscan/max-width conflict and stale preview when reverse-tabbing to a featured card.
- Build and lint pass. All 9 existing tests pass (project preview positioning and contact submission behavior). Reduced-motion handling reviewed in source; OS preference was not changed during browser QA.
- Screenshots in `docs/brand/photographic-previews/`. This is a local preview revision, not a production deployment.
