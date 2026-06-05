import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "../../styles/landing/navbar.css";


function Navbar() {
  return (
    <header className="header">
      <nav className="nav">
        <img
          src={logo}
          alt="Bankist logo"
          className="nav__logo"
          id="logo"
        />

        <ul className="nav__links">
          <li className="nav__item">
            <a className="nav__link" href="#features">
              Features
            </a>
          </li>

          <li className="nav__item">
            <a className="nav__link" href="#operations">
              Operations
            </a>
          </li>

          <li className="nav__item">
            <a className="nav__link" href="#testimonials">
              Testimonials
            </a>
          </li>

          <li className="nav__item">
            <Link className="nav__link" to="/login">
              Login
            </Link>
          </li>

          <li className="nav__item">
            <Link
              to="/register"
              className="nav__link nav__link--btn"
            >
              Open Account
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;