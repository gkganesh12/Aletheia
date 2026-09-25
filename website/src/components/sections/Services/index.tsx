import { Link } from "react-router-dom";
const items = [
  [
    "ai-products",
    "AI product engineering",
    "Agents, RAG, computer vision and LLM applications.",
    "01",
  ],
  [
    "full-stack",
    "Websites & full-stack platforms",
    "Considered interfaces. Reliable APIs. Software that fits.",
    "02",
  ],
  [
    "mvp-development",
    "MVPs & rapid prototypes",
    "Find the smallest useful version. Get it into people’s hands.",
    "03",
  ],
  [
    "data-ml",
    "Data engineering & ML",
    "Pipelines, models and the infrastructure that connects them.",
    "04",
  ],
  [
    "cybersecurity",
    "Cybersecurity & auditing",
    "Understand the risks. Build stronger foundations.",
    "05",
  ],
  [
    "blockchain",
    "Blockchain & Web3",
    "Smart contracts and the applications around them.",
    "06",
  ],
];
export default function Services() {
  return (
    <section className="services-chapter section-space">
      <div className="chapter-heading">
        <p className="eyebrow">04 / CAPABILITIES</p>
        <h2>
          One team.
          <br />
          The whole build.
        </h2>
        <p>
          We work across the stack because
          <br />
          the most useful products do, too.
        </p>
      </div>
      <div className="service-list">
        {items.map(([slug, name, body, n]) => (
          <Link key={slug} to={`/services/${slug}`} className="service-row">
            <span className="eyebrow">{n}</span>
            <div>
              <h3>{name}</h3>
              <p>{body}</p>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
