import { useEffect, useState } from "react";
import "../../styles/landing/hero.css";
function Hero() {
  // Animations :)
      const [balance, setBalance] = useState(0);
    useEffect(() => {
        const target = 18450;
        const duration = 1000;
        const stepTime = 16;
        const increment = target / (duration / stepTime);
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            setBalance(current);
        }, stepTime);
        return () => clearInterval(timer);
    }, []);
  return (
    <section className="hero">
      <div className="hero-particles">
        <span className="particle p1"></span>
        <span className="particle p2"></span>
        <span className="particle p3"></span>
        <span className="particle p4"></span>
        <span className="particle p5"></span>
        <span className="particle p6"></span>
      </div>
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
                <span>Open Free Account</span>
            </button>
            <button className="hero-secondary-btn">
                <span>Learn More</span>
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
            <div>
                <small>Current Balance</small>
                <h1>$ {balance.toLocaleString(undefined,{ maximumFractionDigits:0 })}</h1>
            </div>
        </div>
        <div className="dashboard-summary">
            <div className="mini-card income">
                <span>Income</span>
                <strong>+$4,250</strong>
            </div>
            <div className="mini-card expense">
                <span>Expense</span>
                <strong>-$1,140</strong>
            </div>
        </div>
        <div className="dashboard-progress">
            <div className="progress-title">
                <span>Monthly Savings</span>
                <strong>74%</strong>
            </div>
            <div className="progress-bar">
                <div className="progress-fill"></div>
            </div>
        </div>
        <div className="dashboard-chart">
        <div className="chart-header">
                <span>Weekly Activity</span>
                <small>Last 7 Days</small>
            </div>
            <svg
                className="chart-svg"
                viewBox="0 0 300 120"
            >
                <defs>
                    <linearGradient
                        id="chartGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor="#d4af37"
                            stopOpacity=".45"
                        />
                        <stop
                            offset="100%"
                            stopColor="#d4af37"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>
                {/* Filled Area */}
                <path
                    className="chart-area"
                    d="
                    M10 90
                    L55 65
                    L100 75
                    L145 35
                    L190 55
                    L235 25
                    L280 45
                    L280 120
                    L10 120
                    Z"
                />
                {/* Gold Line */}
                <path
                    className="chart-line"
                    d="
                    M10 90
                    L55 65
                    L100 75
                    L145 35
                    L190 55
                    L235 25
                    L280 45"
                />
                {/* Points */}
                <circle cx="10" cy="90" r="4"/>
                <circle cx="55" cy="65" r="4"/>
                <circle cx="100" cy="75" r="4"/>
                <circle cx="145" cy="35" r="4"/>
                <circle cx="190" cy="55" r="4"/>
                <circle cx="235" cy="25" r="4"/>
                <circle cx="280" cy="45" r="4"/>
            </svg>
        </div>
        <div className="dashboard-transactions">
            <div className="transaction-row">
                <div className="transaction-icon income-icon">
                    ↑
                </div>
                <div>
                    <strong>Salary</strong>
                    <small>Today</small>
                </div>
                <span className="amount income">
                    +$2,450
                </span>
            </div>
            <div className="transaction-row">
                <div className="transaction-icon expense-icon">
                    ↓
                </div>
                <div>
                    <strong>Netflix</strong>
                    <small>Yesterday</small>
                </div>
                <span className="amount expense">
                    -$14
                </span>
            </div>
            <div className="transaction-row">
                <div className="transaction-icon income-icon">
                    ↑
                </div>
                <div>
                    <strong>Transfer</strong>
                    <small>2 days ago</small>
                </div>
                <span className="amount income">
                    +$520
                </span>
            </div>
        </div>
    </div>
        <div className="floating-card analytics-card_hero">
            <h4>Investments</h4>
            <strong>+18.4%</strong>
            <small>This Month</small>
        </div>
    </div>
    </section>
  );
}
export default Hero;