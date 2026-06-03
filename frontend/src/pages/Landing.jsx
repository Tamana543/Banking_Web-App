import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import CTA from "../components/home/CTA";
import Testimonials from "../components/home/Testimonials";
import Operations from "../components/home/Operations";

function Landing() {
  return(
     <div>
     <Hero/>
     <Features/>
     <Operations/>
     <Testimonials/>
     <CTA/>
     </div>
  );
}

export default Landing;