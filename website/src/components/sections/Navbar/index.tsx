import { useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import BrandLogo from "@/components/ui/BrandLogo";
const links = [
  { label: "Work", to: "/case-studies" },
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "Company", to: "/about" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header className="site-header">
      <Link
        to="/"
        className="home-link"
        onClick={() => setOpen(false)}
        aria-label="Aletheia AI home"
      >
        <BrandLogo />
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <Link to="/contact" className="brand-button header-cta">
        Let’s talk <span aria-hidden="true">↗</span>
      </Link>
      <button
        className="menu-toggle"
        ref={toggle}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      {open && (
        <nav
          id="mobile-navigation"
          data-lenis-prevent
          className="mobile-nav"
          aria-label="Mobile navigation"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              toggle.current?.focus();
            }
          }}
        >
          {[...links, { label: "Let’s talk", to: "/contact" }].map((l, i) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              {l.label}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
