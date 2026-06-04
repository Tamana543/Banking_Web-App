import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="nav">
      <div className="nav__logo">
        <h2>Bankist Pro</h2>
      </div>

      <ul className="nav__links">
        <li>
          <a href="#features">Features</a>
        </li>

        <li>
          <a href="#operations">Operations</a>
        </li>

        <li>
          <a href="#testimonials">Testimonials</a>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/register" className="nav__btn">
            Open Account
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;