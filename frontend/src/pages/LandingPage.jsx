import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Services from "../components/landing/Services";
import Statistics from "../components/landing/Statistics";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";
import "../styles/landing/landing.css"

function LandingPage() {
  return (
    <main className="landing-page">
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Statistics />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
export default LandingPage;