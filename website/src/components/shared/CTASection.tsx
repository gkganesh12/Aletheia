import { Link } from "react-router-dom";
import { brand } from "@/data/brand";
export default function CTASection({
  heading = "What are you working on?",
  description = "An idea, a difficult problem, or a product ready for its next chapter. We’d like to hear about it.",
  className = "",
}: {
  heading?: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={`contact-chapter ${className}`}>
      <div>
        <p className="eyebrow">LET’S MAKE IT WORK.</p>
        <h2>{heading}</h2>
        <p>{description}</p>
        <a href={`mailto:${brand.email}`} className="contact-email">
          {brand.email} ↗
        </a>
      </div>
      <Link to="/contact" className="contact-disc">
        <span>
          Start a<br />
          conversation
        </span>
        <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
