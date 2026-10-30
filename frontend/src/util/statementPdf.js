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