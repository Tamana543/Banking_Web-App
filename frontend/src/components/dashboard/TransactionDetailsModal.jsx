import "../../styles/components/transaction_details_modal.css"

function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose,
}) {
  if (!isOpen || !transaction) return null;

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
          <span>Type</span>
          <strong>{transaction.type}</strong>
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

          <strong className="status completed">
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
          <span>ID</span>

          <strong>
            {transaction._id}
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