# Aletheia AI company collateral

A coordinated starter kit using the approved logo, warm ivory, cobalt, coral and ink. The brochure gives Featured Work a full page and retains all six service areas, including websites.

## Ready to share

- `aletheia-ai-brochure.pdf` — four-page A4 company brochure: positioning, six services, four selected projects and three products/contact.
- `aletheia-ai-company-profile-and-brand-guide.pdf` — two-page A4 company profile and quick brand reference.
- `aletheia-ai-business-card-print.pdf` — front and back for Ganesh Khetawat, Founder & CEO. Finished size **90 × 50 mm**, **3 mm bleed** on every edge, PDF TrimBox and BleedBox included. Each side is a separate page; no imposition or crop marks.
- `aletheia-ai-letterhead.pdf` — blank A4 stationery for letters.

## Editable working files

- `build_collateral.py` — source for all four PDFs. Requires Python, ReportLab, pypdf, the included approved logo and Barlow Condensed ExtraBold font in `assets/`. Uses macOS Arial fonts for embedded stationery body type. Adjust the two body font paths to compatible local fonts on other systems.
- `letterhead-template.html` — editable letter body and print stylesheet. Open locally, edit the bracketed fields, then print to PDF. Edits in the browser are temporary; update or save the HTML source to keep changes.
- `project-brief-template.md` — discovery brief, requirements, acceptance criteria and constraints.
- `proposal-template.md` — reusable scope, deliverables, investment and timeline template. Contains intentional placeholders; complete them before sending. It is not an executed contract.
- `email-signature.html` — copyable text-based email signature. No remote image dependency; paste the rendered signature into an email client's signature editor. Rendering varies by client.
- `previews/` — rendered PNG proof of every PDF page, including both card faces.

## Identity and factual basis

Company: **Aletheia AI**. Core line: **Intelligence. Put to work.**  
Support: **AI systems, websites and software. Built around your business.**

Colour values: ivory `#F4F1E9`, cobalt `#2448FF`, coral `#FF775E`, ink `#17191C`. Headlines use Barlow Condensed ExtraBold (SIL OFL; licence in `assets/BarlowCondensed-OFL.txt`). Body copy uses Arial in these PDFs.

Uses the approved exact PNG from `docs/brand/concepts/aletheia-ai-logo-v1.png`, without redrawing or changing its proportions. Copy was grounded in `website/src/data/services.ts`, `products.ts`, `team.ts` and `caseStudyDetails.ts`. No phone, registered address, customer quotes, revenue, performance metrics or awards were invented. Project links point to the existing public case-study routes. Their contents reflect the supplied source material, not an independent verification of client claims.

## Production notes

PDFs contain embedded fonts and selectable text. The approved logo is raster; it is sufficiently high resolution at these stationery placements, but this package does **not** contain a vector logo master. Colors are RGB; these are not PDF/X-certified or ICC-profiled CMYK press files. A printer should make the final color conversion/proof to suit the chosen paper and press. The business card is laid out with bleed/trim metadata. Brochure, profile and letterhead are A4 digital/office-print PDFs with no bleed or booklet imposition; edge artwork may be inset or clipped by a non-borderless office printer. Do not send the A4 brochure as a press-ready booklet without printer setup.

## Verification

All nine PDF pages were rendered with Poppler and visually inspected at 1200 px maximum dimension. Layout checks covered text, logo, margins, hierarchy, page numbering and clipping. Automated checks verify page counts, selected text, embedded fonts, link annotations and business-card trim/bleed dimensions. No emails were sent, inquiries submitted or materials published.
