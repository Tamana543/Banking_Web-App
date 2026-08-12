import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HamburgerButton from "../dashboard/HamburgerButton";
import "../../styles/landing/navbar.css";
function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const menuButtonRef = useRef(null);
    const firstMenuLinkRef = useRef(null);
    const lastMenuLinkRef = useRef(null);

    const closeMenu = () => {
        setMenuOpen(false);
    };
    // React use_efect for keyboards
    useEffect(() => {
    if (!menuOpen) return;

    firstMenuLinkRef.current?.focus();

    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuButtonRef.current?.focus();
        }
    };

    document.addEventListener(
        "keydown",
        handleKeyDown
    );

    return () => {
        document.removeEventListener(
            "keydown",
            handleKeyDown
        );
    };
}, [menuOpen]);
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
                <nav className="landing-nav-links" aria-label="Main navigation">
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
                         Get Started
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
                        ref={menuButtonRef}
                        sidebarOpen={menuOpen}
                        onClick={() => setMenuOpen(!menuOpen) }
                        aria-expanded={menuOpen}
                        aria-controls="landing-mobile-menu"
                    />
                </div>
            </header>
            <nav
            ref={menuRef}
                className={`mobile-menu ${menuOpen ? "mobile-menu-open" : ""}`}
                aria-hidden={!menuOpen}
                aria-label="Mobile navigation"
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
                        type="button"
                        className="mobile-menu-close"
                        onClick={closeMenu}
                        aria-label="Close navigation menu"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <nav className="mobile-menu-links" aria-label="Mobile navigation">
                    <a
                        ref={firstMenuLinkRef}
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
            </nav>
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