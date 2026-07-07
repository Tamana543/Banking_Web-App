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

    <div className="stat-card income">

       

        <h4>Total Deposits</h4>

        <h2>
            $
            {totalIncome.toLocaleString()}
        </h2>

    </div>

    <div className="stat-card expense">

        <h4>Total Withdrawals</h4>

        <h2>
            $
            {totalExpenses.toLocaleString()}
        </h2>

    </div>

    <div className="stat-card transfer">


        <h4>Total Transfers</h4>

        <h2>
            $
            {totalTransfers.toLocaleString()}
        </h2>

    </div>

    <div className="stat-card transaction">

        <h4>Transactions</h4>

        <h2>
            {totalTransactions}
        </h2>

    </div>

</section>
  );
}

export default StatsCards;