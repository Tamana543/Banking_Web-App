import Hero from "../components/Landing/Hero"
import Features from "../components/Landing/Features";
import CTA from "../components/Landing/CTA";
import Testimonials from "../components/Landing/Testimonials";
import Operations from "../components/Landing/Operations";
import Footer from "../components/Landing/Footer";
import Navbar from "../components/Landing/Navbar";
function Landing() {
  return(
     <div>
          <Navbar/>
          

          <Hero/>
          <Features/>
          <Operations/>
          <Testimonials/>
          <CTA/>
          <Footer/>
     </div>
  );
}

export default Landing;