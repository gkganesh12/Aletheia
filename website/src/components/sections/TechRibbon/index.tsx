"use client";

import MarqueeStrip from "@/components/shared/MarqueeStrip";

/* ────────────────────────────────────────────────────────────────────── */
/*  Tech stacks with Simple Icons CDN logos                              */
/* ────────────────────────────────────────────────────────────────────── */

interface TechItem {
  name: string;
  /** Simple Icons slug — see https://simpleicons.org */
  slug: string;
  /** Hex color (no #) or "white" — visible on dark backgrounds */
  color: string;
}

const ROW_1: TechItem[] = [
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Python", slug: "python", color: "3776AB" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "AWS", slug: "amazonaws", color: "FF9900" },
  { name: "TensorFlow", slug: "tensorflow", color: "FF6F00" },
  { name: "PyTorch", slug: "pytorch", color: "EE4C2C" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Kubernetes", slug: "kubernetes", color: "326CE5" },
  { name: "Go", slug: "go", color: "00ADD8" },
  { name: "Rust", slug: "rust", color: "DEA584" },
];

const ROW_2: TechItem[] = [
  { name: "Next.js", slug: "nextdotjs", color: "white" },
  { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
  { name: "Redis", slug: "redis", color: "FF4438" },
  { name: "Kafka", slug: "apachekafka", color: "white" },
  { name: "GraphQL", slug: "graphql", color: "E10098" },
  { name: "Terraform", slug: "terraform", color: "844FBA" },
  { name: "LangChain", slug: "langchain", color: "white" },
  { name: "OpenAI", slug: "openai", color: "white" },
  { name: "Hugging Face", slug: "huggingface", color: "FFD21E" },
  { name: "CUDA", slug: "nvidia", color: "76B900" },
];

/* ────────────────────────────────────────────────────────────────────── */
/*  Pill with logo                                                       */
/* ────────────────────────────────────────────────────────────────────── */

function TechPill({ tech }: { tech: TechItem }) {
  const logoUrl = `https://cdn.simpleicons.org/${tech.slug}/${tech.color}`;

  return (
    <span className="mx-3 inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-7 py-3.5 text-base font-medium text-white/50 transition-all duration-300 hover:border-white/30 hover:text-white hover:bg-white/[0.07] select-none cursor-default">
      <img
        src={logoUrl}
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

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export default function TechRibbon() {
  return (
    <section className="py-14 overflow-hidden border-y border-white/[0.04]">
      {/* Row 1 — scrolls left */}
      <MarqueeStrip speed={40} direction="left" className="mb-5">
        {ROW_1.map((tech) => (
          <TechPill key={tech.name} tech={tech} />
        ))}
      </MarqueeStrip>

      {/* Row 2 — scrolls right */}
      <MarqueeStrip speed={35} direction="right">
        {ROW_2.map((tech) => (
          <TechPill key={tech.name} tech={tech} />
        ))}
      </MarqueeStrip>
    </section>
  );
}
