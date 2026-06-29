import "../../styles/dashboard/stats-card.css"
function StatsCards() {
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