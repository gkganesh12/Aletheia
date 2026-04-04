import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Container,
  GradientText,
  Button,
} from "@/components/ui";
import { productDetails } from "@/data/productDetails";
import PageTransition from "@/components/shared/PageTransition";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTASection from "@/components/shared/CTASection";
import MarqueeStrip from "@/components/shared/MarqueeStrip";

/* ── Tech marquee data ─────────────────────────────────────────────── */

interface TechItem { name: string; slug: string; color: string }

const TECH_ROW_1: TechItem[] = [
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "Go", slug: "go", color: "00ADD8" },
  { name: "Rust", slug: "rust", color: "DEA584" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "TensorFlow", slug: "tensorflow", color: "FF6F00" },
  { name: "PyTorch", slug: "pytorch", color: "EE4C2C" },
  { name: "LangChain", slug: "langchain", color: "white" },
  { name: "Kubernetes", slug: "kubernetes", color: "326CE5" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "AWS", slug: "amazonaws", color: "FF9900" },
];

const TECH_ROW_2: TechItem[] = [
  { name: "Kafka", slug: "apachekafka", color: "white" },
  { name: "Redis", slug: "redis", color: "FF4438" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
  { name: "Neo4j", slug: "neo4j", color: "4581C3" },
  { name: "GraphQL", slug: "graphql", color: "E10098" },
  { name: "Terraform", slug: "terraform", color: "844FBA" },
  { name: "CUDA", slug: "nvidia", color: "76B900" },
  { name: "OpenAI", slug: "openai", color: "white" },
  { name: "Hugging Face", slug: "huggingface", color: "FFD21E" },
  { name: "Elasticsearch", slug: "elasticsearch", color: "005571" },
];

function TechPill({ tech }: { tech: TechItem }) {
  return (
    <span className="mx-3 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-base font-medium text-white/50 transition-all duration-300 hover:border-white/30 hover:text-white hover:bg-white/[0.07] select-none cursor-default">
      <img
        src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
        alt={`${tech.name} logo`}
        width={28}
        height={28}
        className="w-7 h-7 object-contain flex-shrink-0"
        loading="lazy"
        draggable={false}
      />
      {tech.name}
    </span>
  );
}

/* ── Product section ───────────────────────────────────────────────── */

function ProductSection({
  product,
  index,
}: {
  product: (typeof productDetails)[number];
  index: number;
}) {
  const [from, to] = product.gradient;
  const isReversed = index % 2 === 1;

  return (
    <section className="relative overflow-hidden py-28 lg:py-40">
      {/* ── Atmosphere: gradient glow + ghost monogram ──────────── */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Large glow */}
        <div
          className="absolute h-[700px] w-[700px] rounded-full opacity-[0.035] blur-[150px]"
          style={{
            background: `radial-gradient(circle, ${from}, ${to}40, transparent)`,
            top: "-15%",
            left: isReversed ? "50%" : "-10%",
          }}
        />
        {/* Secondary glow */}
        <div
          className="absolute h-[400px] w-[400px] rounded-full opacity-[0.025] blur-[100px]"
          style={{
            background: `radial-gradient(circle, ${to}, transparent)`,
            bottom: "0%",
            right: isReversed ? "auto" : "5%",
            left: isReversed ? "5%" : "auto",
          }}
        />
        {/* Ghost monogram */}
        <div
          className="absolute top-1/2 -translate-y-1/2 select-none"
          style={{
            left: isReversed ? "-5%" : "auto",
            right: isReversed ? "auto" : "-5%",
          }}
        >
          <span
            className="block text-[clamp(200px,22vw,340px)] font-black leading-none"
            style={{
              backgroundImage: `linear-gradient(160deg, ${from}08, ${to}04)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {product.name[0]}
          </span>
        </div>
      </div>

      {/* ── Accent line at top ──────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${from}30, ${to}20, transparent)`,
        }}
      />

      <Container>
        <div
          className={cn(
            "relative grid items-start gap-14 lg:gap-24",
            isReversed
              ? "lg:grid-cols-[1fr_1.15fr]"
              : "lg:grid-cols-[1.15fr_1fr]"
          )}
        >
          {/* ── Info column ─────────────────────────────────── */}
          <div className={cn("relative", isReversed && "lg:order-2")}>
            <AnimatedSection>
              {/* Product number label */}
              <div className="flex items-center gap-3">
                <div
                  className="h-px w-8"
                  style={{
                    background: `linear-gradient(to right, ${from}, ${to})`,
                  }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: `${from}90` }}
                >
                  Product {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Name */}
              <h2 className="mt-5 text-5xl font-bold leading-[1.05] lg:text-6xl xl:text-7xl">
                <GradientText from={from} to={to}>
                  {product.name}
                </GradientText>
              </h2>

              {/* Tagline */}
              <p className="mt-3 text-xl font-medium text-white/70 lg:text-2xl">
                {product.tagline}
              </p>

              {/* Description */}
              <p className="mt-6 max-w-lg text-[15px] leading-[1.75] text-white/45">
                {product.description.slice(0, 300)}...
              </p>

              {/* CTA row */}
              <div className="mt-10 flex items-center gap-5">
                <Button asChild variant="primary" size="lg">
                  <Link to={`/products/${product.slug}`}>
                    Explore {product.name}
                  </Link>
                </Button>
                <Link
                  to="/contact"
                  className="group flex items-center gap-1.5 text-sm font-medium text-white/35 transition-colors hover:text-white/60"
                >
                  Request Demo
                  <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>
          </div>

          {/* ── Dashboard column ────────────────────────────── */}
          <div className={cn("relative", isReversed && "lg:order-1")}>
            <AnimatedSection delay={0.12}>
              {/* System card */}
              <div
                className="overflow-hidden rounded-2xl border bg-white/[0.015]"
                style={{
                  borderColor: `${from}15`,
                }}
              >
                {/* Metrics strip */}
                <div
                  className="grid grid-cols-2 gap-px sm:grid-cols-4"
                  style={{ background: `${from}08` }}
                >
                  {product.metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-[var(--color-primary-950)] px-4 py-5 text-center first:rounded-tl-2xl last:rounded-tr-2xl sm:[&:nth-child(1)]:rounded-tl-2xl sm:[&:nth-child(4)]:rounded-tr-2xl"
                    >
                      <div
                        className="text-xl font-bold tracking-tight bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
                        }}
                      >
                        {metric.value}
                      </div>
                      <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/25">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="divide-y" style={{ borderColor: `${from}0a` }}>
                  {product.features.slice(0, 5).map((feature, i) => (
                    <motion.div
                      key={feature.title}
                      className="group flex items-start gap-4 px-6 py-5 transition-colors duration-200 hover:bg-white/[0.02]"
                      style={{ borderColor: `${from}0a` }}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.06,
                        ease: [0.215, 0.61, 0.355, 1],
                      }}
                    >
                      {/* Index pip */}
                      <div
                        className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${from}12, ${to}12)`,
                          color: `${from}aa`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">
                          {feature.title}
                        </h4>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-white/30 group-hover:text-white/40 transition-colors">
                          {feature.description.slice(0, 100)}...
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Tech + use cases footer */}
                <div
                  className="px-6 py-5"
                  style={{ borderTop: `1px solid ${from}0a` }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {product.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                        style={{
                          background: `${from}08`,
                          color: `${from}70`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function ProductsPage() {
  return (
    <PageTransition>
      {/* ═══ Custom Hero ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-white/[0.04] pb-20 pt-36 lg:pb-32 lg:pt-44">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.06]"
            style={{
              background:
                "radial-gradient(circle, #00d4ff 0%, #0077ff 30%, transparent 70%)",
            }}
          />
        </div>

        <Container className="relative z-10">
          {/* Breadcrumbs */}
          <motion.nav
            className="mb-8 flex items-center gap-2 text-xs text-white/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/" className="hover:text-white/50 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white/50">Products</span>
          </motion.nav>

          <div className="grid items-end gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            {/* Left — headline */}
            <div>
              <motion.span
                className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-400)]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Our Products
              </motion.span>

              <motion.h1
                className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                Purpose-Built Platforms for a{" "}
                <span className="text-white/30">Hostile World</span>
              </motion.h1>

              <motion.p
                className="mt-5 max-w-xl text-lg leading-relaxed text-white/45"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                Three products. Three layers of defence. Each one built from
                the ground up with AI at its core.
              </motion.p>
            </div>

            {/* Right — product index cards */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {productDetails.map((product, i) => {
                const [from, to] = product.gradient;
                return (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-300 hover:bg-white/[0.04]"
                    style={{
                      borderColor: undefined,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${from}30`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "";
                    }}
                  >
                    {/* Branded number */}
                    <div
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${from}15, ${to}15)`,
                        color: from,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white group-hover:text-white transition-colors">
                        {product.name}
                      </div>
                      <div className="text-[11px] text-white/35">
                        {product.tagline}
                      </div>
                    </div>
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-white/15 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-white/40"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </Link>
                );
              })}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ═══ Product Sections ═════════════════════════════════════════ */}
      {productDetails.map((product, index) => (
        <ProductSection
          key={product.slug}
          product={product}
          index={index}
        />
      ))}

      {/* ═══ Tech Stack Ribbon ════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-white/[0.04] py-16">
        <AnimatedSection>
          <div className="mb-12 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--color-accent-400)]/70">
              Technology Stack
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Built With Industry-Leading Tools
            </h3>
          </div>
        </AnimatedSection>

        <MarqueeStrip speed={40} direction="left" className="mb-5">
          {TECH_ROW_1.map((tech) => (
            <TechPill key={tech.name} tech={tech} />
          ))}
        </MarqueeStrip>

        <MarqueeStrip speed={35} direction="right">
          {TECH_ROW_2.map((tech) => (
            <TechPill key={tech.name} tech={tech} />
          ))}
        </MarqueeStrip>
      </section>

      {/* ═══ CTA ══════════════════════════════════════════════════════ */}
      <CTASection />
    </PageTransition>
  );
}
