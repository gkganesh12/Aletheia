import { useParams, Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DetailNavigation from "@/components/shared/DetailNavigation";
import PageSEO from "@/components/shared/PageSEO";
import { caseStudyJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Container, GlassPanel, SectionHeading } from "@/components/ui";
import { caseStudyDetails } from "@/data/caseStudyDetails";

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const studyIndex = caseStudyDetails.findIndex((cs) => cs.slug === slug);
  const study = caseStudyDetails[studyIndex];

  /* ── Not found ──────────────────────────────────────────────────────── */
  if (!study) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-ink">Case Study Not Found</h1>
          <p className="text-muted">
            The case study you are looking for does not exist.
          </p>
          <Link
            to="/case-studies"
            className="mt-4 text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)]"
          >
            &larr; Back to Case Studies
          </Link>
        </div>
      </PageTransition>
    );
  }

  const prevStudy =
    studyIndex > 0 ? caseStudyDetails[studyIndex - 1] : undefined;
  const nextStudy =
    studyIndex < caseStudyDetails.length - 1
      ? caseStudyDetails[studyIndex + 1]
      : undefined;

  return (
    <PageTransition>
      <PageSEO
        title={study.title + " — Case Study"}
        description={study.challenge.slice(0, 160)}
        path={`/case-studies/${study.slug}`}
        jsonLd={[
          caseStudyJsonLd({
            title: study.title,
            description: study.challenge,
            slug: study.slug,
          }),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: study.title, path: `/case-studies/${study.slug}` },
          ]),
        ]}
      />
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <PageHero
        overline={study.industry}
        title={study.title}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
          { label: study.title },
        ]}
      />

      {/* ── Metadata row ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          <AnimatedSection>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-ink/[0.06] pb-8">
              {/* Client */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Client
                </span>
                <span className="mt-1 text-sm text-muted">{study.client}</span>
              </div>

              <div className="hidden h-8 w-px bg-primary-900 sm:block" />

              {/* Industry */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Industry
                </span>
                <span className="mt-1 text-sm text-muted">
                  {study.industry}
                </span>
              </div>

              <div className="hidden h-8 w-px bg-primary-900 sm:block" />

              {/* Service */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Service
                </span>
                <span className="mt-1 text-sm text-muted">{study.service}</span>
              </div>

              <div className="hidden h-8 w-px bg-primary-900 sm:block" />

              {/* Tech Stack */}
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Tech Stack
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {study.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-primary-900 px-3 py-1.5 text-xs text-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* ── The Challenge ──────────────────────────────────────────────── */}
          <AnimatedSection delay={0.1} className="mt-16">
            <SectionHeading
              overline="Background"
              heading="The Challenge"
              align="left"
            />
            <p className="max-w-3xl text-base leading-relaxed text-muted">
              {study.challenge}
            </p>
          </AnimatedSection>

          {/* ── Our Approach (numbered phases) ────────────────────────────── */}
          <AnimatedSection delay={0.15} className="mt-16">
            <SectionHeading
              overline="Methodology"
              heading="Our Approach"
              align="left"
            />
          </AnimatedSection>

          <div className="space-y-8">
            {study.approach.map((step, i) => (
              <AnimatedSection key={step.phase} delay={0.1 + i * 0.08}>
                <div className="flex gap-5">
                  {/* Phase number */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/[0.12] bg-primary-900 text-sm font-bold text-ink">
                    {i + 1}
                  </div>

                  <div className="pt-0.5">
                    <h3 className="mb-1 text-lg font-semibold text-ink">
                      {step.phase}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* ── The Solution ───────────────────────────────────────────────── */}
          <AnimatedSection delay={0.15} className="mt-16">
            <SectionHeading
              overline="Execution"
              heading="The Solution"
              align="left"
            />
            <p className="max-w-3xl text-base leading-relaxed text-muted">
              {study.solution}
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── Results (4-column metric callout cards) ─────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Outcomes" heading="Results" />
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {study.results.map((result, i) => (
              <AnimatedSection key={result.label} delay={i * 0.1}>
                <GlassPanel className="p-6 text-center sm:p-8">
                  <p className="text-3xl font-bold text-ink sm:text-4xl">
                    {result.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted">
                    {result.label}
                  </p>
                </GlassPanel>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonial (optional) ──────────────────────────────────────── */}
      {study.testimonial && (
        <section className="pb-16 sm:pb-24">
          <Container size="narrow">
            <AnimatedSection>
              <blockquote className="border-l-2 border-[var(--color-accent-400)] pl-6">
                <p className="text-lg italic leading-relaxed text-muted">
                  &ldquo;{study.testimonial.quote}&rdquo;
                </p>
                <footer className="mt-4">
                  <p className="text-sm font-semibold text-ink">
                    {study.testimonial.author}
                  </p>
                  <p className="text-xs text-muted">{study.testimonial.role}</p>
                </footer>
              </blockquote>
            </AnimatedSection>
          </Container>
        </section>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <DetailNavigation
              prev={
                prevStudy
                  ? {
                      label: prevStudy.title,
                      href: `/case-studies/${prevStudy.slug}`,
                    }
                  : undefined
              }
              next={
                nextStudy
                  ? {
                      label: nextStudy.title,
                      href: `/case-studies/${nextStudy.slug}`,
                    }
                  : undefined
              }
            />
          </AnimatedSection>
        </Container>
      </section>

      <CTASection />
    </PageTransition>
  );
}
