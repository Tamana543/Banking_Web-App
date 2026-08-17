import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/dashboard/balance-card.css";
import BalanceCardSkeleton from "../common/BalanceSkeleton";
function BalanceCard({ loading = false }) {
  const { user } = useAuth();
  if (loading) {
    return <BalanceCardSkeleton />;
  }
  const currency = user?.currency || "USD";
  const balance = user?.balance ?? 0;
  const formattedBalance = balance.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  return (
    <section
      className="balance-card"
      aria-labelledby="balance-card-title"
    >
      <div className="card-top">
        <span className="bank-name">
          BANKIST PRO
        </span>
        <span
          className="currency-badge"
          aria-label={`Account currency: ${currency}`}
        >
          {currency}
        </span>
      </div>
      <div className="balance-content">
        <span className="portfolio-tag">
          PREMIUM ACCOUNT
        </span>
        <h2
          id="balance-card-title"
          className="balance-label"
        >
          Total Portfolio Value
        </h2>
        <p
          className="balance-amount"
          aria-label={`Current portfolio balance: ${currency} ${formattedBalance}`}
        >
          {currency} {formattedBalance}
        </p>
        <p
          className="balance-growth"
          aria-label="Portfolio increased by 12.4 percent this month"
        >
          +12.4% this month
        </p>
      </div>
      <div
        className="card-bottom"
        aria-hidden="true"
      >
        <p className="card-number">
          •••• •••• •••• 4582
        </p>
        <span className="card-type">
          VISA GOLD
        </span>
      </div>
    </section>
  );
}
export default BalanceCard;