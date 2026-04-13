import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Container,
  SectionHeading,
  Card,
  Button,
} from "@/components/ui";
import { careers } from "@/data/careers";
import PageHero from "@/components/shared/PageHero";
import PageTransition from "@/components/shared/PageTransition";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTASection from "@/components/shared/CTASection";
import FilterButtons from "@/components/shared/FilterButtons";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { useToast } from "@/components/shared/Toast";

/* ────────────────────────────────────────────────────────────────────── */
/*  Web3Forms key                                                        */
/* ────────────────────────────────────────────────────────────────────── */

const WEB3FORMS_KEY = "b1d6246c-dfe6-41f6-8c93-7374d0c9919c";

/* ────────────────────────────────────────────────────────────────────── */
/*  Application form schema                                              */
/* ────────────────────────────────────────────────────────────────────── */

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  portfolio: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)"),
});

type ApplicationData = z.infer<typeof applicationSchema>;

/* ────────────────────────────────────────────────────────────────────── */
/*  Input classes                                                        */
/* ────────────────────────────────────────────────────────────────────── */

const inputBase = cn(
  "w-full rounded-lg border bg-white/[0.04] px-4 py-3",
  "text-white placeholder:text-white/30",
  "focus:outline-none transition-colors duration-200",
);
const inputClasses = cn(inputBase, "border-white/[0.08] focus:border-[--color-accent-400]");
const inputErrorClasses = cn(inputBase, "border-red-400/60 focus:border-red-400");

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-1.5 text-sm text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Application Modal                                                    */
/* ────────────────────────────────────────────────────────────────────── */

