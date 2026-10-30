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

export const generateStatementPdf = ({ user, transactions, from, to }) => {
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
