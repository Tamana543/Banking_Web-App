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

export const buildInsights = ({transactions=[],savingsGoals=[],balance=0,now=new Date()})=>{
const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
  const startNext = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const thisMonth = transactions.filter((t) => inRange(t, startThis, startNext));
  const lastMonth = transactions.filter((t) => inRange(t, startLast, startThis));

  const spendingThis = thisMonth.filter(isSpending);
  const spentThis = sum(spendingThis);
  const spentLast = sum(lastMonth.filter(isSpending));
  const moneyIn = sum(thisMonth.filter(isMoneyIn));
  const contributions = thisMonth.filter(
    (t) => isSavingsContribution(t) && t.status === "completed"
  );
  const savedThis = sum(contributions);
  const daysElapsed = now.getDate();

  let change = null;
  if (spentLast > 0) {
    change = Math.round(((spentThis - spentLast) / spentLast) * 100);
  }
  let spendingDetail;
  if (change === null) {
    spendingDetail =
      spentThis > 0 ? "No spending last month to compare" : "No spending yet this month";
  } else if (change === 0) {
    spendingDetail = "Same as last month";
  } else {
    spendingDetail = `${Math.abs(change)}% ${change > 0 ? "more" : "less"} than last month`;
  }

  const net = moneyIn - spentThis;
  const tagTotals = {};
  spendingThis.forEach((t) =>
    (t.tags || []).forEach((tag) => {
      tagTotals[tag] = (tagTotals[tag] || 0) + Number(t.amount);
    })
  );
  const topTag = Object.entries(tagTotals).sort((a, b) => b[1] - a[1])[0];

  const typeTotals = {};
  spendingThis.forEach((t) => {
    typeTotals[t.type] = (typeTotals[t.type] || 0) + Number(t.amount);
  });
  const topType = Object.entries(typeTotals).sort((a, b) => b[1] - a[1])[0];

  let topFact;
  if (topTag) {
    topFact = {
      id: "top",
      label: "Top spending tag",
      value: topTag[0],
      detail: `${money(topTag[1])} this month`,
    };
  } else if (topType) {
    topFact = {
      id: "top",
      label: "Top spending type",
      value: TYPE_LABELS[topType[0]] || topType[0],
      detail: "Tag your transactions to see more detail",
    };
  } else {
    topFact = {
      id: "top",
      label: "Top spending tag",
      value: "None yet",
      detail: "Nothing spent this month",
    };
  }

  const largest = spendingThis.reduce(
    (max, t) => (!max || Number(t.amount) > Number(max.amount) ? t : max),
    null
  );

}