import { Link } from "react-router-dom";
import "../../styles/landing/cta.css";
function CTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-glow"></div>
      <div className="cta-content">
        <span className="cta-label">
          READY TO GET STARTED?
        </span>
        <h2>
          Take control of your
          <span> financial future.</span>
        </h2>
        <p>
          Join Bankist Pro and manage your money with
          confidence, simplicity, and complete control.
        </p>
        <div className="cta-actions">
          <Link to="/register" className="cta-primary">
            Open Your Account
          </Link>
          <Link to="/login" className="cta-secondary">
            Login to Your Account
          </Link>
        </div>
      </div>
    </section>
  );
}
export default CTA;