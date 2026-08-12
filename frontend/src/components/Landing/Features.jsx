import { useEffect, useRef } from "react";
import "../../styles/landing/features.css";
function Features() {
  const sectionRef = useRef(null);
  const features = [
    {
      title: "Smart Banking",
      description:
        "Manage your balance, transactions, transfers, and everyday banking from one secure platform.",
    },
    {
      title: "Instant Transfers",
      description:
        "Send money quickly and securely to other Bankist users whenever you need it.",
    },
    {
      title: "Savings Goals",
      description:
        "Create savings targets, track your progress, and stay motivated as you move closer to your goals.",
    },
    {
      title: "Financial Analytics",
      description:
        "Understand your spending and income with clear financial insights and activity tracking.",
    },
    {
      title: "Secure Loans",
      description:
        "Apply for personal loans and keep track of your loan activity from your banking dashboard.",
    },
    {
      title: "Complete Control",
      description:
        "Manage your profile, security settings, PIN, password, and financial activity in one place.",
    },
  ];
  useEffect(() => {
  const section = sectionRef.current;
  if (!section) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add(
          "features-visible"
        );
        observer.unobserve(section);
      }
    },
    {
      threshold: 0.15,
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
      className="features-section"
      id="features"
    >
      <div className="features-heading">
        <span className="features-label" aria-hidden="true">
          WHY BANKIST PRO
        </span>
        <h2>
          Everything You Need
          <br />
          <span>To Manage Your Money.</span>
        </h2>
        <p>
          Powerful banking tools designed to make
          managing your finances simpler, safer,
          and more transparent.
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <article
            className="feature-card"
            key={feature.title}
          >
            <span className="feature-number" aria-hidden="true">
              0{index + 1}
            </span>
            <div className="feature-accent" aria-hidden="true"></div>
            <h3>
              {feature.title}
            </h3>
            <p>
              {feature.description}
            </p>
            <span className="feature-arrow" aria-hidden="true">
              →
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
export default Features;