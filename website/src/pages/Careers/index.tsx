import { useSearchParams } from "react-router-dom";
import {
  referralFromLink,
  careerApplicationPayload,
} from "@/lib/careerApplication.mjs";
import { submitContact } from "@/lib/submitContact.mjs";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, Card, Button } from "@/components/ui";
import { careers } from "@/data/careers";
import PageHero from "@/components/shared/PageHero";
import PageTransition from "@/components/shared/PageTransition";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTASection from "@/components/shared/CTASection";
import FilterButtons from "@/components/shared/FilterButtons";
import PageSEO from "@/components/shared/PageSEO";
import { breadcrumbJsonLd } from "@/lib/seo";
import { staggerContainer, staggerItem } from "@/lib/motion-variants";
import { useToast } from "@/components/shared/Toast";

/* ────────────────────────────────────────────────────────────────────── */
/*  Application form schema                                              */
/* ────────────────────────────────────────────────────────────────────── */

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  portfolio: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (at least 10 characters)"),
  referralCode: z
    .string()
    .trim()
    .max(40, "Use 40 characters or fewer")
    .regex(/^[a-zA-Z0-9_-]*$/, "Use letters, numbers, hyphens or underscores")
    .optional(),
});

type ApplicationData = z.infer<typeof applicationSchema>;

/* ────────────────────────────────────────────────────────────────────── */
/*  Input classes                                                        */
/* ────────────────────────────────────────────────────────────────────── */

