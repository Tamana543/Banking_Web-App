import { Link } from "react-router-dom";
import { useState } from "react";
import HamburgerButton from "../dashboard/HamburgerButton";
import "../../styles/landing/navbar.css";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <header className="landing-navbar">
      <div className="landing-logo">
        <span className="logo-gold">BANKIST</span>
        <span className="logo-white"> PRO</span>
      </div>
      {/* Desktop navigation */}
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
      {/* Mobile hamburger */}
      <div className="landing-hamburger">
        <HamburgerButton
          sidebarOpen={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        />
      </div>
      {/* Mobile menu */}
      <div
        className={`landing-mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >
        <nav>
          <a href="#features" onClick={closeMenu}>
            Features
          </a>
          <a href="#services" onClick={closeMenu}>
            Services
          </a>
          <a href="#testimonials" onClick={closeMenu}>
            Reviews
          </a>
          <a href="#statistics" onClick={closeMenu}>
            Statistics
          </a>
          <a href="#cta" onClick={closeMenu}>
            CTA
          </a>
        </nav>
        <div className="landing-mobile-actions">
          <Link
            to="/login"
            className="login-link"
            onClick={closeMenu}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="open-account-btn"
            onClick={closeMenu}
          >
            Open Account
          </Link>
        </div>
      </div>
    </header>
  );
}
export default Navbar;