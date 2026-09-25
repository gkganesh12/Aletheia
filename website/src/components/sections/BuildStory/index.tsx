const steps = [
  {
    title: "First, we listen.",
    body: "Tell us what’s getting in the way, who you’re building for, and what better could look like. We turn that conversation into a clear direction.",
    detail: "Discovery / product strategy / architecture",
    image: "planning",
    alt: "A person planning in a notebook at a wooden table",
    credit: "Adolfo Félix",
    source: "uo7AHIpjOu0",
  },
  {
    title: "Then, we make it tangible.",
    body: "An interface you can explore. A model you can evaluate. Working software you can put in front of real people. We build, share and refine together.",
    detail: "Design / development / AI integration",
    image: "studio",
    alt: "People working at computers in a sunlit workspace",
    credit: "Compagnons",
    source: "AQTA5E6mCNU",
  },
  {
    title: "Ready for the everyday.",
    body: "The small details matter when people depend on your product. We test, deploy and document the system, so your team can confidently take it forward.",
    detail: "Testing / deployment / handover",
    image: "planning",
    alt: "Notes and careful planning in a notebook",
    credit: "Adolfo Félix",
    source: "uo7AHIpjOu0",
  },
];

export default function BuildStory() {
  return (
    <section className="photo-process" aria-labelledby="process-title">
      <div className="process-heading">
        <p className="eyebrow">02 / THE WAY WE WORK</p>
        <h2 id="process-title">
          Great work starts
          <br />
          with a <em>conversation.</em>
        </h2>
      </div>
      <div className="process-layout">
        <div
          className="process-gallery"
          data-process-stage="0"
          aria-hidden="true"
        >
          {steps.map((s, i) => (
            <div className={`process-frame process-frame-${i}`} key={s.title}>
              <img
                src={`/images/editorial/${s.image}.webp`}
                srcSet={`/images/editorial/${s.image}-small.webp ${s.image === "studio" ? 1000 : 800}w, /images/editorial/${s.image}.webp ${s.image === "studio" ? 2200 : 1600}w`}
                sizes="(max-width: 599px) 88vw, 45vw"
                alt=""
                loading="lazy"
                width="1600"
                height="1067"
              />
              <span>
                0{i + 1} / {s.detail.split(" / ")[0]}
              </span>
            </div>
          ))}
          <div className="process-progress">
            <i />
          </div>
          <span className="process-gallery-note">
            Process imagery / stock photography
          </span>
        </div>
        <div className="process-steps">
          {steps.map((s, i) => (
            <article className="process-step" key={s.title}>
              <p className="eyebrow">0{i + 1} / 03</p>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="process-detail">{s.detail}</span>
              <figure className="process-mobile-image">
                <img
                  src={`/images/editorial/${s.image}.webp`}
                  srcSet={`/images/editorial/${s.image}-small.webp ${s.image === "studio" ? 1000 : 800}w, /images/editorial/${s.image}.webp ${s.image === "studio" ? 2200 : 1600}w`}
                  sizes="(max-width: 599px) 88vw, 45vw"
                  alt={s.alt}
                  loading="lazy"
                  width="1600"
                  height="1067"
                />
                <figcaption>
                  <a
                    href={`https://unsplash.com/photos/${s.source}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Stock photography / {s.credit}
                  </a>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
