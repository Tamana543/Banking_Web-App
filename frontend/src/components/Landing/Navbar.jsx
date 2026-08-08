import { Link } from "react-router-dom";
import "../../styles/landing/navbar.css"

function Navbar() {
  return (
    <header className="landing-navbar">
      <div className="landing-logo">
        <span className="logo-gold">BANKIST</span>
        <span className="logo-white"> PRO</span>
      </div>
      <nav className="landing-nav-links">
        <a href="#features">Features</a>
        <a href="#services">Services</a>
        <a href="#testimonials">Reviews</a>
        <a href="#statistics">Statistics</a>
        <a href="#cta">CTA</a>
      </nav>
      <div className="landing-actions">
        <Link to="/login" className="login-link">
          Login
        </Link>
        <Link
          to="/register"
          className="open-account-btn"
        >
          Open Account
        </Link>
      </div>
    </header>
  );
}
export default Navbar;