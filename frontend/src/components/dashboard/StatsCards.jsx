import "../../styles/dashboard/stats-card.css";
import StatsCardsSkeleton from "../common/StatsSkeleton";
import { useAuth } from "../../context/AuthContext";
function StatsCards({
  transactions,
  loading = false,
}) {
  const { user } = useAuth();
  if (loading) {
    return <StatsCardsSkeleton />;
  }
  const currency = user?.currency || "USD";
  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "deposit"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "withdrawal"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const totalTransfers = transactions
    .filter(
      (transaction) =>
        transaction.type === "transfer"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const totalTransactions = transactions.length;
  const formatAmount = (amount) =>
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return (
    <section
      className="stats-cards"
      aria-labelledby="financial-stats-title"
    >
      <h2
        id="financial-stats-title"
        className="sr-only"
      >
        Financial Statistics
      </h2>
      <div className="stat-card income">
        <h3>Total Deposits</h3>
        <p
          className="stat-value"
          aria-label={`Total deposits: ${currency} ${formatAmount(totalIncome)}`}
        >
          {currency} {formatAmount(totalIncome)}
        </p>
      </div>
      <div className="stat-card expense">
        <h3>Total Withdrawals</h3>
        <p
          className="stat-value"
          aria-label={`Total withdrawals: ${currency} ${formatAmount(totalExpenses)}`}
        >
          {currency} {formatAmount(totalExpenses)}
        </p>
      </div>
      <div className="stat-card transfer">
        <h3>Total Transfers</h3>
        <p
          className="stat-value"
          aria-label={`Total transfers: ${currency} ${formatAmount(totalTransfers)}`}
        >
          {currency} {formatAmount(totalTransfers)}
        </p>
      </div>
      <div className="stat-card transaction">
        <h3>Transactions</h3>
        <p
          className="stat-value"
          aria-label={`Total number of transactions: ${totalTransactions}`}
        >
          {totalTransactions}
        </p>
      </div>
    </section>
  );
}
export default StatsCards;