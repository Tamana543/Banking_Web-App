import { useState } from "react";
import { Link } from "react-router-dom";
import HamburgerButton from "../dashboard/HamburgerButton";
import "../../styles/landing/navbar.css";
function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => {
        setMenuOpen(false);
    };
    return (
        <>

            <header className="landing-navbar">
                <div className="landing-logo">
                    <span className="logo-gold">
                        BANKIST
                    </span>
                    <span className="logo-white">
                        {" "}PRO
                    </span>
                </div>
                {/* Desktop navigation */}
                <nav className="landing-nav-links">
                    <a href="#features">
                        Features
                    </a>
                    <a href="#services">
                        Services
                    </a>
                    <a href="#testimonials">
                        Reviews
                    </a>
                    <a href="#statistics">
                        Statistics
                    </a>
                    <a href="#cta">
                        CTA
                    </a>
                </nav>
                <div className="landing-actions">
                    <Link
                        to="/login"
                        className="login-link"
                    >
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
                <div className="landing-mobile-toggle">
                    <HamburgerButton
                        sidebarOpen={menuOpen}
                        onClick={() =>
                            setMenuOpen(!menuOpen)
                        }
                    />
                </div>
            </header>
            <div
                className={`mobile-menu ${
                    menuOpen ? "mobile-menu-open" : ""
                }`}
            >
                <div className="mobile-menu-header">
                    <div className="landing-logo">
                        <span className="logo-gold">
                            BANKIST
                        </span>
                        <span className="logo-white">
                            {" "}PRO
                        </span>
                    </div>
                    <button
                        className="mobile-menu-close"
                        onClick={closeMenu}
                        aria-label="Close menu"
                    >
                        ×
                    </button>
                </div>
                <nav className="mobile-menu-links">
                    <a
                        href="#features"
                        onClick={closeMenu}
                    >
                        Features
                    </a>
                    <a
                        href="#services"
                        onClick={closeMenu}
                    >
                        Services
                    </a>
                    <a
                        href="#testimonials"
                        onClick={closeMenu}
                    >
                        Reviews
                    </a>
                    <a
                        href="#statistics"
                        onClick={closeMenu}
                    >
                        Statistics
                    </a>
                    <a
                        href="#cta"
                        onClick={closeMenu}
                    >
                        CTA
                    </a>
                </nav>
                <div className="mobile-menu-actions">
                    <Link
                        to="/login"
                        className="mobile-login"
                        onClick={closeMenu}
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="mobile-open-account"
                        onClick={closeMenu}
                    >
                        Open Account
                    </Link>
                </div>
            </div>
            {/* Background overlay */}
            {menuOpen && (
                <div
                    className="mobile-menu-overlay"
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
export default Navbar;