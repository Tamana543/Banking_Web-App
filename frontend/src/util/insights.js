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
  const facts = [
    {
      id: "spent",
      label: "Spent this month",
      value: money(spentThis),
      detail: spendingDetail,
    },
    {
      id: "in",
      label: "Money in this month",
      value: money(moneyIn),
      detail: `Net ${net < 0 ? "-" : "+"}${money(Math.abs(net))}`,
    },
    {
      id: "saved",
      label: "Saved this month",
      value: money(savedThis),
      detail: `${contributions.length} contribution${contributions.length === 1 ? "" : "s"}`,
    },
    {
      id: "daily",
      label: "Daily average spending",
      value: money(spentThis / daysElapsed),
      detail: `Over ${daysElapsed} day${daysElapsed === 1 ? "" : "s"} so far`,
    },
    topFact,
    {
      id: "largest",
      label: "Largest expense",
      value: largest ? money(largest.amount) : "None yet",
      detail: largest ? cut(describe(largest) || "No description", 40) : "No expenses this month",
    },
  ];

  const tips = [];
  const activeGoals = savingsGoals.filter((g) => g.status !== "completed");
  const activeLoan = transactions.find(
    (t) => t.type === "loan" && t.status === "approved" && !t.repaidAt
  );
  const pendingLoan = transactions.find(
    (t) => t.type === "loan" && t.status === "pending"
  );

  if (activeLoan) {
    const repaid = Number(activeLoan.repaidAmount || 0);
    const owed = Math.max(Number(activeLoan.amount) - repaid, 0);
    const percent = Math.round((repaid / Number(activeLoan.amount)) * 100);
    tips.push({
      id: "loan-active",
      level: percent >= 80 ? "good" : "info",
      text:
        percent >= 80
          ? `Almost there: you've repaid ${percent}% of your loan, ${money(owed)} to go.`
          : `You owe ${money(owed)} on your loan (${percent}% repaid). Repaying it frees you to borrow again.`,
      to: "/loans",
      action: "Go to Loans",
    });
  }
  if (pendingLoan) {
    tips.push({
      id: "loan-pending",
      level: "info",
      text: "Your loan request is waiting for an administrator to review it.",
      to: "/loans",
      action: "View loans",
    });
  }
  if (change !== null && change >= 30 && spentThis - spentLast >= 10) {
    tips.push({
      id: "spending-up",
      level: "warning",
      text: `Your spending is up ${change}% compared with last month. Take a look at where it went.`,
      to: "/transactions",
      action: "Review transactions",
    });
  }
  if (balance >= 100 && activeGoals.length === 0) {
    tips.push({
      id: "idle-balance",
      level: "info",
      text: `You have ${money(balance)} sitting in your balance. A savings goal can help you set some of it aside.`,
      to: "/savings-goals",
      action: "Create a goal",
    });
  }
  const nearGoal = activeGoals.find((g) => {
    const target = Number(g.targetAmount || 0);
    return target > 0 && Number(g.currentAmount || 0) / target >= 0.8;
  });
  if (nearGoal) {
    const target = Number(nearGoal.targetAmount);
    const current = Number(nearGoal.currentAmount || 0);
    tips.push({
      id: "goal-near",
      level: "good",
      text: `"${nearGoal.name}" is ${Math.round((current / target) * 100)}% complete, just ${money(target - current)} to go.`,
      to: "/savings-goals",
      action: "View goals",
    });
  }
  if (savedThis > 0) {
    tips.push({
      id: "saved",
      level: "good",
      text: `Nice work: you've set aside ${money(savedThis)} this month.`,
    });
  }
  const untagged = spendingThis.filter((t) => !(t.tags || []).length).length;
  if (untagged >= 5) {
    tips.push({
      id: "untagged",
      level: "info",
      text: `${untagged} of this month's expenses have no tag. Tag them to see where your money goes.`,
      to: "/transactions",
      action: "Tag transactions",
    });
  }
  if (balance < 20) {
    tips.push({
      id: "low-balance",
      level: "warning",
      text: `Your balance is low (${money(balance)}).`,
      to: "/dashboard",
      action: "Add money",
    });
  }
  if (tips.length === 0) {
    tips.push({
      id: "all-good",
      level: "info",
      text: "Nothing to flag right now. Keep it up.",
    });
  }

  tips.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  return { facts, tips: tips.slice(0, 4) };
}