const inputBase = cn(
  "w-full rounded-lg border bg-surface px-4 py-3",
  "text-ink placeholder:text-muted",
  "focus:outline-none transition-colors duration-200",
);
const inputClasses = cn(
  inputBase,
  "border-ink/[0.08] focus:border-[--color-accent-400]",
);
const inputErrorClasses = cn(
  inputBase,
  "border-red-400/60 focus:border-red-400",
);

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
  referralCode,
  onClose,
}: {
  jobTitle: string;
  referralCode: string;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.querySelector<HTMLInputElement>("#app-name")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab" || !dialog) return;
      const fields = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([type="hidden"]):not([disabled]), textarea:not([disabled]), a[href]',
        ),
      );
      const first = fields[0],
        last = fields[fields.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      portfolio: "",
      referralCode,
      message: "",
    },
  });

  const onSubmit = async (data: ApplicationData) => {
    setIsSubmitting(true);
    try {
      await submitContact(careerApplicationPayload(jobTitle, data));
      showToast({
        type: "success",
        message: "Application sent! We'll review it and get back to you.",
      });
      onClose();
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
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        ref={dialogRef}
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-title"
        className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-2xl border border-ink/[0.1] bg-[var(--color-primary-900)]"
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
              <h3
                id="application-title"
                className="mt-1 text-xl font-bold text-ink"
              >
                {jobTitle}
              </h3>
            </div>
            <button
              aria-label="Close application"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-primary-900 hover:text-ink"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 space-y-4"
          >
            <input type="hidden" name="botcheck" style={{ display: "none" }} />

            <div>
              <label
                htmlFor="app-name"
                className="block text-sm text-muted mb-1.5"
              >
                Full Name
              </label>
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
              <label
                htmlFor="app-email"
                className="block text-sm text-muted mb-1.5"
              >
                Email
              </label>
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
                <label
                  htmlFor="app-phone"
                  className="block text-sm text-muted mb-1.5"
                >
                  Phone
                </label>
                <input
                  id="app-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className={inputClasses}
                  {...register("phone")}
                />
              </div>
              <div>
                <label
                  htmlFor="app-portfolio"
                  className="block text-sm text-muted mb-1.5"
                >
                  CV / Portfolio / GitHub
                </label>
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
              <label
                htmlFor="app-referral"
                className="block text-sm text-muted mb-1.5"
              >
                Referral code <span className="text-xs">(optional)</span>
              </label>
              <input
                id="app-referral"
                type="text"
                placeholder="e.g. TEAM-01"
                maxLength={40}
                autoCapitalize="characters"
                spellCheck={false}
                aria-describedby="referral-help"
                className={
                  errors.referralCode ? inputErrorClasses : inputClasses
                }
                {...register("referralCode")}
              />
              <p id="referral-help" className="mt-1.5 text-xs text-muted">
                Have a code from someone who shared this role? Add it here. You
                can also apply without one.
              </p>
              <FieldError message={errors.referralCode?.message} />
            </div>

            <div>
              <label
                htmlFor="app-message"
                className="block text-sm text-muted mb-1.5"
              >
                Why this role?
              </label>
              <textarea
                id="app-message"
                rows={4}
                placeholder="Tell us about yourself, your experience, and why you're interested..."
                className={cn(
                  errors.message ? inputErrorClasses : inputClasses,
                  "resize-none",
                )}
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
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Benefit icons                                                        */
/* ────────────────────────────────────────────────────────────────────── */

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function AcademicCapIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}
function TrendingUpIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Static data                                                          */
/* ────────────────────────────────────────────────────────────────────── */

const cultureCards = [
  {
    icon: RocketIcon,
    title: "Ship Real Products",
    description:
      "Every line of code you write ships to production. No prototypes gathering dust — real products used by real people.",
  },
  {
    icon: BookOpenIcon,
    title: "Learn & Grow",
    description:
      "Work across AI, cybersecurity, blockchain and full-stack. You'll touch more tech stacks in a month than most engineers do in a year.",
  },
  {
    icon: GlobeIcon,
    title: "Fully Remote",
    description:
      "Work from anywhere. We care about output, not office hours. Async-first, outcome-driven.",
  },
  {
    icon: UsersIcon,
    title: "Small Team, Big Impact",
    description:
      "No layers of management. You'll have direct ownership and impact from day one. Your work matters here.",
  },
];

const benefits = [
  { icon: ClockIcon, label: "Flexible Hours" },
  { icon: AcademicCapIcon, label: "Learning Budget" },
  { icon: SunIcon, label: "Remote-First" },
  { icon: TrendingUpIcon, label: "Equity Options" },
];

export default function CareersPage() {
  const [searchParams] = useSearchParams();
  const referralCode = referralFromLink(searchParams.get("ref"));
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
      <PageSEO
        title="Careers at Aletheia AI"
        description="Join Aletheia AI — we're hiring engineers, designers and AI specialists. Build production AI products with a team that ships."
        path="/careers"
        keywords="AI internships, full stack developer internship, Rust Ruby internship, UI UX designer, graphic designer, software engineer"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />
      {/* Hero */}
      <PageHero
        overline="Careers"
        title="Build What Matters"
        description="Join a lean engineering studio that ships real products. We're hiring interns, designers and a software engineer across AI, full-stack development and Rust/Ruby."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
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
                  <h3 className="mt-4 text-lg font-semibold text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {card.description}
                  </p>
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
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink/[0.08] bg-surface px-5 py-2.5"
                >
                  <span className="text-[var(--color-accent-400)]">
                    <benefit.icon />
                  </span>
                  <span className="text-sm font-medium text-muted">
                    {benefit.label}
                  </span>
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
              description={`${careers.length} open roles. Find a role that matches your skills.`}
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
            className="divide-y divide-ink/15 border-y border-ink/15"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            key={activeDepartment}
          >
            {filteredCareers.map((job) => (
              <motion.article
                key={job.id}
                variants={staggerItem}
                className="py-8 md:py-10"
                aria-labelledby={`role-${job.id}`}
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 max-w-3xl">
                    <p className="mb-3 text-xs uppercase tracking-wider text-muted">
                      {job.department}
                      {job.type ? ` / ${job.type}` : ""}
                      {job.experience ? ` / ${job.experience}` : ""}
                    </p>
                    <h3
                      id={`role-${job.id}`}
                      className="text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                    >
                      {job.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                      {job.description}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="shrink-0 self-start"
                    aria-label={`Apply for ${job.title}`}
                    onClick={() => setApplyingFor(job.title)}
                  >
                    Apply for this role &rarr;
                  </Button>
                </div>
                <details className="group mt-5">
                  <summary className="w-fit cursor-pointer text-sm font-medium text-ink underline decoration-ink/25 underline-offset-4">
                    Role details{" "}
                    <span className="sr-only">for {job.title}</span>
                  </summary>
                  <div className="mt-6 grid gap-8 rounded-xl bg-white/60 p-5 md:grid-cols-2 md:p-7">
                    <div>
                      <h4 className="font-semibold text-ink">
                        What you’ll work on
                      </h4>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                        {job.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink">
                        Skills & experience
                      </h4>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                        {job.requirements.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t border-ink/10 pt-5 md:col-span-2">
                      <h4 className="font-semibold text-ink">
                        What to include
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {job.applicationNote}
                      </p>
                    </div>
                  </div>
                </details>
              </motion.article>
            ))}
          </motion.div>

          {filteredCareers.length === 0 && (
            <AnimatedSection>
              <div className="py-16 text-center">
                <p className="text-lg text-muted">
                  No open positions in this department right now.
                </p>
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
            referralCode={referralCode}
            onClose={() => setApplyingFor(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
