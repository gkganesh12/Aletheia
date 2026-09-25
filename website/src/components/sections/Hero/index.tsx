import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <section className="brand-hero">
      <div className="hero-topline">
        <span className="eyebrow">
          <i /> INDEPENDENT AI & DIGITAL ENGINEERING
        </span>
        <span className="hero-location">PUNE, INDIA · WORKING EVERYWHERE</span>
      </div>
      <h1>
        <span className="hero-line">INTELLIGENCE.</span>
        <span className="hero-line hero-second">
          PUT TO <em>WORK.</em>
          <span className="hero-asterisk" aria-hidden="true">
            ✳
          </span>
        </span>
      </h1>
      <div className="hero-bottom">
        <p>
          AI systems, websites and software.
          <br />
          Built around <span>your business.</span>
        </p>
        <Link to="/contact" className="brand-button">
          Let’s build something <span aria-hidden="true">↗</span>
        </Link>
        <a href="#work" className="hero-scroll">
          SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="hero-services">
        <span>AI PRODUCTS</span>
        <b>✳</b>
        <span>WEBSITES & PLATFORMS</span>
        <b>✳</b>
        <span>MVPS</span>
        <b>✳</b>
        <span>CYBERSECURITY</span>
        <b>✳</b>
        <span>WEB3</span>
        <b>✳</b>
        <span>DATA & ML</span>
      </div>
    </section>
  );
}
