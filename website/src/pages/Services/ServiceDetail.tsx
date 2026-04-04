import { useParams, Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import DetailNavigation from "@/components/shared/DetailNavigation";
import { Container, GlassPanel, SectionHeading } from "@/components/ui";
import { serviceDetails } from "@/data/serviceDetails";

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const serviceIndex = serviceDetails.findIndex((s) => s.slug === slug);
  const service = serviceDetails[serviceIndex];

  /* ── Not found ──────────────────────────────────────────────────────── */
  if (!service) {
    return (
      <PageTransition>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
          <h1 className="text-4xl font-bold text-white">Service Not Found</h1>
          <p className="text-white/50">
            The service you are looking for does not exist.
          </p>
          <Link
            to="/services"
            className="mt-4 text-[var(--color-accent-400)] hover:text-[var(--color-accent-300)]"
          >
            &larr; Back to Services
          </Link>
        </div>
      </PageTransition>
    );
  }

  const prevService =
    serviceIndex > 0 ? serviceDetails[serviceIndex - 1] : undefined;
  const nextService =
    serviceIndex < serviceDetails.length - 1
      ? serviceDetails[serviceIndex + 1]
      : undefined;

  return (
    <PageTransition>
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <PageHero
        overline="Service"
        title={service.headline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />

      {/* ── Description ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          <AnimatedSection>
            <p className="mx-auto max-w-3xl text-center text-lg leading-relaxed text-white/60">
              {service.description}
            </p>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── Features (2x2 grid) ─────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Capabilities" heading="Key Features" />
          </AnimatedSection>
          <div className="grid gap-6 sm:grid-cols-2">
            {service.features.slice(0, 4).map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 0.1}>
                <GlassPanel className="p-6 sm:p-8">
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/50">
                    {feature.description}
                  </p>
                </GlassPanel>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Technologies ────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Tech" heading="Technologies We Use" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {service.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── Process (4-step timeline) ───────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Process" heading="How We Work" />
          </AnimatedSection>

          <div className="relative mx-auto max-w-2xl">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 h-full w-px bg-white/[0.08]" />

            <div className="space-y-10">
              {service.process.map((step, i) => (
                <AnimatedSection key={step.title} delay={i * 0.1}>
                  <div className="relative flex gap-6 pl-0">
                    {/* Numbered circle */}
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-sm font-bold text-white">
                      {i + 1}
                    </div>

                    <div className="pt-1.5">
                      <h3 className="mb-1 text-lg font-semibold text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/50">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <SectionHeading overline="Impact" heading="By the Numbers" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {service.stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-white sm:text-4xl">
                    {stat.prefix ?? ""}
                    {stat.value}
                    {stat.suffix ?? ""}
                  </p>
                  <p className="mt-1 text-sm text-white/40">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <AnimatedSection>
            <DetailNavigation
              prev={
                prevService
                  ? {
                      label: prevService.name,
                      href: `/services/${prevService.slug}`,
                    }
                  : undefined
              }
              next={
                nextService
                  ? {
                      label: nextService.name,
                      href: `/services/${nextService.slug}`,
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
