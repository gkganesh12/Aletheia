import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  SectionHeading,
  GlassPanel,
  GradientText,
} from "@/components/ui";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import PageSEO, { breadcrumbJsonLd } from "@/components/shared/PageSEO";
import { serviceDetails } from "@/data/serviceDetails";

/* ── Service icons ─────────────────────────────────────────────────── */

const serviceIcons: Record<string, React.ReactNode> = {
  "ai-products": (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M16 14v2a4 4 0 0 1-8 0v-2" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  ),
  "mvp-development": (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
    </svg>
  ),
  "full-stack": (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  "cybersecurity": (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  "blockchain": (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  "data-ml": (
    <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
};

/* ── Process phases ────────────────────────────────────────────────── */

const processPhases = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We understand your problem, your users and your constraints. No assumptions — just the facts that shape the right solution.",
  },
  {
    number: "02",
    title: "Architecture",
    description:
      "Tech stack, database design, API structure, deployment strategy. We make the big decisions early so development moves fast.",
  },
  {
    number: "03",
    title: "Build",
    description:
      "Focused development sprints with regular deliverables. You see progress every few days, not after months of silence.",
  },
  {
    number: "04",
    title: "Ship & Iterate",
    description:
      "Deployed to production, monitored and ready for users. Then we iterate based on real feedback and real data.",
  },
];

/* ── Differentiators ───────────────────────────────────────────────── */

const differentiators = [
  {
    title: "Production-First",
    description:
      "Every system we build is designed for production from day one. No throwaway prototypes, no demo-ware.",
  },
  {
    title: "Polyglot Engineering",
    description:
      "Python, TypeScript, React, Rust, Go, Solidity — we pick the right tool for the job, not the one we're most comfortable with.",
  },
  {
    title: "Full Ownership",
    description:
      "We own the outcome end-to-end. Architecture, implementation, deployment, monitoring — no gaps, no handoff problems.",
  },
];

/* ── Component ─────────────────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <PageTransition>
      <PageSEO
        title="AI Services"
        description="AI product engineering, MVP development, full-stack platforms, cybersecurity, blockchain and data/ML services. Production-grade solutions from Aletheia AI."
        path="/services"
        keywords="AI services, AI product engineering, MVP development, AI consulting services, machine learning services"
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Services", path: "/services" }])}
      />
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <PageHero
        overline="What We Do"
        title="Engineering That Ships"
        description="AI products, MVPs, full-stack platforms, cloud infrastructure, cybersecurity — strong engineering applied to every problem, from idea to production."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      {/* ─── Stats Bar ────────────────────────────────────────────────── */}
      <section className="border-b border-white/[0.04] py-12">
        <Container>
          <AnimatedSection>
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 text-center sm:gap-8 md:grid-cols-4">
              {[
                { value: "6", label: "Core Service Lines" },
                { value: "3", label: "Products Shipped" },
                { value: "10+", label: "Projects Delivered" },
                { value: "2", label: "Published Packages" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-white lg:text-4xl">
                    <GradientText>{stat.value}</GradientText>
                  </div>
                  <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-white/35">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ─── Services Grid ────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Capabilities"
              heading="What We Deliver"
              description="Six core service lines — each backed by proprietary AI and battle-tested in production."
              align="center"
            />
          </AnimatedSection>

          <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {serviceDetails.map((service, i) => (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link
                  to={`/services/${service.slug}`}
                  className="group block h-full"
                >
                  <motion.div
                    className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 transition-colors duration-300 group-hover:border-[var(--color-accent-400)]/30 group-hover:bg-white/[0.04]"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--color-accent-400)]/[0.06] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Number + icon row */}
                    <div className="relative flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-400)]/10 text-[var(--color-accent-400)] transition-colors duration-300 group-hover:bg-[var(--color-accent-400)]/15">
                        {serviceIcons[service.slug] || serviceIcons["cybersecurity"]}
                      </div>
                      <span className="text-4xl font-black text-white/[0.04] transition-colors duration-500 group-hover:text-[var(--color-accent-400)]/[0.08]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="relative mt-5 text-lg font-bold text-white">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="relative mt-2.5 flex-1 text-sm leading-relaxed text-white/45">
                      {service.description.slice(0, 140)}...
                    </p>

                    {/* Tech badges */}
                    <div className="relative mt-5 flex flex-wrap gap-1.5">
                      {service.technologies.slice(0, 4).map((tech: string) => (
                        <span
                          key={tech}
                          className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/40 transition-colors duration-200 group-hover:border-[var(--color-accent-400)]/15 group-hover:text-white/55"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.technologies.length > 4 && (
                        <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/30">
                          +{service.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Key stat + CTA row */}
                    <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-5">
                      <div>
                        <div className="text-sm font-bold text-white">
                          {service.stats[0].value}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-white/30">
                          {service.stats[0].label}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-[var(--color-accent-400)] opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                        <span>Details</span>
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Process Section ──────────────────────────────────────────── */}
      <section className="border-y border-white/[0.04] py-24 lg:py-32">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Our Process"
              heading="From Discovery to Scale"
              description="A proven four-phase engagement model that delivers measurable results at every stage."
              align="center"
            />
          </AnimatedSection>

          <div className="relative mx-auto mt-16 max-w-5xl">
            {/* Connector line (desktop) */}
            <div className="pointer-events-none absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-[var(--color-accent-400)]/15 to-transparent md:block" />

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {processPhases.map((phase, i) => (
                <AnimatedSection key={phase.number} delay={i * 0.1}>
                  <div className="group relative text-center">
                    {/* Phase number */}
                    <div className="relative z-10 mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-300 group-hover:border-[var(--color-accent-400)]/20 group-hover:bg-[var(--color-accent-400)]/[0.06]">
                      <GradientText className="text-2xl font-bold">
                        {phase.number}
                      </GradientText>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white">
                      {phase.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-white/45">
                      {phase.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Why Us ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid items-start gap-8 sm:gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
              {/* Left — statement */}
              <AnimatedSection>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]">
                    Why Aletheia AI
                  </p>
                  <h2 className="mt-5 text-3xl font-bold leading-tight text-white md:text-4xl">
                    We don't just build software.{" "}
                    <span className="text-white/30">
                      We build systems that survive contact with reality.
                    </span>
                  </h2>
                  <p className="mt-6 text-base leading-relaxed text-white/50 lg:text-lg">
                    Most teams can write code. Fewer can architect systems that
                    handle real-world data, real-world users, and real-world
                    failure modes. That's the gap we close.
                  </p>
                </div>
              </AnimatedSection>

              {/* Right — differentiators */}
              <div className="space-y-6">
                {differentiators.map((diff, i) => (
                  <AnimatedSection key={diff.title} delay={i * 0.1}>
                    <GlassPanel className="rounded-2xl p-6 transition-all duration-300 hover:border-[var(--color-accent-400)]/20 lg:p-7">
                      <div className="flex items-start gap-4">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-400)]/10">
                          <svg className="h-4 w-4 text-[var(--color-accent-400)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {diff.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/45">
                            {diff.description}
                          </p>
                        </div>
                      </div>
                    </GlassPanel>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <CTASection />
    </PageTransition>
  );
}
