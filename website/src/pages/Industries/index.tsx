import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Container,
  SectionHeading,
  GlassPanel,
  Button,
  GradientText,
} from "@/components/ui";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { industries } from "@/data/industries";

/* ── Icons ──────────────────────────────────────────────────────────── */

const iconMap: Record<string, React.ReactNode> = {
  heart: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0L12 5.36l-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 20.64l7.36-7.36 1.06-1.06a5.4 5.4 0 0 0 0-7.64z" />
    </svg>
  ),
  building: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01" />
    </svg>
  ),
  graduation: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  shield: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  scale: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M2 14l3-8 3 8a5 5 0 0 1-6 0zM16 14l3-8 3 8a5 5 0 0 1-6 0z" />
    </svg>
  ),
};

/* large icons for the detail panel */
const iconMapLg: Record<string, React.ReactNode> = {
  heart: (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0L12 5.36l-.77-.78a5.4 5.4 0 0 0-7.65 7.65l1.06 1.06L12 20.64l7.36-7.36 1.06-1.06a5.4 5.4 0 0 0 0-7.64z" />
    </svg>
  ),
  building: (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V12h6v10" />
      <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01" />
    </svg>
  ),
  graduation: (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  shield: (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  scale: (
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18" />
      <path d="M5 6l7-3 7 3" />
      <path d="M2 14l3-8 3 8a5 5 0 0 1-6 0zM16 14l3-8 3 8a5 5 0 0 1-6 0z" />
    </svg>
  ),
};

/* ── Capability icons ──────────────────────────────────────────────── */

const capabilityIcons = {
  compliance: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
  threat: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  ai: (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
      <path d="M16 14v2a4 4 0 0 1-8 0v-2" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  ),
};

/* ── Cross-industry data ───────────────────────────────────────────── */

const crossIndustryCapabilities = [
  {
    icon: capabilityIcons.compliance,
    title: "Compliance Automation",
    description:
      "HIPAA, PCI-DSS, SOX, GDPR, FERPA — automated monitoring and reporting tailored to your regulatory landscape.",
    tags: ["HIPAA", "PCI-DSS", "GDPR", "SOX"],
  },
  {
    icon: capabilityIcons.threat,
    title: "Threat Intelligence",
    description:
      "Industry-specific threat feeds, APT tracking, and dark web monitoring relevant to your vertical.",
    tags: ["APT Tracking", "Dark Web", "Threat Feeds"],
  },
  {
    icon: capabilityIcons.ai,
    title: "AI Integration",
    description:
      "From NLP-driven document analysis to computer vision for damage assessment — we build AI that fits your workflow.",
    tags: ["NLP", "Computer Vision", "ML Pipelines"],
  },
];

/* ── Animation variants ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  }),
};

const detailVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

/* ── Industries Page ────────────────────────────────────────────────── */

export default function IndustriesPage() {
  const [activeSlug, setActiveSlug] = useState(industries[0].slug);
  const detailRef = useRef<HTMLDivElement>(null);

  const active = industries.find((i) => i.slug === activeSlug) ?? industries[0];

  const handleTabClick = (slug: string) => {
    setActiveSlug(slug);
    // Smooth scroll to detail on mobile
    if (window.innerWidth < 1024 && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <PageTransition>
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <PageHero
        overline="Industries"
        title="AI That Understands Your Industry"
        description="Deep domain expertise meets cutting-edge engineering. We build AI systems purpose-built for the industries where technology has the highest impact."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries" },
        ]}
      />

      {/* ─── Industry Selector + Detail ───────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Explore"
              heading="Tailored Solutions for Your Sector"
              description="Select an industry to see the specific challenges we solve and the AI-driven approaches we deploy."
              align="center"
            />
          </AnimatedSection>

          {/* Tabs */}
          <AnimatedSection delay={0.1}>
            <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-3">
              {industries.map((industry) => (
                <button
                  key={industry.slug}
                  onClick={() => handleTabClick(industry.slug)}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                    activeSlug === industry.slug
                      ? "bg-[var(--color-accent-400)]/15 text-white shadow-[0_0_20px_rgba(0,212,255,0.1)]"
                      : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70"
                  )}
                >
                  {/* Active indicator underline */}
                  {activeSlug === industry.slug && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full border border-[var(--color-accent-400)]/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={cn(
                    "relative transition-colors",
                    activeSlug === industry.slug
                      ? "text-[var(--color-accent-400)]"
                      : "text-white/30 group-hover:text-white/50"
                  )}>
                    {iconMap[industry.icon] || iconMap.shield}
                  </span>
                  <span className="relative">{industry.name}</span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Detail Panel */}
          <div ref={detailRef} className="mx-auto mt-12 max-w-6xl scroll-mt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                variants={detailVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {/* Main card */}
                <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">
                  {/* Header row */}
                  <div className="border-b border-white/[0.06] px-8 py-8 lg:px-12 lg:py-10">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-5">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--color-accent-400)]/10 text-[var(--color-accent-400)]">
                          {iconMapLg[active.icon] || iconMapLg.shield}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white lg:text-3xl">
                            {active.name}
                          </h3>
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50 lg:text-base">
                            {active.description}
                          </p>
                        </div>
                      </div>
                      <Link to="/contact" className="flex-shrink-0">
                        <Button variant="primary" size="sm">
                          Discuss Solutions
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Stats bar */}
                  <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-b border-white/[0.06]">
                    {active.stats.map((stat) => (
                      <div key={stat.label} className="px-6 py-6 text-center lg:px-8 lg:py-8">
                        <div className="text-2xl font-bold lg:text-3xl">
                          <GradientText>{stat.value}</GradientText>
                        </div>
                        <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Content grid */}
                  <div className="grid gap-0 lg:grid-cols-2">
                    {/* Challenges */}
                    <div className="border-b border-white/[0.06] px-8 py-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-10">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
                          <svg className="h-3.5 w-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-red-400/80">
                          Key Challenges
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {active.challenges.map((challenge, i) => (
                          <motion.li
                            key={challenge}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            className="flex items-start gap-3 text-sm leading-relaxed text-white/50"
                          >
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-red-400/60" />
                            {challenge}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Solutions */}
                    <div className="border-b border-white/[0.06] px-8 py-8 lg:px-12 lg:py-10">
                      <div className="flex items-center gap-2.5 mb-5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-accent-400)]/10">
                          <svg className="h-3.5 w-3.5 text-[var(--color-accent-400)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-400)]/80">
                          Our Solutions
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {active.solutions.map((solution, i) => (
                          <motion.li
                            key={solution}
                            custom={i}
                            variants={fadeUp}
                            initial="hidden"
                            animate="visible"
                            className="flex items-start gap-3 text-sm leading-relaxed text-white/50"
                          >
                            <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-accent-400)]/60" />
                            {solution}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Use cases footer */}
                  <div className="px-8 py-8 lg:px-12 lg:py-10">
                    <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
                      Use Cases
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {active.useCases.map((useCase, i) => (
                        <motion.span
                          key={useCase}
                          custom={i}
                          variants={fadeUp}
                          initial="hidden"
                          animate="visible"
                          className="rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/55 transition-colors hover:border-[var(--color-accent-400)]/20 hover:text-white/75"
                        >
                          {useCase}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </section>

      {/* ─── Industry Overview Cards (quick glance) ───────────────────── */}
      <section className="border-t border-white/[0.04] py-20 lg:py-28">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="At a Glance"
              heading="Five Industries, One Mission"
              description="Regardless of the sector, our approach stays the same — understand the problem, engineer the solution, measure the impact."
              align="center"
            />
          </AnimatedSection>

          <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map((industry, i) => (
              <AnimatedSection key={industry.slug} delay={i * 0.08}>
                <motion.button
                  onClick={() => {
                    setActiveSlug(industry.slug);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setTimeout(() => {
                      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                  className="group relative block w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-left transition-all duration-300 hover:border-[var(--color-accent-400)]/25 hover:bg-white/[0.04]"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[var(--color-accent-400)]/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-400)]/10 text-[var(--color-accent-400)] transition-colors duration-300 group-hover:bg-[var(--color-accent-400)]/15">
                      {iconMap[industry.icon] || iconMap.shield}
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-white">
                      {industry.name}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-white/40">
                      {industry.description.slice(0, 70)}...
                    </p>

                    {/* Mini stats */}
                    <div className="mt-4 space-y-1">
                      {industry.stats.slice(0, 2).map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between text-[10px]"
                        >
                          <span className="uppercase tracking-wider text-white/30">
                            {stat.label}
                          </span>
                          <span className="font-semibold text-[var(--color-accent-400)]/70">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.button>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Cross-Industry Capabilities ──────────────────────────────── */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.015] via-transparent to-white/[0.015]" />

        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Cross-Industry"
              heading="Capabilities That Scale Everywhere"
              description="Core competencies that power our solutions across every vertical."
              align="center"
            />
          </AnimatedSection>

          <div className="relative mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            {crossIndustryCapabilities.map((cap, i) => (
              <AnimatedSection key={cap.title} delay={i * 0.1}>
                <GlassPanel className="group h-full rounded-2xl p-7 transition-all duration-300 hover:border-[var(--color-accent-400)]/20">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-400)]/10 text-[var(--color-accent-400)] transition-colors duration-300 group-hover:bg-[var(--color-accent-400)]/15">
                    {cap.icon}
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {cap.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/45">
                    {cap.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {cap.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassPanel>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Trust Statement ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <Container>
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]">
                Our Commitment
              </p>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                Every industry has its own{" "}
                <span className="text-white/30">language, regulations, and risks.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/50">
                We don't apply generic AI. We build systems that understand your
                domain — its compliance frameworks, its threat models, its
                workflows — and deliver solutions that actually work in production.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <CTASection />
    </PageTransition>
  );
}
