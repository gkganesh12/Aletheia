import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTASection from "@/components/shared/CTASection";
import PageTransition from "@/components/shared/PageTransition";
import PageSEO, { organizationJsonLd, websiteJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/components/shared/PageSEO";
import { homepageFAQ } from "@/data/faq";

export default function Home() {
  return (
    <PageTransition>
      <PageSEO
        title="Aletheia AI — We Build What Others Pitch."
        description="AI engineering studio — we ship AI products, build full-stack platforms and deliver client solutions. AI development, consulting, and custom AI solutions."
        path="/"
        keywords="AI agency, AI consulting, AI development company, AI solutions, AI engineering, custom AI products"
        jsonLd={[organizationJsonLd(), websiteJsonLd(), breadcrumbJsonLd([{ name: "Home", path: "/" }]), faqPageJsonLd(homepageFAQ)]}
      />
      <Hero />
      <Services />
      <Products />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTASection />
    </PageTransition>
  );
}
