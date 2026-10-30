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