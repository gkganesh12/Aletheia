import { Container, SectionHeading, AnimatedCounter } from "@/components/ui";
import PageTransition from "@/components/shared/PageTransition";
import PageHero from "@/components/shared/PageHero";
import CTASection from "@/components/shared/CTASection";
import AnimatedSection from "@/components/shared/AnimatedSection";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Static data                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const expertise = [
  "Artificial Intelligence & Machine Learning",
  "Full-Stack Development (MERN / MEAN)",
  "Cybersecurity (Certified Ethical Hacker)",
  "Scalable System Design",
  "Backend Architecture & APIs",
  "Real-time Systems",
];

const coreValues = [
  {
    number: "01",
    title: "Ship It",
    description:
      "We measure success by what's live in production — not slide decks, not prototypes gathering dust.",
  },
  {
    number: "02",
    title: "Engineering First",
    description:
      "Strong engineering is our identity. We solve problems with code, not meetings.",
  },
  {
    number: "03",
    title: "Integrity",
    description:
      "Aletheia means truth. Transparent with clients, honest about timelines, no vaporware.",
  },
  {
    number: "04",
    title: "Own the Problem",
    description:
      "We understand the business context, own the outcome and build solutions that work.",
  },
];

const aboutStats = [
  { target: 3, suffix: "", label: "Products Shipped" },
  { target: 10, suffix: "+", label: "Projects Delivered" },
  { target: 2, suffix: "", label: "Published Packages" },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ────────────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <PageTransition>
      {/* ─── Hero ───────────────────────────────────────────────────────── */}
      <PageHero
        overline="About Us"
        title="The Truth Behind the Name"
        description="Aletheia — Greek for 'truth' or 'disclosure' — is the principle that drives everything we build. An engineering-first AI company that builds products, ships MVPs and deploys systems that scale."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          FOUNDER — Full-width immersive section
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36">
        <Container>
          <div className="grid items-center gap-8 sm:gap-16 lg:grid-cols-[420px_1fr] lg:gap-24">
            {/* ── Photo ──────────────────────────────────────────── */}
            <AnimatedSection>
              <div className="relative mx-auto lg:mx-0">
                {/* Glow */}
                <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[var(--color-accent-400)]/10 via-transparent to-[var(--color-accent-400)]/5 blur-3xl" />

                <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <img
                    src="/images/founder/ganesh-khetawat.png"
                    alt="Ganesh Khetawat — Founder & CEO, Aletheia AI"
                    className="w-full object-cover object-top"
                    style={{ aspectRatio: "3/4" }}
                  />
                  {/* Name overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-8 pb-8 pt-20">
                    <p className="text-2xl font-bold text-white">
                      Ganesh Khetawat
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--color-accent-400)]">
                      Founder & CEO
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* ── Bio ────────────────────────────────────────────── */}
            <AnimatedSection delay={0.15}>
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]">
                  Founder
                </p>

                <p className="text-2xl font-bold leading-snug text-white md:text-3xl lg:text-4xl">
                  A builder at the intersection of AI, systems, and real-world
                  problem solving.
                </p>

                <p className="text-base leading-relaxed text-white/60 md:text-lg">
                  Currently pursuing a degree in Computer Science, Ganesh has
                  worked across full-stack development, cybersecurity, and applied
                  AI — building products that go beyond demos, focused on actual
                  usability and impact.
                </p>

                <p className="text-base leading-relaxed text-white/60 md:text-lg">
                  What sets his work apart is a simple principle:{" "}
                  <span className="font-semibold text-white">
                    technology should solve real problems, not just showcase
                    intelligence.
                  </span>
                </p>

                <p className="text-base leading-relaxed text-white/60 md:text-lg">
                  This belief led to the creation of Aletheia AI.
                </p>

                {/* Expertise pills */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {expertise.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs font-medium text-white/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Social links */}
                <div className="flex items-center gap-6 pt-4">
                  <a
                    href="https://www.linkedin.com/company/aletheiaaitech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/Aletheia-Ai-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://ganeshkhetawat.tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    Portfolio
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          WHY ALETHEIA — Full-width quote-style
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        {/* Subtle background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-white/[0.02]" />

        <Container>
          <div className="relative mx-auto max-w-4xl text-center">
            <AnimatedSection>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]">
                Why Aletheia AI
              </p>

              <h2 className="mt-8 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
                Most AI products are either{" "}
                <span className="text-white/30">impressive in isolation</span>{" "}
                or{" "}
                <span className="text-white/30">useless in real workflows.</span>
              </h2>

              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl">
                Aletheia AI was built to change that. We create intelligent
                systems that integrate seamlessly into how people work —
                delivering outcomes, not just outputs.
              </p>

              <p className="mt-6 text-lg font-semibold text-white md:text-xl">
                No fluff. No hype. Just systems that work.
              </p>
            </AnimatedSection>
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STATS — Clean numbers, no borders
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <Container>
          <AnimatedSection>
            <div className="mx-auto grid max-w-4xl gap-8 text-center sm:grid-cols-3 sm:gap-12">
              {aboutStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-bold text-white sm:text-5xl lg:text-7xl">
                    <AnimatedCounter
                      target={stat.target}
                      suffix={stat.suffix}
                      duration={2000}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium uppercase tracking-wider text-white/40">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VALUES — Minimal, open grid
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-36">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Values"
              heading="What We Stand For"
              align="center"
            />
          </AnimatedSection>

          <div className="mx-auto mt-10 grid max-w-5xl gap-8 sm:mt-16 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4">
            {coreValues.map((value, i) => (
              <AnimatedSection key={value.number} delay={i * 0.1}>
                <div className="group">
                  <span className="text-5xl font-black text-white/[0.05] transition-colors duration-500 group-hover:text-[var(--color-accent-400)]/15">
                    {value.number}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          LOCATION — Simple & clean
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28">
        <Container>
          <AnimatedSection>
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]">
                Location
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                Based in Pune. Building Globally.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/50">
                Headquartered in Pune, India. Building products and shipping
                projects for clients worldwide.
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <CTASection
        heading="Got a Problem Worth Solving?"
        description="If you need something built — an MVP, an AI product, a platform — let's talk."
      />
    </PageTransition>
  );
}
