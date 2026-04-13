import MarqueeStrip from "@/components/shared/MarqueeStrip";

/* ── Colors cycle through the violet → indigo → cyan spectrum ──────── */
const spectrum = ["#8b5cf6", "#a78bfa", "#7c3aed", "#6366f1", "#818cf8", "#06b6d4", "#22d3ee", "#6366f1", "#8b5cf6", "#7c3aed"];

const KEYWORDS_ROW1 = [
  "Artificial Intelligence",
  "Full-Stack Development",
  "Machine Learning",
  "Cybersecurity",
  "Multi-Agent Systems",
  "Blockchain & Web3",
  "RAG Pipelines",
  "MVP Development",
  "Python & TypeScript",
  "DevOps & CI/CD",
];

const KEYWORDS_ROW2 = [
  "React & Next.js",
  "Data Engineering",
  "Smart Contracts",
  "Web Scraping",
  "AI Agents",
  "API Development",
  "Alert Management",
  "Cloud Infrastructure",
  "Knowledge Graphs",
  "Product Engineering",
];

export default function Marquee() {
  return (
    <section className="py-12 overflow-hidden">
      <MarqueeStrip speed={45} direction="left" className="mb-5">
        {KEYWORDS_ROW1.map((text, i) => {
          const color = spectrum[i % spectrum.length];
          return (
            <span
              key={text}
              className="mx-2 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap select-none transition-all duration-300 hover:scale-105 sm:mx-3 sm:px-7 sm:py-3 sm:text-base"
              style={{
                borderColor: `${color}20`,
                backgroundColor: `${color}08`,
                color: `${color}bb`,
              }}
            >
              <span
                className="mr-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {text}
            </span>
          );
        })}
      </MarqueeStrip>
      <MarqueeStrip speed={40} direction="right">
        {KEYWORDS_ROW2.map((text, i) => {
          const color = spectrum[(i + 3) % spectrum.length];
          return (
            <span
              key={text}
              className="mx-2 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap select-none transition-all duration-300 hover:scale-105 sm:mx-3 sm:px-7 sm:py-3 sm:text-base"
              style={{
                borderColor: `${color}20`,
                backgroundColor: `${color}08`,
                color: `${color}bb`,
              }}
            >
              <span
                className="mr-2 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              {text}
            </span>
          );
        })}
      </MarqueeStrip>
    </section>
  );
}
