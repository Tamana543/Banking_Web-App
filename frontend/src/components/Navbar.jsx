import {link } from "react-router-dom"

function Navbar(){
return (
     <nav class="nav">
        {/* <img
          src="img/logo.png"
          alt="Bankist logo"
          class="nav__logo"
          id="logo"
        /> */}
        <ul class="nav__link s">
          <li class="nav__item">
            <link class="nav__link " href="#section--1">Features</link >
          </li>
          <li class="nav__item">
            <link class="nav__link " href="#section--2">Operations</link >
          </li>
          <li class="nav__item">
            <link class="nav__link " href="#section--3">Testimonials</link >
          </li>
          <li class="nav__item">
            <link class="nav__link  nav__link --btn btn--show-modal" href="#"
              >Open account</link >
          </li>
        </ul>
      </nav>
);
}
export default Navbar