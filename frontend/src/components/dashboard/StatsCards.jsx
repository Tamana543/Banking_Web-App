import "../../styles/dashboard/stats-card.css"
function StatsCards({
  transactions
}) {
  // total datas logic 
  const totalIncome = transactions
    .filter(transaction => transaction.type === "deposit")
    .reduce(
        (sum, transaction) =>
            sum + Number(transaction.amount),
        0
    );

const totalExpenses = transactions
    .filter(transaction => transaction.type === "withdrawal")
    .reduce(
        (sum, transaction) =>
            sum + Number(transaction.amount),
        0
    );
    const totalTransfers = transactions
    .filter(transaction => transaction.type === "transfer")
    .reduce(
        (sum, transaction) =>
            sum + Number(transaction.amount),
        0
    );

const totalTransactions = transactions.length;
  return (
    <section className="stats-cards">

      <div className="stat-card">
        <h4>Income</h4>
        <h2>$0.00</h2>
      </div>

      <div className="stat-card">
        <h4>Expenses</h4>
        <h2>$0.00</h2>
      </div>

      <div className="stat-card">
        <h4>Transactions</h4>
        <h2>0</h2>
      </div>

    </section>
  );
}

export default StatsCards;