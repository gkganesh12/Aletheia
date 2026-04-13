import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import Stats from "@/components/sections/Stats";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import CTASection from "@/components/shared/CTASection";
import PageTransition from "@/components/shared/PageTransition";

export default function Home() {
  return (
    <PageTransition>
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
