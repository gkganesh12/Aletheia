import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Products from "@/components/sections/Products";
import Stats from "@/components/sections/Stats";
import CTASection from "@/components/shared/CTASection";
import ParallaxSection from "@/components/shared/ParallaxSection";
import PageTransition from "@/components/shared/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <Hero />

      <ParallaxSection offset={30}>
        <About />
      </ParallaxSection>

      <ParallaxSection offset={40} fade>
        <Services />
      </ParallaxSection>

      <ParallaxSection offset={50} scale>
        <Products />
      </ParallaxSection>

      <Stats />

      <CTASection />
    </PageTransition>
  );
}
