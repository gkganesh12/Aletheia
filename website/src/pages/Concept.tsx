"use client";

import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NeuralCanvas from "@/components/shared/NeuralCanvas";
import PageSEO, { breadcrumbJsonLd } from "@/components/shared/PageSEO";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ─────────────────────────────────────────────────────────────── */

const features = [
  {
    title: "Intelligent Agents",
    subtitle: "Think. Decide. Act.",
    description:
      "AI agents that understand context, reason through complexity, and execute multi-step workflows — completely autonomously.",
    metric: "13",
    metricLabel: "Specialized Agents",
    image: "/images/about/ai-chess.jpg",
    glow: "rgba(139, 92, 246, 0.25)",
  },
  {
    title: "Autonomous Workflows",
    subtitle: "Set it. Forget it.",
    description:
      "End-to-end automation pipelines that self-optimize, self-heal, and scale without human intervention.",
    metric: "99.9%",
    metricLabel: "Uptime",
    image: "/images/about/humanoid.jpg",
    glow: "rgba(99, 102, 241, 0.25)",
  },
  {
    title: "Enterprise Scale",
    subtitle: "Built for billions.",
    description:
      "Infrastructure designed from the ground up to handle enterprise-grade workloads at any scale, any time.",
    metric: "10x",
    metricLabel: "Faster Deployment",
    image: "/images/about/architecture.jpg",
    glow: "rgba(6, 182, 212, 0.25)",
  },
  {
    title: "Real-time Intelligence",
    subtitle: "Insights. Instantly.",
    description:
      "Live data processing and analysis that transforms raw information into actionable intelligence in milliseconds.",
    metric: "<50ms",
    metricLabel: "Response Time",
    image: "/images/case-studies/security-dashboard.jpg",
    glow: "rgba(168, 85, 247, 0.25)",
  },
];

const products = [
  {
    name: "Inscrape",
    tagline: "Intelligence at Scale",
    description:
      "AI-powered OSINT platform — continuous scraping, enriching and correlating data from surface, deep and dark web into actionable threat intelligence.",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
    image: "/images/hero/abstract-light.jpg",
  },
  {
    name: "Nirvana",
    tagline: "Breach-Proof by Design",
    description:
      "Self-healing security orchestration that detects, contains and remediates threats autonomously — closing the loop so SOC teams focus on strategy.",
    gradient: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
    image: "/images/case-studies/security-dashboard.jpg",
  },
  {
    name: "SwarmScope",
    tagline: "See Everything. Miss Nothing.",
    description:
      "Distributed AI sensor network providing full-spectrum visibility. Lightweight agents collaborate as a swarm to detect anomalies in sub-milliseconds.",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    image: "/images/products/llm-glass.jpg",
  },
];

const stats = [
  { value: 3, suffix: "", label: "Products", prefix: "" },
  { value: 13, suffix: "", label: "AI Agents", prefix: "" },
  { value: 99.9, suffix: "%", label: "Uptime", prefix: "" },
  { value: 50, suffix: "ms", label: "Latency", prefix: "<" },
];

const revealWords =
  "We build AI that thinks, decides, and acts — so you don't have to.".split(" ");
const accentSet = new Set(["thinks,", "decides,", "acts"]);

/* ── Noise SVG ────────────────────────────────────────────────────────── */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

/* ── Divider ──────────────────────────────────────────────────────────── */
function Divider({ className }: { className?: string }) {
  return (
    <div className={`gsap-divider flex items-center justify-center py-2 ${className ?? ""}`}>
      <div className="h-px w-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent sm:w-0" />
    </div>
  );
}

