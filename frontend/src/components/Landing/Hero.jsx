import "../../styles/landing/hero.css";
function Hero() {
  return (
    <section className="hero">
  
      <div className="hero-left">
        <span className="hero-badge">
          Trusted by 50,000+ Customers
        </span>
        <h1>
          Banking
          <span className="gold-text">
            {" "}Made Simple
          </span>
          <br />
          For Your Future.
        </h1>
        <p>
          Experience premium digital banking with secure
          payments, instant transfers, smart savings,
          powerful analytics, and complete financial
          control—all in one beautiful platform.
        </p>
        <div className="hero-buttons">
          <button className="hero-primary-btn">
            Open Free Account
          </button>
          <button className="hero-secondary-btn">
            Learn More
          </button>
        </div>
        <div className="hero-trust">
          <div className="trust-item">
            🔒 Secure
          </div>
          <div className="trust-item">
            ⚡ Instant
          </div>
          <div className="trust-item">
            ⭐ Premium
          </div>
        </div>
      </div>
      <div className="hero-right">
    <div className="floating-card credit-card">
            <span>VISA</span>
            <h3>**** 2458</h3>
            <small>Bankist Pro</small>
        </div>
        <div className="floating-card transaction-card">
            <div>
                <strong>+$2,450</strong>
                <p>Salary Received</p>
            </div>
            <span className="success-dot"></span>
        </div>
        <div className="dashboard-card">
            <div className="dashboard-header">
                <h3>Available Balance</h3>
                <span>●</span>
            </div>
            <h1>$18,450.35</h1>
            <div className="dashboard-stats">
                <div className="mini-card income">
                    <small>Income</small>
                    <h4>+$4,250</h4>
                </div>
                <div className="mini-card expense">
                    <small>Expenses</small>
                    <h4>-$1,140</h4>
                </div>
            </div>
            <div className="dashboard-bottom">
                <div className="saving-card">
                    <span>Monthly Savings</span>
                    <strong>$2,980</strong>
                </div>
            </div>
        </div>
        <div className="floating-card analytics-card">
            <h4>Investments</h4>
            <strong>+18.4%</strong>
            <small>This Month</small>
        </div>
    </div>
    </section>
  );
}
export default Hero;