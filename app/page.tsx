import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServicesOverview from "./components/ServicesOverview";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesOverview />
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}
