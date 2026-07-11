import { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";
import "../../styles/recent-transacrions.css";
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
    const getCategory = (type) => {
    switch (type) {
        case "deposit":
            return {
                color: "deposit",
                label: "Deposit",
            };

        case "withdrawal":
            return {
                color: "withdrawal",
                label: "Withdrawal",
            };

        case "transfer":
            return {
                color: "transfer",
                label: "Transfer",
            };

        case "loan":
            return {
                color: "loan",
                label: "Loan",
            };

        default:
            return {
                color: "default",
                label: type,
            };
    }
};
return (
  <>
    <div className="recent-transactions">
      <h3>{title}</h3>

      {transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        
        transactions.map((transaction) => {
           const category = getCategory(transaction.type);
          return (
          <div
          key={transaction._id}
          className="transaction-item"
          onClick={() =>
            openDetails(transaction)
          }
          >
            <div>
              <div className="transaction-category">

              <h4>
                  {category.label}
              </h4>

          </div>

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
             <p className={`transaction-status ${transaction.status.toLowerCase()}`} >
                  {transaction.status}
              </p>

              <strong>
                ${transaction.amount}
              </strong>
            </div>
          </div>
        )})
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