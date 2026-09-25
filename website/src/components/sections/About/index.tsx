import { Link } from "react-router-dom";
import { team } from "@/data/team";
export default function About() {
  const founder = team[0];
  return (
    <section className="people-chapter section-space">
      <div className="people-copy">
        <p className="eyebrow">05 / THE HUMAN SIDE</p>
        <h2>
          HUMAN CURIOSITY.
          <br />
          <span>
            ENGINEERED
            <br />
            POSSIBILITY.
          </span>
        </h2>
        <p>
          We’re Aletheia AI. An independent engineering company built on a
          simple belief: technology should solve real problems.
        </p>
        <p>
          We bring AI, design and software together to turn your next idea into
          something people can actually use.
        </p>
        <Link to="/about" className="text-link">
          Meet Aletheia AI <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <figure>
        <div className="founder-image">
          <img
            src={founder.avatar}
            alt={founder.name}
            width="600"
            height="720"
            loading="lazy"
          />
        </div>
        <figcaption>
          <strong>{founder.name}</strong>
          <span>{founder.role}</span>
        </figcaption>
      </figure>
    </section>
  );
}
