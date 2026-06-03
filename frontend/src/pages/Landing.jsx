import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import CTA from "../components/home/CTA";
import Testimonials from "../components/home/Testimonials";
import Operations from "../components/home/Operations";
// import Navbar from "../components/layout/Navbar";
import Navbar from "../components/Navbar";
function Landing() {
  return(
     <div>
          <Navbar/>
          

          <Hero/>
          <Features/>
          <Operations/>
          <Testimonials/>
          <CTA/>
     </div>
  );
}

export default Landing;