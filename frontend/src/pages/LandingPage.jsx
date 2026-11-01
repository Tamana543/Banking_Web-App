import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Services from "../components/landing/Services";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";


function LandingPage() {
  return (
    <main className="landing-page">
     
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Testimonials />
      <Statistics />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
export default LandingPage;