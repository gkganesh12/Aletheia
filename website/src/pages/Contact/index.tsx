import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import {
  Container,
  SectionHeading,
  GlassPanel,
  Button,
} from "@/components/ui";
import { contactFAQ } from "@/data/faq";
import { fadeInLeft, fadeInRight } from "@/lib/motion-variants";
import PageHero from "@/components/shared/PageHero";
import PageTransition from "@/components/shared/PageTransition";
import AnimatedSection from "@/components/shared/AnimatedSection";
import CTASection from "@/components/shared/CTASection";
import FAQAccordion from "@/components/shared/FAQAccordion";
import PageSEO, { breadcrumbJsonLd, faqPageJsonLd } from "@/components/shared/PageSEO";
import { useToast } from "@/components/shared/Toast";

/* ────────────────────────────────────────────────────────────────────── */
/*  Service options                                                      */
/* ────────────────────────────────────────────────────────────────────── */

const SERVICE_OPTIONS = [
  "AI Product Engineering",
  "MVP & Rapid Prototyping",
  "Full-Stack Development",
  "Cybersecurity & Auditing",
  "Blockchain & Web3",
  "Data Engineering & ML",
  "Other",
] as const;

/* ────────────────────────────────────────────────────────────────────── */
/*  Form schema                                                          */
/* ────────────────────────────────────────────────────────────────────── */

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

/* ────────────────────────────────────────────────────────────────────── */
/*  Web3Forms API key                                                    */
/* ────────────────────────────────────────────────────────────────────── */

const WEB3FORMS_KEY = "b1d6246c-dfe6-41f6-8c93-7374d0c9919c";

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
/*  Icons                                                                */
/* ────────────────────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
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
/*  Contact info                                                         */
/* ────────────────────────────────────────────────────────────────────── */

const contactInfo = [
  {
    icon: MailIcon,
    label: "Email",
    value: "info@aletheiaai.tech",
    href: "mailto:info@aletheiaai.tech",
  },
  {
    icon: MapPinIcon,
    label: "Location",
    value: "Pune, Maharashtra, India",
    href: undefined,
  },
];

const socialLinks = [
  { Icon: GitHubIcon, href: "https://github.com/Aletheia-Ai-tech", label: "GitHub" },
  { Icon: LinkedInIcon, href: "https://www.linkedin.com/company/aletheiaaitech", label: "LinkedIn" },
  { Icon: TwitterIcon, href: "https://x.com/ai_aletheia", label: "Twitter" },
];

/* ────────────────────────────────────────────────────────────────────── */
/*  Page                                                                 */
/* ────────────────────────────────────────────────────────────────────── */

export default function ContactPage() {
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
      phone: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New inquiry from ${data.name} — ${data.service}`,
          from_name: data.name,
          name: data.name,
          email: data.email,
          company: data.company || "Not provided",
          phone: data.phone || "Not provided",
          service: data.service,
          message: data.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showToast({
          type: "success",
          message: "Message sent! We'll get back to you within 24 hours.",
        });
        reset();
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
    <PageTransition>
      <PageSEO
        title="Contact Aletheia AI"
        description="Get in touch with Aletheia AI for AI development, consulting, and custom solutions. Start your AI project today."
        path="/contact"
        keywords="contact AI agency, AI consulting inquiry, hire AI developers, AI project quote"
        jsonLd={[breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]), faqPageJsonLd(contactFAQ)]}
      />
      {/* Hero */}
      <PageHero
        overline="Contact Us"
        title="Let's Build Something"
        description="Whether you need an MVP shipped, an AI product built, a platform scaled or a security audit — we'd love to hear from you."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      {/* Contact section: info + form */}
      <section className="py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-start">
            {/* ── Left: Contact info ──────────────────────────────────── */}
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <SectionHeading
                overline="Get in Touch"
                heading="We'd Love to Hear From You"
                description="Drop us a message and we'll get back to you within 24 hours."
                align="left"
              />

              {/* Contact details */}
              <div className="flex flex-col gap-4">
                {contactInfo.map((item) => {
                  const IconComponent = item.icon;
                  const content = (
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0 text-[var(--color-accent-400)]">
                        <IconComponent />
                      </span>
                      <div>
                        <p className="mono text-[10px] font-medium uppercase tracking-wider text-white/40">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-sm text-white/70">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors duration-200 hover:border-white/[0.15] hover:bg-white/[0.04]"
                    >
                      {content}
                    </a>
                  ) : (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>

              {/* Social links */}
              <div className="mt-8">
                <p className="mono mb-3 text-[10px] font-medium uppercase tracking-wider text-white/40">
                  Follow Us
                </p>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-white/50 transition-colors duration-200 hover:border-white/20 hover:text-white"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Right: Contact form ─────────────────────────────────── */}
            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <GlassPanel className="p-6 sm:p-8">
                <h3 className="mb-6 text-xl font-bold text-white">
                  Send Us a Message
                </h3>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="space-y-5"
                >
                  {/* Honeypot — spam protection */}
                  <input type="hidden" name="botcheck" style={{ display: "none" }} />

                  {/* Name */}
                  <div>
                    <label htmlFor="page-contact-name" className="block text-sm text-white/60 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="page-contact-name"
                      type="text"
                      placeholder="Your name"
                      className={errors.name ? inputErrorClasses : inputClasses}
                      {...register("name")}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="page-contact-email" className="block text-sm text-white/60 mb-1.5">
                      Work Email
                    </label>
                    <input
                      id="page-contact-email"
                      type="email"
                      placeholder="you@company.com"
                      className={errors.email ? inputErrorClasses : inputClasses}
                      {...register("email")}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  {/* Company + Phone row */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="page-contact-company" className="block text-sm text-white/60 mb-1.5">
                        Company
                      </label>
                      <input
                        id="page-contact-company"
                        type="text"
                        placeholder="Your company"
                        className={inputClasses}
                        {...register("company")}
                      />
                    </div>
                    <div>
                      <label htmlFor="page-contact-phone" className="block text-sm text-white/60 mb-1.5">
                        Phone
                      </label>
                      <input
                        id="page-contact-phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        className={inputClasses}
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  {/* Service select */}
                  <div>
                    <label htmlFor="page-contact-service" className="block text-sm text-white/60 mb-1.5">
                      Service of Interest
                    </label>
                    <select
                      id="page-contact-service"
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
                        <option key={service} value={service} className="bg-[--color-primary-950]">
                          {service}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.service?.message} />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="page-contact-message" className="block text-sm text-white/60 mb-1.5">
                      How can we help?
                    </label>
                    <textarea
                      id="page-contact-message"
                      rows={5}
                      placeholder="Tell us about your project..."
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
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </GlassPanel>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-24 lg:py-32">
        <Container size="narrow">
          <AnimatedSection>
            <SectionHeading
              overline="FAQ"
              heading="Frequently Asked Questions"
              description="Quick answers to the questions we hear most often."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <FAQAccordion items={contactFAQ} />
          </AnimatedSection>
        </Container>
      </section>

      {/* CTA */}
      <CTASection />
    </PageTransition>
  );
}