function ApplicationModal({
  jobTitle,
  onClose,
}: {
  jobTitle: string;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { name: "", email: "", phone: "", portfolio: "", message: "" },
  });

  const onSubmit = async (data: ApplicationData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Job Application: ${jobTitle} — ${data.name}`,
          from_name: data.name,
          name: data.name,
          email: data.email,
          phone: data.phone || "Not provided",
          portfolio: data.portfolio || "Not provided",
          position: jobTitle,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast({
          type: "success",
          message: "Application sent! We'll review it and get back to you.",
        });
        onClose();
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch {
      showToast({
        type: "error",
        message: "Something went wrong. Please try again or email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.1] bg-[var(--color-primary-900)]"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mono text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent-400)]">
                Apply for
              </p>
              <h3 className="mt-1 text-xl font-bold text-white">{jobTitle}</h3>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
            <input type="hidden" name="botcheck" style={{ display: "none" }} />

            <div>
              <label htmlFor="app-name" className="block text-sm text-white/60 mb-1.5">Full Name</label>
              <input
                id="app-name"
                type="text"
                placeholder="Your name"
                className={errors.name ? inputErrorClasses : inputClasses}
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label htmlFor="app-email" className="block text-sm text-white/60 mb-1.5">Email</label>
              <input
                id="app-email"
                type="email"
                placeholder="you@example.com"
                className={errors.email ? inputErrorClasses : inputClasses}
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="app-phone" className="block text-sm text-white/60 mb-1.5">Phone</label>
                <input
                  id="app-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={inputClasses}
                  {...register("phone")}
                />
              </div>
              <div>
                <label htmlFor="app-portfolio" className="block text-sm text-white/60 mb-1.5">Portfolio / GitHub</label>
                <input
                  id="app-portfolio"
                  type="url"
                  placeholder="https://github.com/you"
                  className={inputClasses}
                  {...register("portfolio")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="app-message" className="block text-sm text-white/60 mb-1.5">Why this role?</label>
              <textarea
                id="app-message"
                rows={4}
                placeholder="Tell us about yourself, your experience, and why you're interested..."
                className={cn(errors.message ? inputErrorClasses : inputClasses, "resize-none")}
                {...register("message")}
              />
              <FieldError message={errors.message?.message} />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Culture icons                                                        */
/* ────────────────────────────────────────────────────────────────────── */

function RocketIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Benefit icons                                                        */
/* ────────────────────────────────────────────────────────────────────── */

function ClockIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function AcademicCapIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>;
}
function SunIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
}
function TrendingUpIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Static data                                                          */
/* ────────────────────────────────────────────────────────────────────── */

const cultureCards = [
  {
    icon: RocketIcon,
    title: "Ship Real Products",
    description: "Every line of code you write ships to production. No prototypes gathering dust — real products used by real people.",
  },
  {
    icon: BookOpenIcon,
    title: "Learn & Grow",
    description: "Work across AI, cybersecurity, blockchain and full-stack. You'll touch more tech stacks in a month than most engineers do in a year.",
  },
  {
    icon: GlobeIcon,
    title: "Fully Remote",
    description: "Work from anywhere. We care about output, not office hours. Async-first, outcome-driven.",
  },
  {
    icon: UsersIcon,
    title: "Small Team, Big Impact",
    description: "No layers of management. You'll have direct ownership and impact from day one. Your work matters here.",
  },
];

const benefits = [
  { icon: ClockIcon, label: "Flexible Hours" },
  { icon: AcademicCapIcon, label: "Learning Budget" },
  { icon: SunIcon, label: "Remote-First" },
  { icon: TrendingUpIcon, label: "Equity Options" },
];

const departmentColors: Record<string, string> = {
  Engineering: "border-blue-400/30 text-blue-400 bg-blue-400/10",
  Security: "border-red-400/30 text-red-400 bg-red-400/10",
};

/* ────────────────────────────────────────────────────────────────────── */
/*  Small icons                                                          */
/* ────────────────────────────────────────────────────────────────────── */

function MapPinSmallIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>;
}
function BriefcaseIcon() {
  return <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>;
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Page                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export default function CareersPage() {
  const departments = useMemo(
    () => [...new Set(careers.map((c) => c.department))],
    [],
  );

  const [activeDepartment, setActiveDepartment] = useState("All");
  const [applyingFor, setApplyingFor] = useState<string | null>(null);

  const filteredCareers = useMemo(
    () =>
      activeDepartment === "All"
        ? careers
        : careers.filter((c) => c.department === activeDepartment),
    [activeDepartment],
  );

  return (
    <PageTransition>
      {/* Hero */}
      <PageHero
        overline="Careers"
        title="Build What Matters"
        description="Join a lean engineering studio that ships real products. We're hiring across AI, full-stack, cybersecurity and blockchain."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
      />

      {/* Culture Section */}
      <section className="py-24 lg:py-32">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Why Join Us"
              heading="What It's Like Here"
              description="Small team, real ownership, production code from day one."
            />
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {cultureCards.map((card) => (
              <motion.div key={card.title} variants={staggerItem}>
                <Card hover className="h-full p-6">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-400)]/10 text-[var(--color-accent-400)]">
                    <card.icon />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{card.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <Container>
          <AnimatedSection>
            <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit.label}
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2.5"
                >
                  <span className="text-[var(--color-accent-400)]"><benefit.icon /></span>
                  <span className="text-sm font-medium text-white/60">{benefit.label}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* Open Positions */}
      <section className="py-24 lg:py-32">
        <Container>
          <AnimatedSection>
            <SectionHeading
              overline="Open Positions"
              heading="Find Your Role"
              description="We're hiring. Find a role that matches your skills."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <FilterButtons
              categories={departments}
              active={activeDepartment}
              onChange={setActiveDepartment}
              className="mb-10 justify-center"
            />
          </AnimatedSection>

          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            key={activeDepartment}
          >
            {filteredCareers.map((job) => (
              <motion.div key={job.id} variants={staggerItem}>
                <Card hover className="flex h-full flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-0.5 text-xs font-medium",
                        departmentColors[job.department] ?? "border-white/20 text-white/60 bg-white/5",
                      )}
                    >
                      {job.department}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/40">
                    <span className="inline-flex items-center gap-1">
                      <MapPinSmallIcon />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BriefcaseIcon />
                      {job.type}
                    </span>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white/50">{job.description}</p>

                  <div className="mt-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setApplyingFor(job.title)}
                    >
                      Apply &rarr;
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredCareers.length === 0 && (
            <AnimatedSection>
              <div className="py-16 text-center">
                <p className="text-lg text-white/40">No open positions in this department right now.</p>
              </div>
            </AnimatedSection>
          )}
        </Container>
      </section>

      {/* CTA */}
      <CTASection
        heading="Don't See Your Role?"
        description="We're always looking for exceptional talent. Send us your resume and we'll be in touch."
      />

      {/* Application Modal */}
      <AnimatePresence>
        {applyingFor && (
          <ApplicationModal
            jobTitle={applyingFor}
            onClose={() => setApplyingFor(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
