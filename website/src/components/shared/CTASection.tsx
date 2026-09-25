import { Link } from "react-router-dom";
export default function CTASection({
  heading = "Have a big idea?",
  description = "Bring us the ambition. We’ll bring the engineering.",
  className = "",
}: {
  heading?: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={`contact-chapter ${className}`}>
      <div className="eyebrow">YOUR NEXT CHAPTER</div>
      <h2>
        {heading}
        <br />
        <span>Let’s build it.</span>
      </h2>
      <div className="contact-chapter-bottom">
        <p>{description}</p>
        <Link to="/contact" className="round-link" aria-label="Start a project">
          ↗
        </Link>
      </div>
    </section>
  );
}
