"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui";
import { Button } from "@/components/ui";
import { navLinks, mobileNavLinks } from "@/data/navigation";
import { useScrollDirection } from "@/hooks/useScrollDirection";

/* ── Animation variants ─────────────────────────────────────────────── */

const menuOverlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menuPanelVariants: any = {
  closed: { x: "100%" },
  open: { x: "0%", transition: { type: "spring", damping: 30, stiffness: 300 } },
  exit: { x: "100%", transition: { type: "spring", damping: 30, stiffness: 300 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menuLinkVariants: any = {
  closed: { opacity: 0, x: 20 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i + 0.15, duration: 0.3, ease: "easeOut" },
  }),
};

/* ── Hamburger Icon ─────────────────────────────────────────────────── */

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="relative flex h-5 w-6 flex-col items-center justify-center">
      <span className={cn("absolute h-[1.5px] w-full rounded-full bg-white transition-all duration-300", isOpen ? "rotate-45" : "-translate-y-[6px]")} />
      <span className={cn("absolute h-[1.5px] w-full rounded-full bg-white transition-all duration-300", isOpen ? "opacity-0 scale-x-0" : "opacity-100")} />
      <span className={cn("absolute h-[1.5px] w-full rounded-full bg-white transition-all duration-300", isOpen ? "-rotate-45" : "translate-y-[6px]")} />
    </div>
  );
}

/* ── Dropdown Menu ──────────────────────────────────────────────────── */

function NavDropdown({ link }: { link: (typeof navLinks)[number] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className="flex items-center gap-1 rounded-lg px-4 py-2 text-[15px] font-medium text-white/60 transition-colors duration-200 hover:bg-white/[0.05] hover:text-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        {link.label}
        <svg
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {open && link.children && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-xl border border-white/[0.08] bg-[var(--color-primary-900)]/95 p-2 backdrop-blur-2xl"
          >
            {link.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
              >
                <span className="text-sm font-medium text-white/80">{child.label}</span>
                {child.description && (
                  <span className="text-xs text-white/35">{child.description}</span>
                )}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────────── */

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection({ threshold: 10, debounce: 50 });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navbar always visible — never hides
  void scrollDirection;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 z-40 w-full transition-colors duration-300",
          isScrolled
            ? "backdrop-blur-xl bg-white/[0.03] border-b border-white/[0.08]"
            : "bg-transparent border-b border-transparent",
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="relative z-50 font-[var(--font-heading)] text-base font-bold tracking-widest text-white lg:text-lg"
            >
              ALETHEIA
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                if (link.children) {
                  return <NavDropdown key={link.id} link={link} />;
                }

                const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className={cn(
                      "relative rounded-lg px-4 py-2 text-[15px] font-medium transition-colors duration-200 hover:bg-white/[0.05] hover:text-white",
                      isActive ? "text-white" : "text-white/60",
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[var(--color-accent-400)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <Button variant="primary" size="sm" onClick={() => navigate("/contact")}>
                  Contact Us
                </Button>
              </div>

              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/[0.06] lg:hidden"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                <HamburgerIcon isOpen={mobileMenuOpen} />
              </button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              key="overlay"
              variants={menuOverlayVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              key="panel"
              variants={menuPanelVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed inset-y-0 right-0 z-40 flex w-[280px] flex-col border-l border-white/[0.08] bg-[var(--color-primary-900)]/95 px-6 pt-24 backdrop-blur-2xl lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {mobileNavLinks.map((link, i) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div key={link.id} custom={i} variants={menuLinkVariants} initial="closed" animate="open">
                      <Link
                        to={link.href}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base font-medium transition-colors hover:bg-white/[0.06] hover:text-white",
                          isActive ? "text-white bg-white/[0.04]" : "text-white/70",
                        )}
                      >
                        {isActive && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-400)]" />}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.3 } }}
                className="mt-8"
              >
                <Button variant="primary" size="lg" className="w-full" onClick={() => navigate("/contact")}>
                  Contact Us
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
