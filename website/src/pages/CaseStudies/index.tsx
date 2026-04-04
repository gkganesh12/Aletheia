import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Card } from "@/components/ui";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import FilterButtons from "@/components/shared/FilterButtons";
import { caseStudyDetails } from "@/data/caseStudyDetails";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Derive unique industries from data                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const industries = Array.from(
  new Set(caseStudyDetails.map((cs) => cs.industry)),
);

/* ────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export default function CaseStudiesPage() {
  const [active, setActive] = useState("All");

  const filteredStudies =
    active === "All"
      ? caseStudyDetails
      : caseStudyDetails.filter((cs) => cs.industry === active);

  return (
    <PageTransition>
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <PageHero
        overline="Case Studies"
        title="Proven in the Field"
        description="Real engagements. Measurable outcomes. See how our AI-native security solutions perform under pressure."
      />

      {/* ─── Studies Grid ───────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <Container>
          {/* Filter bar */}
          <AnimatedSection>
            <FilterButtons
              categories={industries}
              active={active}
              onChange={setActive}
              className="mb-12"
            />
          </AnimatedSection>

          {/* Grid: 1 col mobile, 2 cols desktop */}
          <div className="grid gap-8 md:grid-cols-2">
            {filteredStudies.map((study, index) => (
              <AnimatedSection key={study.slug} delay={index * 0.08}>
                <Card hover className="group flex h-full flex-col overflow-hidden p-0">
                  <motion.div
                    className="flex h-full flex-col"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {/* Hero image */}
                    {study.heroImage && (
                      <div className="overflow-hidden">
                        <img
                          src={study.heroImage}
                          alt={study.title}
                          className="h-48 w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-8">
                    {/* Industry badge */}
                    <span className="mb-4 inline-block w-fit rounded bg-[var(--color-accent-400)]/10 px-2 py-1 text-xs font-semibold uppercase text-[var(--color-accent-400)]">
                      {study.industry}
                    </span>

                    {/* Title */}
                    <h3 className="mb-1 text-xl font-bold text-white transition-colors duration-200 group-hover:text-[var(--color-accent-400)]">
                      {study.title}
                    </h3>

                    {/* Client */}
                    <p className="mb-3 text-sm font-medium text-white/40">
                      {study.client}
                    </p>

                    {/* Challenge (brief, 2-line truncation) */}
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/50">
                      {study.challenge}
                    </p>

                    {/* Result metrics as stat pills */}
                    <div className="mt-auto flex flex-wrap gap-3 border-t border-white/[0.06] pt-5">
                      {study.results.slice(0, 3).map((result) => (
                        <div
                          key={result.label}
                          className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-center"
                        >
                          <span className="block text-base font-bold text-[var(--color-accent-400)]">
                            {result.value}
                          </span>
                          <span className="block text-[11px] uppercase tracking-wider text-white/40">
                            {result.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Read Case Study link */}
                    <Link
                      to={`/case-studies/${study.slug}`}
                      className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent-400)] opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                    >
                      Read Case Study
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        &rarr;
                      </span>
                    </Link>
                    </div>
                  </motion.div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

          {/* Empty state */}
          {filteredStudies.length === 0 && (
            <AnimatedSection>
              <p className="py-20 text-center text-white/40">
                No case studies found for this industry.
              </p>
            </AnimatedSection>
          )}
        </Container>
      </section>

      {/* ─── CTA ────────────────────────────────────────────────────────── */}
      <CTASection />
    </PageTransition>
  );
}
