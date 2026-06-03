import {Link } from "react-router-dom"

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
            <Link class="nav__link " to="/">Home</Link >
          </li>
          <li class="nav__item">
            <Link class="nav__link " to="/login">Login</Link >
          </li>
          <li class="nav__item">
            <Link class="nav__link  nav__link --btn btn--show-modal" to="#"
              >Open account</Link >
          </li>
        </ul>
      </nav>
);
}
export default Navbar