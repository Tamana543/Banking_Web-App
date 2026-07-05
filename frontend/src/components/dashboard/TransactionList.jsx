import { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";
import "../../styles/dashboard/recent-transacrions.css";
import { generateTransactionId } from "../../util/transactionId";
function TransactionList({
  transactions = [],
  title = "Recent Activity",
}) {
   const [selectedTransaction, setSelectedTransaction] =
    useState(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const openDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedTransaction(null);
  };
  return (
    <>
    <div className="recent-transactions">
      <h3>{title}</h3>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="transaction-item"
             onClick={() =>
                openDetails(transaction)
              }
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
              <br />

              <small className="transaction-reference">
                  {generateTransactionId(transaction._id)}
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
    <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={showDetails}
        onClose={closeDetails}
    />
    </>
  );
}

export default TransactionList;