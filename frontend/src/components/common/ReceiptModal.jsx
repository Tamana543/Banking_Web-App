import { useState } from "react";
import "../../styles/components/receipt_modal.css";
function ReceiptModal({
  isOpen,
  receipt,
  onClose,
}) {
        const [copied,setCopied] = useState(false)
        if (!isOpen || !receipt) return null;
          const copyTransactionId = async () => {
        try {
          await navigator.clipboard.writeText(receipt.transactionId);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1200);
        } catch (error) {
          console.error(error);
        }
      };
  return (
    <div className="modal-overlay">
      <div className="receipt-modal">
        <div className="receipt-header">
          <h2 className="receipt-title">
    Bankist Pro
</h2>

<p className="receipt-subtitle">
    PREMIUM DIGITAL BANKING
</p>
        </div>
       <div className="receipt-row">
          <span>Transaction ID</span>
          <div className="transaction-id">
            <strong>
              {receipt.transactionId}
            </strong>
          <button
            className="copy-btn"
            onClick={copyTransactionId}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
          </div>
        </div>
        <div className="receipt-row">
          <span>Recipient</span>
          <strong>
              ${Number(receipt.amount).toLocaleString()}
            </strong>
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
          {copied && (
            <div className="copied-message">
              ✓ Copied to clipboard
            </div>
          )}
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