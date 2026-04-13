"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Container, SectionHeading } from "@/components/ui";
import { homepageFAQ } from "@/data/faq";
import AnimatedSection from "@/components/shared/AnimatedSection";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "border-b border-white/[0.06] transition-colors duration-200",
        isOpen && "border-white/[0.1]",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-white"
      >
        <span
          className={cn(
            "text-base font-medium transition-colors duration-200 pr-4",
            isOpen ? "text-white" : "text-white/70",
          )}
        >
          {question}
        </span>
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
            isOpen
              ? "border-[#8b5cf6]/30 bg-[#8b5cf6]/10 text-[#8b5cf6]"
              : "border-white/10 text-white/40",
          )}
        >
          <svg
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              isOpen && "rotate-45",
            )}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="6" y1="0" x2="6" y2="12" />
            <line x1="0" y1="6" x2="12" y2="6" />
          </svg>
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-white/45">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 lg:py-24">
      <Container size="narrow">
        <AnimatedSection>
          <SectionHeading
            overline="FAQ"
            heading="Common Questions"
            align="center"
          />
        </AnimatedSection>

        <div className="mx-auto max-w-2xl">
          {homepageFAQ.map((item, i) => (
            <FAQItem
              key={i}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
