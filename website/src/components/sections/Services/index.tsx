import { Link } from "react-router-dom";
import { services } from "@/data/services";
export default function Services() {
  return (
    <section className="services-chapter section-space">
      <div className="chapter-heading">
        <p className="eyebrow">02 / WHAT WE DO</p>
        <h2>
          ONE PARTNER.
          <br />
          <span>MORE POSSIBILITIES.</span>
        </h2>
        <p>
          From a better website to your next AI product.
          <br />
          The expertise to connect every part.
        </p>
      </div>
      <div className="service-list">
        {services.map((s, i) => (
          <Link to={`/services/${s.id}`} key={s.id} className="service-row">
            <span className="eyebrow">0{i + 1}</span>
            <h3>{s.name}</h3>
            <p>
              {s.id === "full-stack"
                ? "Distinctive websites, full-stack platforms and APIs. Built to work beautifully, at every scale."
                : s.description}
            </p>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
