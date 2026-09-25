import { Link } from "react-router-dom";
import { team } from "@/data/team";
export default function About() {
  const f = team[0];
  return (
    <section className="people-chapter section-space">
      <figure>
        <div className="founder-image">
          <img
            src={f.avatar}
            alt={f.name}
            width="600"
            height="720"
            loading="lazy"
          />
        </div>
        <figcaption>
          <strong>{f.name}</strong>
          <span>{f.role}</span>
        </figcaption>
      </figure>
      <div className="people-copy">
        <p className="eyebrow">05 / THE COMPANY BEHIND THE CODE</p>
        <h2>
          A small studio.
          <br />
          Close to the work.
        </h2>
        <p>
          Aletheia AI is an independent engineering company in Pune, founded by
          Ganesh Khetawat. We build AI systems, digital products and the
          software around them.
        </p>
        <p>
          You work with people who are close to the code and care about the
          details—from the first architecture decision to the final interaction.
        </p>
        <Link to="/about" className="text-link">
          Get to know Aletheia <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
