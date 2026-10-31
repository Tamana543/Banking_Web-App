import jsPDF from "jspdf";
import { generateTransactionId } from "./transactionId";

const GOLD = [212, 175, 55];
const TYPE_LABELS = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  loan: "Loan",
};
const STATUS_COLORS = {
  completed: [30, 130, 76],
  approved: [30, 130, 76],
  repaid: [30, 130, 76],
  pending: [160, 120, 10],
  rejected: [180, 40, 40],
  failed: [180, 40, 40],
};

const safe = (value) =>
  String(value ?? "").replace(/[^\x20-\x7E\u00A0-\u00FF]/g, "?");

const cut = (text, max) =>
  text.length > max ? `${text.slice(0, max - 3)}...` : text;

const money = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const generateStatementPdf = ({ user, transactions, from, to ,mode = "download",
  printWindow = null,}) => {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T23:59:59.999`);

  const list = transactions
    .filter((t) => {
      const created = new Date(t.createdAt);
      return created >= start && created <= end;
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const moved = list.filter(
    (t) => t.status === "completed" || t.status === "approved"
  );
  const total = (type) =>
    moved
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + Number(t.amount), 0);
  const count = (type) => moved.filter((t) => t.type === type).length;

  const doc = new jsPDF();
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const bottom = height - 22;
  
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, width, 42, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...GOLD);
  doc.text("BANKIST PRO", width / 2, 18, { align: "center" });
  doc.setFontSize(10);
  doc.setTextColor(230);
  doc.text("PREMIUM DIGITAL BANKING", width / 2, 29, { align: "center" });
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(18, 48, 192, 48);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20);
  doc.text("Account Statement", 20, 62);

  const info = (label, value, x, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(label, x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(20);
    doc.text(safe(value), x, y + 6);
  };
  info("ACCOUNT HOLDER", `${user.firstName} ${user.lastName}`, 20, 74);
  info("EMAIL", user.email, 20, 90);
  info("STATEMENT PERIOD", `${formatDate(start)} to ${formatDate(end)}`, 112, 74);
  info("GENERATED ON", formatDate(new Date()), 112, 90);

   let y = 108;
  doc.setDrawColor(220);
  doc.setFillColor(248, 247, 242);
  doc.roundedRect(18, y, 174, 52, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.text("SUMMARY", 24, y + 9);

  const summaryRow = (label, value, labelX, valueX, rowY) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(label, labelX, rowY);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20);
    doc.text(value, valueX, rowY, { align: "right" });
  };
  summaryRow("Current balance", money(user.balance), 24, 100, y + 20);
  summaryRow(`Deposits (${count("deposit")})`, money(total("deposit")), 24, 100, y + 30);
  summaryRow(`Withdrawals (${count("withdrawal")})`, money(total("withdrawal")), 24, 100, y + 40);
  summaryRow(`Transfers sent (${count("transfer")})`, money(total("transfer")), 108, 186, y + 20);
  summaryRow(`Loans approved (${count("loan")})`, money(total("loan")), 108, 186, y + 30);
  summaryRow("Transactions listed", String(list.length), 108, 186, y + 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(130);
  doc.text(
    "Totals count completed and approved transactions only. Current balance is as of the time of download.",
    18,
    y + 58
  );
  y = 182;
  const drawTableHeader = () => {
    doc.setFillColor(17, 17, 17);
    doc.rect(18, y - 6, 174, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...GOLD);
    doc.text("DATE", 20, y);
    doc.text("REFERENCE", 46, y);
    doc.text("TYPE", 74, y);
    doc.text("DESCRIPTION", 98, y);
    doc.text("AMOUNT", 168, y, { align: "right" });
    doc.text("STATUS", 172, y);
    y += 9;
  };
  drawTableHeader();

  if (list.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("No transactions in this period.", 20, y + 4);
  }

  const lineHeight = 4.2;
  list.forEach((t) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const description = doc.splitTextToSize(
      cut(safe(t.description || "-"), 80),
      45
    );
    const rowHeight = (description.length - 1) * lineHeight + 7;
    if (y + rowHeight > bottom) {
      doc.addPage();
      y = 24;
      drawTableHeader();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
    }
    doc.setTextColor(40);
    doc.text(formatDate(t.createdAt), 20, y);
    doc.text(generateTransactionId(t._id), 46, y);
    doc.text(TYPE_LABELS[t.type] || t.type, 74, y);
    doc.text(description, 98, y);
    doc.text(money(t.amount), 168, y, { align: "right" });
    const status = t.type === "loan" && t.repaidAt ? "repaid" : t.status;
    doc.setTextColor(...(STATUS_COLORS[status] || [40, 40, 40]));
    doc.text(status, 172, y);
    const lineY = y + (description.length - 1) * lineHeight + 2.5;
    doc.setDrawColor(235);
    doc.setLineWidth(0.2);
    doc.line(18, lineY, 192, lineY);
    y += rowHeight;
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      "This statement is for information only and was generated by Bankist Pro.",
      18,
      height - 12
    );
    doc.text(`Page ${i} of ${pageCount}`, 192, height - 12, { align: "right" });
  }

    const filename = `bankist-statement-${from}-to-${to}.pdf`;
  if (mode === "print") {
    doc.autoPrint();
    const url = doc.output("bloburl");
    if (printWindow && !printWindow.closed) {
      printWindow.location.href = url;
    } else {
      doc.save(filename);
    }
  } else {
    doc.save(filename);
  }
  return list.length;
};
