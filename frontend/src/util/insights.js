const money = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const cut = (text, max) =>
  text.length > max ? `${text.slice(0, max - 3)}...` : text;

const describe = (t) => t.description || "";
const isSavingsContribution = (t) =>
  t.type === "withdrawal" && describe(t).startsWith("Savings contribution");
const isLoanRepayment = (t) =>
  t.type === "withdrawal" && describe(t).startsWith("Loan repayment");
const isSpending = (t) =>
  t.status === "completed" &&
  (t.type === "withdrawal" || t.type === "transfer") &&
  !isSavingsContribution(t) &&
  !isLoanRepayment(t);
const isMoneyIn = (t) => t.type === "deposit" && t.status === "completed";

const sum = (list) => list.reduce((total, t) => total + Number(t.amount), 0);
const inRange = (t, start, end) => {
  const created = new Date(t.createdAt);
  return created >= start && created < end;
};

const TYPE_LABELS = { withdrawal: "Withdrawals", transfer: "Transfers" };
const LEVEL_ORDER = { warning: 0, info: 1, good: 2 };