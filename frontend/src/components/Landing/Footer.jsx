import { Link } from "react-router-dom";
import "../../styles/landing/footer.css";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            BANKIST <span>PRO</span>
          </Link>
          <p>
            Simple, secure, and modern banking designed
            to give you complete control of your financial future.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              f
            </a>
            <a href="#" aria-label="Instagram">
              ◎
            </a>
            <a href="#" aria-label="LinkedIn">
              in
            </a>
            <a href="#" aria-label="Twitter">
              𝕏
            </a>
          </div>
        </div>
        <div className="footer-column">
          <h4>Banking</h4>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/accounts">Accounts</Link>
          <Link to="/transfers">Transfers</Link>
          <Link to="/loans">Loans</Link>
        </div>
        <div className="footer-column">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/support">Support</Link>
        </div>
        <div className="footer-column">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/security">Security</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Bankist Pro. All rights reserved.
        </p>
        <span>
          Built with security, simplicity, and trust.
        </span>
      </div>
    </footer>
  );
}
export default Footer;