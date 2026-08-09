import { Link } from "react-router-dom";
import "../../styles/landing/footer.css";
function Footer() {
  return (
    <footer className="landing-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <h2>
            <span>BANKIST</span> PRO
          </h2>
          <p>
            Modern digital banking designed for
            simplicity, security, and complete
            financial control.
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h3>Platform</h3>
            <a href="#features">Features</a>
            <a href="#services">Services</a>
            <a href="#statistics">Statistics</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <div className="footer-column">
            <h3>Account</h3>
            <Link to="/login">Login</Link>
            <Link to="/register">Open Account</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © 2026 Bankist Pro. All rights reserved.
        </p>
        <a
            href="https://github.com/Tamana543/Banking_Web-App"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-github"
          >
            GitHub
        </a>
      </div>
    </footer>
  );
}
export default Footer;