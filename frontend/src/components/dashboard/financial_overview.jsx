import { useAuth } from "../../context/AuthContext";
import "../../styles/dashboard/financial_overview.css";
function FinancialOverview({
  transactions = [],
}) {
  const { user } = useAuth();
  const currency = user?.currency || "$";
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "deposit"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const expenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "withdrawal"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const transfers = transactions
    .filter(
      (transaction) =>
        transaction.type === "transfer"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const cashFlow = income - expenses;
  const savingsRate = income === 0 ? 0 : Math.round( (cashFlow / income) * 100 );
  return (
    <section
      className="financial-overview"
      aria-labelledby="financial-overview-title"
    >
      <div className="overview-header">
        <h2 id="financial-overview-title">
          Financial Overview
        </h2>
        <span>
          This Month
        </span>
      </div>
      <OverviewRow label="Income" value={income} percent={100} color="income" currency={currency}
      />
      <OverviewRow label="Expenses" value={expenses} percent={ income ? (expenses / income) * 100 : 0 }
        color="expense"
        currency={currency}
      />
      <OverviewRow label="Transfers" value={transfers} percent={ income ? (transfers / income) * 100 : 0 } color="transfer" currency={currency} />
      <div
        className="overview-divider"
        aria-hidden="true"
      />
      <div className="overview-summary">
        <div>
          <small>
            Net Cash Flow
          </small>
          <h3
            aria-label={`Net cash flow: ${
              cashFlow >= 0
                ? "positive"
                : "negative"
            } ${currency} ${Math.abs(
              cashFlow
            ).toLocaleString()}`}
          >
            {cashFlow >= 0 ? "+" : "-"}
            {currency}{" "}
            {Math.abs(
              cashFlow
            ).toLocaleString()}
          </h3>
        </div>
        <div>
          <small>
            Savings Rate
          </small>
          <h3
            aria-label={`Savings rate: ${savingsRate} percent`}
          >
            {savingsRate}%
          </h3>
        </div>
      </div>
    </section>
  );
}
function OverviewRow({ label, value, percent, color, currency, }) {
  const safePercent = Math.min(
    Math.max(percent, 0),
    100
  );
  const progressId = `progress-${label.toLowerCase()}`;
  return (
    <div className="overview-row">
      <div className="overview-info">
        <p id={`${progressId}-label`}>
          {label}
        </p>
        <strong>
          {currency}{" "}
          {value.toLocaleString()}
        </strong>
      </div>
      <div className="progress" role="progressbar" aria-labelledby={`${progressId}-label`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(
          safePercent
        )}
        aria-valuetext={`${Math.round(
          safePercent
        )}% of income`}
      >
        <div
          className={`progress-fill ${color}`}
          style={{
            width: `${safePercent}%`,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
export default FinancialOverview;