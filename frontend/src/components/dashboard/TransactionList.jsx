import "../../styles/dashboard/recent-transacrions.css";

function TransactionList({
  transactions = [],
  title = "Recent Activity",
}) {
  return (
    <div className="recent-transactions">
      <h3>{title}</h3>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="transaction-item"
          >
            <div>
              <h4>{transaction.type}</h4>

              <span>
                {transaction.description}
              </span>

              <br />

              <small className="transaction-date">
                {new Date(
                  transaction.createdAt
                ).toLocaleString()}
              </small>
            </div>

            <div className="transaction-right">
              <p className="transaction-status">
                {transaction.status}
              </p>

              <strong>
                ${transaction.amount}
              </strong>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionList;