import { Link } from "react-router-dom";
import BrandLogo from "@/components/ui/BrandLogo";
import { brand } from "@/data/brand";
import { services } from "@/data/services";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link to="/" aria-label="Aletheia AI home">
            <BrandLogo />
          </Link>
          <p>
            Design, code, and considered decisions.
            <br />
            From India. Built for everywhere.
          </p>
          <a className="footer-email" href={`mailto:${brand.email}`}>
            {brand.email} ↗
          </a>
        </div>
        <div>
          <h3>Explore</h3>
          {[
            ["Work", "/case-studies"],
            ["Company", "/about"],
            ["Journal", "/blog"],
            ["Careers", "/careers"],
            ["Industries", "/industries"],
          ].map(([name, to]) => (
            <Link key={to} to={to}>
              {name}
            </Link>
          ))}
        </div>
        <div>
          <h3>What we do</h3>
          {services.map((s) => (
            <Link key={s.id} to={`/services/${s.id}`}>
              {s.name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Elsewhere</h3>
          {brand.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        aletheia ai<span>↗</span>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Aletheia AI</span>
        <span>Built by Aletheia AI.</span>
        <Link to="/contact">Start a conversation ↗</Link>
      </div>
    </footer>
  );
}
