import { useState } from "react";
import TransactionDetailsModal from "./TransactionDetailsModal";
import "../../styles/recent-transacrions.css";
import TransactionSkeleton from "../common/TransactionSkeleton";
import { generateTransactionId } from "../../util/transactionId";
function TransactionList({ transactions = [], title = "Recent Activity", loading = false, }) {
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
      <section className="recent-transactions" aria-labelledby="recent-transactions-title" >
        <h3 id="recent-transactions-title">
          {title}
        </h3>
        {loading ? (
          <TransactionSkeleton />
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <h4>
              No {title.toLowerCase()} yet
            </h4>
            <p>
              Your {title.toLowerCase()} will appear
              here after your first activity.
            </p>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((transaction) => {
              const category = getCategory(
                transaction.type
              );
              const transactionId =
                generateTransactionId(
                  transaction._id
                );
              const transactionDate =
                new Date(
                  transaction.createdAt
                ).toLocaleString();
              return (
                // < 
                // >
                <div key={transaction._id}  className="transaction-item" onClick={() => openDetails(transaction) } aria-label={`View details for ${category.label}: ${transaction.description}`}>
                  <div className="transaction-main">
                    <div className="transaction-category">
                      <h4>
                        {category.label}
                      </h4>
                    </div>
                    <span>
                      {transaction.description}
                    </span>
                    <small className="transaction-date">
                      {transactionDate}
                    </small>
                    <small className="transaction-reference">
                      {transactionId}
                    </small>
                  </div>
                  <div className="transaction-right">
                    <p
                      className={`transaction-status ${transaction.status.toLowerCase()}`}
                    >
                      {transaction.status}
                    </p>
                    <strong>
                      ${transaction.amount}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <TransactionDetailsModal transaction={selectedTransaction} isOpen={showDetails} onClose={closeDetails} />
    </>
  );
}
export default TransactionList;