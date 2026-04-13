import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Button } from "@/components/ui";

const trustBadges = [
  { label: "Free Consultation", color: "#8b5cf6" },
  { label: "No Commitment", color: "#6366f1" },
  { label: "24h Response", color: "#06b6d4" },
];

interface CTASectionProps {
  heading?: string;
  description?: string;
  className?: string;
}

export default function CTASection({
  heading = "Ready to Build Something Great?",
  description = "Get in touch and a member of our team will respond within 24 hours.",
  className = "",
}: CTASectionProps) {
  return (
    <section
      className={`relative overflow-hidden py-24 sm:py-32 ${className}`}
    >
      {/* Multi-color gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/3 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 70%)" }}
        />
        <div
          className="absolute right-1/3 top-1/2 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(ellipse, #6366f1, transparent 70%)" }}
        />
      </div>

      <Container size="narrow" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          {/* Heading — gradient */}
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
            style={{
              backgroundImage: "linear-gradient(135deg, #ffffff 30%, #8b5cf6 60%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {heading}
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50 sm:text-lg">
            {description}
          </p>

          {/* Trust badges — colored dots */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6"
          >
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm text-white/45"
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: badge.color }}
                  aria-hidden="true"
                />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild variant="primary" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/services">Explore Services</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
