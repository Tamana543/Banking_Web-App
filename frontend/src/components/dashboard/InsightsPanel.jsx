import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { buildInsights } from "../../util/insights";

function InsightsPanel({ transactions, savingsGoals }) {
  const { user } = useAuth();
  const { facts, tips } = useMemo(
    () =>
      buildInsights({
        transactions,
        savingsGoals,
        balance: Number(user?.balance || 0),
      }),
    [transactions, savingsGoals, user?.balance]
  );
  return (
    <section
      className="analytics-card insights-panel"
      aria-labelledby="insights-title"
    >
      <h3 id="insights-title">This Month at a Glance</h3>
      <div className="insights-grid insights-facts">
        {facts.map((fact) => (
          <div key={fact.id} className="insight-box">
            <p>{fact.label}</p>
            <h2>{fact.value}</h2>
            <small className="insight-detail">{fact.detail}</small>
          </div>
        ))}
      </div>
      <h3 className="insights-subtitle">Suggestions</h3>
      <ul className="insight-tips">
        {tips.map((tip) => (
          <li key={tip.id} className={`insight-tip ${tip.level}`}>
            <span>{tip.text}</span>
            {tip.to && <Link to={tip.to}>{tip.action}</Link>}
          </li>
        ))}
      </ul>
      <small className="insight-note">
        Based on your own activity this month. These are simple rules, not financial advice.
      </small>
    </section>
  );
}
export default InsightsPanel;