/* ── TiltCard ─────────────────────────────────────────────────────────── */
function TiltCard({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale3d(1.01,1.01,1.01)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, transition: "transform 0.4s cubic-bezier(.03,.98,.52,.99)", willChange: "transform" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CONCEPT PAGE
   ═══════════════════════════════════════════════════════════════════════ */

export default function Concept() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Hero */
  const heroRef = useRef<HTMLElement>(null);
  const heroProgressRef = useRef(0);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroTagRef = useRef<HTMLParagraphElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);

  /* Text Reveal */
  const revealRef = useRef<HTMLElement>(null);
  const revealWordsRef = useRef<HTMLSpanElement[]>([]);

  /* Features */
  const featuresRef = useRef<HTMLElement>(null);
  const featureSlidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const featureOrbRef = useRef<HTMLDivElement>(null);
  const featureDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const featureImagesRef = useRef<(HTMLImageElement | null)[]>([]);

  /* Products */
  const productsRef = useRef<HTMLElement>(null);
  const productsTrackRef = useRef<HTMLDivElement>(null);
  const productsIntroRef = useRef<HTMLDivElement>(null);

  /* Stats */
  const statsRef = useRef<HTMLElement>(null);
  const statsHeadingRef = useRef<HTMLParagraphElement>(null);
  const statsLineTopRef = useRef<HTMLDivElement>(null);
  const statsLineBottomRef = useRef<HTMLDivElement>(null);
  const statCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statNumbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  /* CTA */
  const ctaRef = useRef<HTMLElement>(null);
  const ctaTitleRef = useRef<HTMLHeadingElement>(null);
  const ctaDescRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const ctaGlowRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        /* ═══════════════════════════════════════════════════════
           1. HERO — Pin + canvas progress + text animations
           ═══════════════════════════════════════════════════════ */
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=300%",
            pin: true,
            scrub: 1.5,
            onUpdate: (self) => { heroProgressRef.current = self.progress; },
          },
        });

        heroTl
          .to(heroTitleRef.current, { y: -100, opacity: 0, scale: 0.95, duration: 0.25, ease: "power2.in" }, 0)
          .to(heroTagRef.current, { y: -60, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.03)
          .fromTo(heroSubRef.current, { opacity: 0, y: 50, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" }, 0.35)
          .to(heroSubRef.current, { opacity: 0, y: -30, duration: 0.15 }, 0.72);

        /* ═══════════════════════════════════════════════════════
           2. DIVIDERS — Draw width on scroll
           ═══════════════════════════════════════════════════════ */
        document.querySelectorAll(".gsap-divider > div").forEach((line) => {
          gsap.to(line, {
            width: "10rem",
            ease: "power2.out",
            scrollTrigger: { trigger: line, start: "top 90%", end: "top 50%", scrub: 1 },
          });
        });

        /* ═══════════════════════════════════════════════════════
           3. TEXT REVEAL — Pin + word-by-word + blur
           ═══════════════════════════════════════════════════════ */
        const words = revealWordsRef.current;
        const revealTl = gsap.timeline({
          scrollTrigger: { trigger: revealRef.current, start: "top top", end: "+=200%", pin: true, scrub: 1 },
        });
        words.forEach((word, i) => {
          revealTl.fromTo(
            word,
            { opacity: 0.08, y: 8, filter: "blur(4px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.05, ease: "power2.out" },
            (i / words.length) * 0.75,
          );
        });
        revealTl.to(words, { opacity: 0.1, y: -10, filter: "blur(2px)", duration: 0.12, stagger: 0.004 }, 0.84);

        /* ═══════════════════════════════════════════════════════
           4. FEATURES — Pin + crossfade + image parallax + dots
           ═══════════════════════════════════════════════════════ */
        const featuresTl = gsap.timeline({
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top top",
            end: `+=${features.length * 120}%`,
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
              const idx = Math.min(features.length - 1, Math.floor(self.progress * features.length));
              featureDotsRef.current.forEach((d, di) => {
                if (!d) return;
                d.style.background = di === idx ? "#8b5cf6" : "rgba(255,255,255,0.08)";
                d.style.boxShadow = di === idx ? "0 0 8px 2px rgba(139,92,246,0.4)" : "none";
                d.style.height = di === idx ? "24px" : "20px";
              });
            },
          },
        });

        features.forEach((f, i) => {
          if (i === 0) return;
          const prev = featureSlidesRef.current[i - 1];
          const curr = featureSlidesRef.current[i];
          const prevImg = featureImagesRef.current[i - 1];
          const currImg = featureImagesRef.current[i];
          if (!prev || !curr) return;

          const pos = (i - 1) / (features.length - 1);

          featuresTl
            .to(prev, { opacity: 0, y: -60, duration: 0.15, ease: "power2.in" }, pos + 0.05)
            .fromTo(curr, { opacity: 0, y: 70 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, pos + 0.12);

          if (prevImg) featuresTl.to(prevImg, { scale: 0.92, duration: 0.15 }, pos + 0.05);
          if (currImg) featuresTl.fromTo(currImg, { scale: 1.12 }, { scale: 1, duration: 0.2, ease: "power2.out" }, pos + 0.12);

          featuresTl.to(featureOrbRef.current, { boxShadow: `0 0 200px 100px ${f.glow}`, duration: 0.25, ease: "power1.inOut" }, pos + 0.08);
        });

        /* ═══════════════════════════════════════════════════════
           5. PRODUCTS — Horizontal scroll + intro stagger + card parallax
           ═══════════════════════════════════════════════════════ */
        // Intro text stagger
        if (productsIntroRef.current) {
          const introChildren = productsIntroRef.current.children;
          gsap.from(introChildren, {
            y: 40,
            opacity: 0,
            stagger: 0.12,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: productsRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          });
        }

        // Horizontal scroll
        if (productsTrackRef.current && productsRef.current) {
          const total = productsTrackRef.current.scrollWidth;
          const view = window.innerWidth;
          gsap.to(productsTrackRef.current, {
            x: -(total - view),
            ease: "none",
            scrollTrigger: { trigger: productsRef.current, start: "top top", end: () => `+=${total - view}`, pin: true, scrub: 1, invalidateOnRefresh: true },
          });

          // Per-card depth parallax (images shift slightly relative to cards)
          productsTrackRef.current.querySelectorAll<HTMLElement>(".gsap-card-img").forEach((img) => {
            gsap.to(img, {
              x: -30,
              ease: "none",
              scrollTrigger: { trigger: productsRef.current, start: "top top", end: () => `+=${total - view}`, scrub: 1 },
            });
          });
        }

        /* ═══════════════════════════════════════════════════════
           6. STATS — Heading, lines draw, cards stagger, numbers count
           ═══════════════════════════════════════════════════════ */
        // Heading fade in
        gsap.from(statsHeadingRef.current, {
          y: 30, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 75%", toggleActions: "play none none reverse" },
        });

        // Horizontal lines draw
        [statsLineTopRef, statsLineBottomRef].forEach((ref) => {
          if (!ref.current) return;
          gsap.fromTo(ref.current, { scaleX: 0 }, {
            scaleX: 1, duration: 1, ease: "power2.inOut",
            scrollTrigger: { trigger: ref.current, start: "top 85%", toggleActions: "play none none reverse" },
          });
        });

        // Stat cards stagger in
        const validCards = statCardsRef.current.filter(Boolean);
        gsap.from(validCards, {
          y: 50, opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.7, ease: "back.out(1.4)",
          scrollTrigger: { trigger: statsRef.current, start: "top 65%", toggleActions: "play none none reverse" },
        });

        // Numbers count up
        stats.forEach((stat, i) => {
          const el = statNumbersRef.current[i];
          if (!el) return;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: stat.value,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: 1 },
            onUpdate: () => {
              el.textContent = `${stat.prefix}${stat.value % 1 !== 0 ? obj.val.toFixed(1) : Math.round(obj.val)}${stat.suffix}`;
            },
          });
        });

        /* ═══════════════════════════════════════════════════════
           7. CTA — Title split, description, button, glow pulse
           ═══════════════════════════════════════════════════════ */
        const ctaTl = gsap.timeline({
          scrollTrigger: { trigger: ctaRef.current, start: "top 70%", toggleActions: "play none none reverse" },
        });
        ctaTl
          .from(ctaTitleRef.current, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
          .from(ctaDescRef.current, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .from(ctaBtnRef.current, { y: 20, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3");

        // Glow parallax
        gsap.to(ctaGlowRef.current, {
          y: -60,
          ease: "none",
          scrollTrigger: { trigger: ctaRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });

        /* ═══════════════════════════════════════════════════════
           8. GLOBAL — Background glow parallax on features
           ═══════════════════════════════════════════════════════ */
        gsap.to(featureOrbRef.current, {
          y: -80,
          ease: "none",
          scrollTrigger: { trigger: featuresRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
        });

        ScrollTrigger.refresh();
      }, containerRef);
      return () => ctx.revert();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  /* ═══════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════ */
  return (
    <>
      <PageSEO
        title="Concept"
        description="Explore the vision and design concept behind Aletheia AI's approach to AI engineering and product development."
        path="/concept"
        jsonLd={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Concept", path: "/concept" }])}
      />
      <div ref={containerRef} className="bg-[#050505]">
        {/* Global noise */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" style={{ backgroundImage: NOISE, mixBlendMode: "overlay" }} />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <NeuralCanvas progressRef={heroProgressRef} className="h-full w-full" />
        </div>

        <div className="relative z-10 text-center">
          <h1
            ref={heroTitleRef}
            className="text-[clamp(3.5rem,11vw,10rem)] font-bold leading-[0.9] tracking-tighter text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ALETHEIA
          </h1>
          <p
            ref={heroTagRef}
            className="mt-5 text-base tracking-widest text-white/30 sm:text-lg"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ARTIFICIAL INTELLIGENCE AGENCY
          </p>
        </div>

        <div ref={heroSubRef} className="absolute z-10 px-6 text-center" style={{ opacity: 0 }}>
          <p className="text-[clamp(1.2rem,3vw,2.5rem)] font-light leading-tight text-white/80" style={{ fontFamily: "var(--font-heading)" }}>
            3 Products. 6 Services. 13 Agents.
          </p>
          <p className="mt-3 text-sm text-white/20 sm:text-base">One intelligent ecosystem.</p>
        </div>

        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/15">Scroll</span>
          <div className="h-10 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      <Divider />

      {/* ═══ TEXT REVEAL ════════════════════════════════════════════════ */}
      <section ref={revealRef} className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[400px] rounded-full opacity-[0.06] blur-[100px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
        </div>
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-[clamp(1.6rem,3.8vw,3.2rem)] font-medium leading-[1.4] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            {revealWords.map((word, i) => (
              <span
                key={i}
                ref={(el) => { if (el) revealWordsRef.current[i] = el; }}
                className={`mr-[0.3em] inline-block ${accentSet.has(word) ? "text-[#8b5cf6]" : "text-white"}`}
                style={{ opacity: 0.08 }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </section>

      <Divider />

      {/* ═══ FEATURES ══════════════════════════════════════════════════ */}
      <section ref={featuresRef} className="relative h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            ref={featureOrbRef}
            className="h-[450px] w-[450px] rounded-full opacity-20 blur-[120px] sm:h-[550px] sm:w-[550px] md:h-[650px] md:w-[650px]"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)", boxShadow: `0 0 180px 90px ${features[0].glow}`, willChange: "box-shadow, transform" }}
          />
        </div>

        {features.map((f, i) => (
          <div
            key={i}
            ref={(el) => { featureSlidesRef.current[i] = el; }}
            className="absolute inset-0 flex items-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-20">
              <div className="flex flex-col justify-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20 sm:text-sm">
                  0{i + 1} / 0{features.length}
                </p>
                <h2 className="mt-4 text-[clamp(2rem,5vw,4.2rem)] font-bold leading-[1.05] tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  {f.title}
                </h2>
                <p className="mt-2 text-base font-medium text-white/40 sm:text-lg md:text-xl">{f.subtitle}</p>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-white/30 sm:text-base">{f.description}</p>
                <div className="mt-10 flex items-end gap-3 border-t border-white/[0.06] pt-6">
                  <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none text-transparent" style={{ fontFamily: "var(--font-heading)" }}>
                    {f.metric}
                  </span>
                  <span className="mb-2 text-xs text-white/25 sm:text-sm">{f.metricLabel}</span>
                </div>
              </div>

              <div className="relative hidden items-center justify-center md:flex">
                <div className="relative h-[340px] w-[340px] overflow-hidden rounded-3xl lg:h-[420px] lg:w-[420px]" style={{ boxShadow: `0 0 80px 30px ${f.glow}, 0 30px 60px -15px rgba(0,0,0,0.6)` }}>
                  <img ref={(el) => { featureImagesRef.current[i] = el; }} src={f.image} alt={f.title} className="h-full w-full object-cover" style={{ willChange: "transform" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.55) 0%, transparent 40%, rgba(5,5,5,0.15) 100%)" }} />
                  <div className="absolute inset-0 rounded-3xl border border-white/[0.08]" />
                  <div className="absolute left-4 top-4 h-6 w-6 border-l border-t border-white/10" />
                  <div className="absolute bottom-4 right-4 h-6 w-6 border-b border-r border-white/10" />
                </div>
                <div className="absolute -inset-5 animate-[spin_25s_linear_infinite] rounded-3xl border border-white/[0.035]" />
                <div className="absolute -inset-11 animate-[spin_40s_linear_infinite_reverse] rounded-3xl border border-dashed border-white/[0.025]" />
              </div>
            </div>
          </div>
        ))}

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {features.map((_, i) => (
            <div
              key={i}
              ref={(el) => { featureDotsRef.current[i] = el; }}
              className="w-[3px] rounded-full transition-all duration-500"
              style={{ height: i === 0 ? "24px" : "20px", background: i === 0 ? "#8b5cf6" : "rgba(255,255,255,0.08)", boxShadow: i === 0 ? "0 0 8px 2px rgba(139,92,246,0.4)" : "none" }}
            />
          ))}
        </div>
      </section>

      <Divider />

      {/* ═══ HORIZONTAL PRODUCTS ════════════════════════════════════════ */}
      <section ref={productsRef} className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div ref={productsTrackRef} className="flex items-center gap-8 pl-[8vw] pr-[8vw]" style={{ width: "fit-content" }}>
            {/* Intro — children will stagger in via GSAP */}
            <div ref={productsIntroRef} className="flex h-[70vh] w-[40vw] min-w-[320px] flex-shrink-0 flex-col justify-center pr-8 md:pr-16">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/20 sm:text-sm">Products</p>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-bold leading-tight tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                Three products.
                <br />
                <span className="bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] bg-clip-text text-transparent">One mission.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm text-white/30 sm:text-base">
                Each product works standalone or as part of the unified Aletheia ecosystem.
              </p>
            </div>

            {/* Cards */}
            {products.map((p, i) => (
              <TiltCard
                key={i}
                className="group relative flex h-[70vh] w-[38vw] min-w-[340px] flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-white/[0.06] hover:border-white/[0.14]"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="gsap-card-img relative h-[45%] w-full overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(5,5,5,1) 0%, rgba(5,5,5,0.35) 45%, transparent 100%)" }} />
                  <div className="absolute inset-0 opacity-15 mix-blend-overlay" style={{ background: p.gradient }} />
                </div>

                <div className="relative flex flex-1 flex-col justify-between p-8 sm:p-10">
                  <div>
                    <span className="text-xs font-medium tracking-widest text-white/15 sm:text-sm">0{i + 1}</span>
                    <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.5rem)] font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>{p.name}</h3>
                    <p className="mt-1 text-sm font-medium text-white/35 sm:text-base">{p.tagline}</p>
                  </div>
                  <p className="max-w-sm text-sm leading-relaxed text-white/25 sm:text-base">{p.description}</p>
                  <button
                    onClick={() => navigate("/products")}
                    className="group/btn relative self-start overflow-hidden rounded-full px-6 py-2.5 text-sm font-medium text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    <span className="absolute inset-0 rounded-full border border-white/[0.08] transition-colors duration-300 group-hover/btn:border-white/20" />
                    <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/btn:opacity-100" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), transparent 60%)" }} />
                    <span className="relative">Learn more&nbsp;&rarr;</span>
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ═══ STATS ═════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="relative py-28 sm:py-36 md:py-48">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[350px] w-[350px] rounded-full opacity-[0.07] blur-[100px]" style={{ background: "radial-gradient(circle, #8b5cf6, transparent 70%)" }} />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <p ref={statsHeadingRef} className="mb-14 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/15 sm:mb-20 sm:text-sm">
            By the numbers
          </p>
          <div ref={statsLineTopRef} className="mx-auto mb-16 h-px w-full max-w-4xl origin-center bg-gradient-to-r from-transparent via-white/[0.06] to-transparent sm:mb-20" />

          <div className="grid grid-cols-2 gap-10 sm:gap-14 md:grid-cols-4 md:gap-8">
            {stats.map((s, i) => (
              <div key={i} ref={(el) => { statCardsRef.current[i] = el; }} className="text-center">
                <span
                  ref={(el) => { statNumbersRef.current[i] = el; }}
                  className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-[clamp(2.5rem,6vw,5rem)] font-bold text-transparent"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {s.prefix}0{s.suffix}
                </span>
                <p className="mt-3 text-xs uppercase tracking-[0.15em] text-white/20 sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          <div ref={statsLineBottomRef} className="mx-auto mt-16 h-px w-full max-w-4xl origin-center bg-gradient-to-r from-transparent via-white/[0.06] to-transparent sm:mt-20" />
        </div>
      </section>

      {/* ═══ CTA ════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-28">
        <div ref={ctaGlowRef} className="pointer-events-none absolute h-[400px] w-[400px] rounded-full opacity-[0.12] blur-[120px]" style={{ background: "radial-gradient(circle, #8b5cf6 0%, #6366f1 50%, transparent 100%)" }} />

        <div className="relative z-10 px-6 text-center">
          <h2
            ref={ctaTitleRef}
            className="text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ready to build the future?
          </h2>
          <p ref={ctaDescRef} className="mx-auto mt-5 max-w-md text-sm text-white/35 sm:text-base">
            Let&apos;s create intelligent systems that transform how your business operates.
          </p>

          {/* Spinning gradient border button */}
          <button
            ref={ctaBtnRef}
            onClick={() => navigate("/contact")}
            className="group relative mt-10 inline-flex items-center justify-center overflow-hidden rounded-full p-px"
          >
            <span className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full" style={{ background: "conic-gradient(from 0deg, #8b5cf6, #6366f1, #06b6d4, #8b5cf6)" }} />
            <span className="relative flex items-center gap-2 rounded-full bg-[#0a0a0a] px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[#111] sm:text-base">
              Get Started
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      <div className="h-20" />
      </div>
    </>
  );
}
