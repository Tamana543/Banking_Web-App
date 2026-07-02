import { useState } from "react";
import jsPDF from "jspdf";

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
      const downloadReciept = ()=>{
        // Create pdf handler
        const doc = new jsPDF();
        // pdf format
          doc.setFontSize(22);
          doc.text("BANKIST PRO", 20, 25);
          doc.setFontSize(12);
          doc.text(
            `Transaction ID: ${receipt.transactionId}`,
            20,
            45
          );
          doc.text(
            `Recipient: ${receipt.recipient}`,
            20,
            55
          );
          doc.text(
            `Amount: $${receipt.amount}`,
            20,
            65
          );
          doc.text(
            `Status: ${receipt.status}`,
            20,
            75
          );
          doc.text(
            `Date: ${receipt.date}`,
            20,
            85
          );
          doc.save(
            `BankistPro_${receipt.transactionId}.pdf`
          );
      }
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
         
          <button
            className="copy-btn"
            onClick={copyTransactionId}
          >
              <strong>
              {receipt.transactionId}
            </strong>
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
        <div className="receipt-actions">
            <button
              className="receipt-download-btn"
              onClick={downloadReciept}
            >
              Download PDF
            </button>

            <button
              className="receipt-close-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
      </div>
    </div>
  );
}
export default ReceiptModal;