"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Container, SectionHeading, GlassPanel, Button } from "@/components/ui";
import { copy } from "@/data/copy";
import { fadeInLeft, fadeInRight } from "@/lib/motion-variants";
import { useToast } from "@/components/shared/Toast";

/* ────────────────────────────────────────────────────────────────────── */
/*  Services for the dropdown                                            */
/* ────────────────────────────────────────────────────────────────────── */

const SERVICE_OPTIONS = [
  "AI Threat Intelligence",
  "Autonomous Penetration Testing",
  "Secure AI Architecture",
  "Intelligent Incident Response",
  "Compliance & Governance Automation",
  "Adversarial ML Defence",
  "Other",
] as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  Form schema                                                          */
/* ────────────────────────────────────────────────────────────────────── */

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

/* ────────────────────────────────────────────────────────────────────── */
/*  Shared input classes                                                 */
/* ────────────────────────────────────────────────────────────────────── */

const inputBase = cn(
  "w-full rounded-lg border bg-white/[0.04] px-4 py-3",
  "text-white placeholder:text-white/30",
  "focus:outline-none",
  "transition-colors duration-200",
);

const inputClasses = cn(
  inputBase,
  "border-white/[0.08] focus:border-[--color-accent-400]",
);

const inputErrorClasses = cn(
  inputBase,
  "border-red-400/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/40",
);

/* ────────────────────────────────────────────────────────────────────── */
/*  Field error message                                                  */
/* ────────────────────────────────────────────────────────────────────── */

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
/*  Social icon SVGs                                                     */
/* ────────────────────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                            */
/* ────────────────────────────────────────────────────────────────────── */

export default function Contact() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (_data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate async submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showToast({ type: "success", message: "Message sent! We'll get back to you soon." });
      reset();
    } catch {
      showToast({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-start">
          {/* ── Left: CTA text ─────────────────────────────────────── */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <SectionHeading
              overline={copy.contact.overline}
              heading={copy.contact.heading}
              description={copy.contact.description}
              align="left"
            />

            {/* Email */}
            <a
              href="mailto:hello@aletheia.ai"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-200 mb-6"
            >
              <MailIcon />
              <span className="text-sm">hello@aletheia.ai</span>
            </a>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-4">
              {[
                { Icon: TwitterIcon, href: "https://x.com/ai_aletheia", label: "Twitter" },
                { Icon: LinkedInIcon, href: "https://www.linkedin.com/company/aletheiaaitech", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] text-white/50 transition-colors duration-200 hover:border-white/20 hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Contact form ────────────────────────────────── */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <GlassPanel className="p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-sm text-white/60 mb-1.5">
                    {copy.contact.formLabels.name}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Jane Doe"
                    className={errors.name ? inputErrorClasses : inputClasses}
                    {...register("name")}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-sm text-white/60 mb-1.5">
                    {copy.contact.formLabels.email}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="jane@company.com"
                    className={errors.email ? inputErrorClasses : inputClasses}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="contact-company" className="block text-sm text-white/60 mb-1.5">
                    {copy.contact.formLabels.company}
                  </label>
                  <input
                    id="contact-company"
                    type="text"
                    placeholder="Acme Corp"
                    className={inputClasses}
                    {...register("company")}
                  />
                </div>

                {/* Service select */}
                <div>
                  <label htmlFor="contact-service" className="block text-sm text-white/60 mb-1.5">
                    Service of Interest
                  </label>
                  <select
                    id="contact-service"
                    defaultValue=""
                    className={cn(
                      errors.service ? inputErrorClasses : inputClasses,
                      "appearance-none",
                    )}
                    {...register("service")}
                  >
                    <option value="" disabled className="bg-[--color-primary-950]">
                      Select a service...
                    </option>
                    {SERVICE_OPTIONS.map((service) => (
                      <option
                        key={service}
                        value={service}
                        className="bg-[--color-primary-950]"
                      >
                        {service}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.service?.message} />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-sm text-white/60 mb-1.5">
                    {copy.contact.formLabels.message}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us about your project or challenge..."
                    className={cn(
                      errors.message ? inputErrorClasses : inputClasses,
                      "resize-none",
                    )}
                    {...register("message")}
                  />
                  <FieldError message={errors.message?.message} />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : copy.contact.formLabels.submit}
                </Button>
              </form>
            </GlassPanel>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
