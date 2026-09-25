import { useState } from "react";
import { Link } from "react-router-dom";
import SignalField from "@/components/shared/SignalField";
export default function Hero() {
  const [view, setView] = useState<"graph" | "code">("graph");
  return (
    <section className="brand-hero">
      <div className="hero-topline">
        <p className="eyebrow">
          <i /> ALETHEIA AI / INDEPENDENT ENGINEERING
        </p>
        <span className="hero-location">PUNE, IN · BUILDING EVERYWHERE</span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1>
            We build the AI.
            <br />
            <span>
              And everything
              <br />
              around it.
            </span>
          </h1>
          <p>
            Useful AI needs more than a model.
            <br />
            We design the product, write the software,
            <br className="desktop-only" /> and connect it to your world.
          </p>
          <div className="hero-actions">
            <Link to="/contact" className="brand-button">
              Tell us what you’re building <span aria-hidden="true">↗</span>
            </Link>
            <a href="#work" className="plain-link">
              Explore our work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <div className="engineering-window">
          <div className="window-top">
            <span>
              <i /> INSIDE THE WORK
            </span>
            <div
              className="view-switch"
              role="group"
              aria-label="Engineering illustration view"
            >
              <button
                aria-pressed={view === "graph"}
                onClick={() => setView("graph")}
              >
                Signal
              </button>
              <button
                aria-pressed={view === "code"}
                onClick={() => setView("code")}
              >
                Code
              </button>
            </div>
          </div>
          <div
            className={`engineering-viewport ${view === "code" ? "is-code" : ""}`}
          >
            <div hidden={view !== "graph"} className="signal-view">
              <SignalField />
              <div className="graph-note">
                <span className="tiny-cross">+</span>
                <p>
                  Many moving parts.
                  <br />
                  <strong>One considered system.</strong>
                </p>
              </div>
            </div>
            {view === "code" && (
              <div className="code-example">
                <div className="code-file">
                  example.py <span>Inscrape / Python SDK</span>
                </div>
                <pre>
                  <code>
                    <span className="code-purple">from</span> inscrape{" "}
                    <span className="code-purple">import</span> Inscrape{"\n\n"}
                    <span className="code-comment">
                      # A real SDK. A small surface area.
                    </span>
                    {"\n"}client = Inscrape(
                    <span className="code-string">"YOUR_API_TOKEN"</span>)
                    {"\n\n"}result = client.scrape({"\n"}{" "}
                    <span className="code-string">"https://example.com"</span>
                    {"\n"}){"\n\n"}
                    <span className="code-purple">print</span>(result.content)
                  </code>
                </pre>
                <a
                  href="https://github.com/gkganesh12/Inscrape"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the SDK source ↗
                </a>
              </div>
            )}
          </div>
          <div className="window-bottom">
            <span>
              {view === "graph"
                ? "01 / FROM SIGNAL TO SYSTEM"
                : "INSCRAPE / USAGE EXAMPLE"}
            </span>
            <span>
              {view === "graph"
                ? ""
                : "From the public SDK"}
            </span>
          </div>
        </div>
      </div>
      <div className="hero-services">
        <span>AI systems</span>
        <span>Websites & platforms</span>
        <span>MVPs</span>
        <span>Cybersecurity</span>
        <span>Web3</span>
        <span>Data & ML</span>
        <a href="#work" aria-label="Scroll to featured projects">
          ↓
        </a>
      </div>
    </section>
  );
}
