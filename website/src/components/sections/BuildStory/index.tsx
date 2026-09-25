import EngineeringGraph from "@/components/shared/EngineeringGraph";
const steps = [
  {
    title: "Start with the problem.",
    body: "What should change for your users? We work backwards from that, then map the data, constraints and decisions the system needs to handle.",
    file: "01 / context.md",
    detail: "A clear brief. An architecture with trade-offs.",
  },
  {
    title: "Build the connections.",
    body: "Models, data pipelines, APIs and interfaces are parts of one product. We make them work together, so intelligence reaches the people who need it.",
    file: "02 / system.ts",
    detail: "Working software you can try, question and improve.",
  },
  {
    title: "Make it work outside the demo.",
    body: "We test the difficult paths, make the system observable and prepare it for deployment. You get the code, the context and a clear handover.",
    file: "03 / release.md",
    detail: "A product your team can operate and build on.",
  },
];
export default function BuildStory() {
  return (
    <section className="build-story" aria-labelledby="build-story-title">
      <div className="story-intro">
        <p className="eyebrow">02 / FROM QUESTION TO WORKING SOFTWARE</p>
        <h2 id="build-story-title">
          The interesting part
          <br />
          is how it comes together.
        </h2>
      </div>
      <div className="story-layout">
        <div className="story-board" data-story-stage="0" aria-hidden="true">
          <div className="story-board-top">
            <span>aletheia / build process</span>
            <span>01 → 03</span>
          </div>
          <div className="story-visual">
            <EngineeringGraph />
            <div className="story-input">
              your problem<span>data · users · constraints</span>
            </div>
            <div className="story-core">
              a connected system<span>models · APIs · interface</span>
            </div>
            <div className="story-output">
              ready for the real world<span>evaluate · deploy · operate</span>
            </div>
            <svg className="story-wires" viewBox="0 0 500 500">
              <path
                className="story-wire"
                d="M250 90V200M250 270V380"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
            </svg>
          </div>
          <div className="story-board-bottom">
            <span>SCROLL TO FOLLOW THE BUILD</span>
            <div>
              <i />
            </div>
          </div>
        </div>
        <div className="story-steps">
          {steps.map((s, i) => (
            <article key={s.file} className="story-step" data-story-step={i}>
              <span className="eyebrow">{s.file}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className="step-deliverable">
                <span aria-hidden="true">↳</span>
                {s.detail}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
