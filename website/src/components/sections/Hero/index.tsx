import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <>
      <section className="photo-hero" aria-labelledby="home-title">
        <div className="photo-hero-image" aria-hidden="true">
          <img
            src="/images/editorial/studio.webp"
            srcSet="/images/editorial/studio-small.webp 1000w, /images/editorial/studio.webp 2200w"
            sizes="100vw"
            alt=""
            width="2200"
            height="1457"
            fetchPriority="high"
          />
        </div>
        <div className="photo-hero-content">
          <div className="photo-hero-top">
            <p className="eyebrow">Independent minds. Intelligent systems.</p>
            <span className="eyebrow">Pune, India / Working everywhere</span>
          </div>
          <h1 id="home-title">
            Good ideas.
            <br />
            Built for <em>real life.</em>
          </h1>
          <div className="photo-hero-bottom">
            <p>
              We turn AI, thoughtful design and good engineering into websites,
              products and systems people love to use.
            </p>
            <Link to="/contact" className="brand-button photo-hero-button">
              Let’s build something <span aria-hidden="true">↗</span>
            </Link>
            <a className="photo-scroll" href="#work">
              <span>Discover the work</span>
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <a
          className="photo-credit"
          href="https://unsplash.com/photos/AQTA5E6mCNU"
          target="_blank"
          rel="noreferrer"
        >
          Stock photography / Compagnons
        </a>
      </section>
      <section className="studio-intro" aria-label="Our approach">
        <p className="eyebrow">
          <span aria-hidden="true">↳</span> Aletheia AI
          <br />
          Engineering with intention.
        </p>
        <div>
          <p className="studio-statement">
            Technology should make life <em>simpler.</em> Work better. And open
            up something new.
          </p>
          <div className="studio-intro-bottom">
            <p>
              From the first sketch to the last line of code, we bring your idea
              into the world. AI systems, digital experiences, and everything
              that makes them work.
            </p>
            <Link to="/about" className="text-link">
              Meet Aletheia <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
