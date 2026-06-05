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
       <header class="header">
      <nav class="nav">
        <img
          src="img/logo.png"
          alt="Bankist logo"
          class="nav__logo"
          id="logo"
        />
        <ul class="nav__links">
          <li class="nav__item">
            <a class="nav__link" href="#section--1">Features</a>
          </li>
          <li class="nav__item">
            <a class="nav__link" href="#section--2">Operations</a>
          </li>
          <li class="nav__item">
            <a class="nav__link" href="#section--3">Testimonials</a>
          </li>
          <li class="nav__item">
            <a class="nav__link nav__link--btn btn--show-modal" href="#"
              >Open account</a
            >
          </li>
        </ul>
      </nav>
      <button id="nav-open">|||</button>
      <button id="nav-close">X</button>

      <div class="header__title" id="header-main">
        <h1>
          When
         
          <span class="highlight">banking</span>
          meets<br />
          <span class="highlight">minimalist</span>
        </h1>
        <div class="header-sec">
          <h4>A simpler banking experience for a simpler life.</h4>
          <button class="btn--text btn--scroll-to">
            Learn more &DownArrow;
          </button>
        </div>

        <img
          src="img/hero.png"
          class="header__img"
          alt="Minimalist bank items"
        />
      </div>
    </header>
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