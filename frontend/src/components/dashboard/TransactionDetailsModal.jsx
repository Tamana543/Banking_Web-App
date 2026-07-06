import "../../styles/components/transaction_details_modal.css"
import { generateTransactionId } from "../../util/transactionId";

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
function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
}) {
  if (!isOpen || !transaction) return null;
  const category = getCategory(transaction.type);
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="transaction-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Transaction Details</h2>

       <div className="detail-row">
            <span>Category</span>

            <strong className={`category-text ${category.color}`}>
                {category.label}
            </strong>
        </div>

        <div className="detail-row">
          <span>Amount</span>
          <strong>
            $
            {Number(transaction.amount).toLocaleString()}
          </strong>
        </div>

        <div className="detail-row">
          <span>Status</span>

          <strong className={`status ${transaction.status.toLowerCase()}`}>
            {transaction.status}
          </strong>
        </div>

        <div className="detail-row">
          <span>Description</span>

          <strong>
            {transaction.description}
          </strong>
        </div>

        <div className="detail-row">
          <span>Date</span>

          <strong>
            {new Date(
              transaction.createdAt
            ).toLocaleString()}
          </strong>
        </div>

        <div className="detail-row">
               <span>Transaction ID</span>

               <strong className="transaction-id">
                    {generateTransactionId(transaction._id)}
               </strong>
          </div>

        <button
          className="transaction-close-btn"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TransactionDetailsModal;