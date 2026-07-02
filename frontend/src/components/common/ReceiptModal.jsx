import { useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode"
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

   const downloadReciept = async () => {
      const doc = new jsPDF();
      const width = doc.internal.pageSize.getWidth();
      // Verification
      const verificationCode = receipt.transactionId
        .replaceAll("-", "")
        .slice(-8)
        .toUpperCase();

      
      // QR DATA (JSON)
      
      const qrData = JSON.stringify(
        {
          bank: "Bankist Pro",
          transactionId: receipt.transactionId,
          recipient: receipt.recipient,
          amount: Number(receipt.amount),
          status: receipt.status,
          date: receipt.date,
          verificationCode: `BKP-${verificationCode}`,
        },
        null,
        2
      );

      const qrImage = await QRCode.toDataURL(qrData, {
        width: 220,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      
      // Header
      
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 0, width, 42, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(28);
      doc.setTextColor(212, 175, 55);

      doc.text("BANKIST PRO", width / 2, 18, {
        align: "center",
      });

      doc.setFontSize(10);
      doc.setTextColor(230);

      doc.text("PREMIUM DIGITAL BANKING", width / 2, 29, {
        align: "center",
      });

      
      // Gold Divider
      
      doc.setDrawColor(212, 175, 55);
      doc.setLineWidth(0.8);

      doc.line(18, 48, 192, 48);

      
      // Receipt Number
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(80);

      doc.text("Receipt No.", 20, 60);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(20);

      doc.text(receipt.transactionId, 60, 60);

      
      // VERIFIED Badge
      
      doc.setFillColor(67, 181, 129);

      doc.roundedRect(
        145,
        53,
        42,
        10,
        2,
        2,
        "F"
      );

      doc.setFontSize(9);
      doc.setTextColor(255);

      doc.text("VERIFIED", 166, 60, {
        align: "center",
      });

      
      // Body
      
      let y = 80;

      const drawRow = (label, value) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(90);

        doc.text(label, 20, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(20);

        doc.text(String(value), 75, y);

        y += 16;
      };

      drawRow("Recipient", receipt.recipient);

      drawRow(
        "Amount",
        `$${Number(receipt.amount).toLocaleString()}`
      );

      drawRow(
        "Status",
        receipt.status.toUpperCase()
      );

      drawRow(
        "Date",
        new Date(receipt.date).toLocaleString()
      );

      
      // Divider
      
      doc.setDrawColor(220);

      doc.line(20, y, 190, y);

      y += 18;

      
      // Verification Code
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(90);

      doc.text("Verification Code", 20, y);

      doc.setFont("courier", "bold");
      doc.setTextColor(212, 175, 55);

      doc.text(`BKP-${verificationCode}`, 20, y + 10);

      y += 28;

      
      // QR Code
      
      doc.addImage(
        qrImage,
        "PNG",
        70,
        y,
        70,
        70
      );

      doc.setFontSize(9);
      doc.setTextColor(120);

      doc.text(
        "Scan to view transaction details",
        width / 2,
        y + 82,
        {
          align: "center",
        }
      );

      
      // Footer
      
      doc.setFontSize(8);
      doc.setTextColor(150);

      doc.text(
        "© 2026 Bankist Pro",
        width / 2,
        286,
        {
          align: "center",
        }
      );

      
      // Save PDF
      
      doc.save(
        `BankistPro_Receipt_${receipt.transactionId}.pdf`
      );
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