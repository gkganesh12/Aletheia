import MarqueeStrip from "@/components/shared/MarqueeStrip";

const KEYWORDS_ROW1 = [
  "Artificial Intelligence",
  "Product Engineering",
  "Machine Learning",
  "Cloud Infrastructure",
  "Neural Networks",
  "Full-Stack Development",
  "Deep Learning",
  "UI/UX Design",
  "Computer Vision",
  "DevOps & CI/CD",
];

const KEYWORDS_ROW2 = [
  "Natural Language Processing",
  "Data Engineering",
  "Multi-Agent Systems",
  "Cybersecurity",
  "AI Agents",
  "API Development",
  "MLOps",
  "Mobile Development",
  "Reinforcement Learning",
  "Cloud Migration",
];

export default function Marquee() {
  return (
    <section className="py-12 overflow-hidden border-y border-white/[0.06] bg-gradient-to-b from-transparent via-white/[0.01] to-transparent">
      <MarqueeStrip speed={45} direction="left" className="mb-5">
        {KEYWORDS_ROW1.map((keyword) => (
          <span
            key={keyword}
            className="mx-3 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-7 py-3 text-base font-medium text-white/35 whitespace-nowrap select-none transition-colors duration-300 hover:border-white/20 hover:text-white/60 hover:bg-white/[0.06]"
          >
            {keyword}
          </span>
        ))}
      </MarqueeStrip>
      <MarqueeStrip speed={40} direction="right">
        {KEYWORDS_ROW2.map((keyword) => (
          <span
            key={keyword}
            className="mx-3 inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-7 py-3 text-base font-medium text-white/35 whitespace-nowrap select-none transition-colors duration-300 hover:border-white/20 hover:text-white/60 hover:bg-white/[0.06]"
          >
            {keyword}
          </span>
        ))}
      </MarqueeStrip>
    </section>
  );
}
