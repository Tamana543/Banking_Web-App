function RecentTransactions({ transactions = [] }) {
  return (
    <div className="recent-transactions">
      <h3>Recent Activity</h3>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((transaction) => (
          <div key={transaction._id} className="transaction-item">

          <div>
            <h4>
              {transaction.type}
            </h4>

            <span>
              {transaction.status}
            </span>
          </div>

          <strong>
            ${transaction.amount}
          </strong>

        </div>
        ))
      )}
    </div>
  );
}

export default RecentTransactions;