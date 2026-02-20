import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <StatsSection />
      <FeaturedProducts />
      <AboutSection />
      <ContactCTA />
    </main>
    <Footer />
  </>
);

export default Index;
