import { useEffect, useRef } from "react";
import "../../styles/landing/statistics.css";
function Statistics() {
  const sectionRef = useRef(null);
  const statistics = [
    {
      value: "10K+",
      label: "Active Users",
      description:
        "People managing their finances with Bankist Pro.",
    },
    {
      value: "250K+",
      label: "Transactions",
      description:
        "Transfers and banking activities processed securely.",
    },
    {
      value: "99.9%",
      label: "Platform Reliability",
      description:
        "Built to keep your financial activity available when you need it.",
    },
    {
      value: "24/7",
      label: "Access",
      description:
        "Your financial tools are available whenever you need them.",
    },
  ];
 useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("statistics-visible");
        observer.disconnect();
      }
    },
    {
      threshold: 0.05,
    }
  );
  observer.observe(section);
  return () => {
    observer.disconnect();
  };
}, []);
  return (
    <section
      ref={sectionRef}
      className="statistics-section"
      id="statistics"
      aria-labelledby="statistics-heading"
    >
      <div className="statistics-heading">
        <span className="statistics-label">
          BANKIST PRO IN NUMBERS
        </span>
        <h2 id="statistics-heading">
          Banking built around
          <span> trust and simplicity.</span>
        </h2>
        <p>
          Everything you need to manage your money,
          backed by a platform designed for security,
          accessibility, and control.
        </p>
      </div>
      <div className="statistics-grid">
        {statistics.map((stat, index) => (
          <div
            className="stat-card_statistic"
            key={index}
          >
            <span className="stat-number">
              {stat.value}
            </span>
            <h3>{stat.label}</h3>
            <p>{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Statistics;