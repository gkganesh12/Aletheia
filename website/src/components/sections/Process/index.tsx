const steps = [
  [
    "Find the real problem.",
    "Discovery & direction",
    "A clear brief, shared priorities and an honest view of what matters.",
  ],
  [
    "Make it tangible.",
    "Strategy & prototype",
    "A working direction you can see, use and challenge before we build.",
  ],
  [
    "Build with purpose.",
    "Design & engineering",
    "Iterative releases, thoughtful interfaces and reliable foundations.",
  ],
  [
    "Put it to work.",
    "Launch & evolve",
    "A production launch, a clear handover and a plan for what comes next.",
  ],
];
export default function Process() {
  return (
    <section className="process-chapter section-space">
      <div className="chapter-heading">
        <p className="eyebrow">03 / HOW WE WORK</p>
        <h2>
          LESS MYSTERY.
          <br />
          MORE MOMENTUM.
        </h2>
      </div>
      <div className="process-grid">
        {steps.map(([title, label, body], i) => (
          <article key={title}>
            <span className="step-number">0{i + 1}</span>
            <p className="eyebrow">{label}</p>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
