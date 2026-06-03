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
            <link class="nav__link " to="/">Home</link >
          </li>
          <li class="nav__item">
            <link class="nav__link " to="/login">Login</link >
          </li>
          <li class="nav__item">
            <link class="nav__link  nav__link --btn btn--show-modal" to="#"
              >Open account</link >
          </li>
        </ul>
      </nav>
);
}
export default Navbar