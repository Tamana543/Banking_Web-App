import "../../styles/components/receipt_modal.css";

function ReceiptModal({
  isOpen,
  receipt,
  onClose,
}) {
  if (!isOpen || !receipt) return null;

  return (
    <div className="modal-overlay">

      <div className="receipt-modal">

        <div className="receipt-header">

          <h2>Bankist Pro</h2>

          <p>Official Transfer Receipt</p>

        </div>

        <div className="receipt-row">
          <span>Transaction ID</span>
          <strong>
            ${Number(receipt.amount).toLocaleString()}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Recipient</span>
          <strong>{receipt.recipient}</strong>
        </div>

        <div className="receipt-row">
          <span>Amount</span>
          <strong>${receipt.amount}</strong>
        </div>

        <div className="receipt-row">
          <span>Status</span>
          <strong className="completed">
            {receipt.status}
          </strong>
        </div>

        <div className="receipt-row">
          <span>Date</span>
          <strong>
            {new Date(receipt.date).toLocaleString()}
          </strong>
        </div>

        <button
          className="receipt-close-btn"
          onClick={onClose}
        >
          Close
        </button>

      </div>

    </div>
  );
}

export default ReceiptModal;