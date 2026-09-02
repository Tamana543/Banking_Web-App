import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { getTransactions } from "../api/transactionApi";
import { getSavingsGoals } from "../api/savingsGoalApi";
import "../styles/analytics.css";
function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadAnalyticsData = async () => {
    try {
      const [transactionData, savingsData] = await Promise.all([
     getTransactions(),
     getSavingsGoals(),
     ]);
     setTransactions(transactionData.transactions || []);
     setSavingsGoals(
     savingsData.goals ||
     savingsData.savingsGoals ||
     []
     );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAnalyticsData();
  }, []);
  /* TRANSACTION ANALYTICS*/
  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "deposit" ||
        transaction.type === "loan"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "withdrawal" ||
        transaction.type === "transfer"
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0
    );
  // transaction-based balance
  const balance = totalIncome - totalExpense;
  /*  MONTHLY ANALYTICS*/
  const monthlyMap = {};
  transactions.forEach((transaction) => {
    const month = new Date(
      transaction.createdAt
    ).toLocaleString("default", {
      month: "short",
    });
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, income: 0, expense: 0, };
    }
    if ( transaction.type === "deposit" || transaction.type === "loan" ) {
      monthlyMap[month].income += Number(
        transaction.amount
      );
    }
    if ( transaction.type === "withdrawal" || transaction.type === "transfer" ) {
      monthlyMap[month].expense += Number(
        transaction.amount
      );
    }
  });
  const monthlyData = Object.values(monthlyMap);
  /*CATEGORY ANALYTICS*/
  const categoryData = [
    {
      name: "Withdrawals",
      value: transactions
        .filter((t) => t.type === "withdrawal")
        .reduce(
          (sum, t) => sum + Number(t.amount),
          0
        ),
    },
    {
      name: "Transfers",
      value: transactions
        .filter((t) => t.type === "transfer")
        .reduce(
          (sum, t) => sum + Number(t.amount),
          0
        ),
    },
    {
      name: "Loans",
      value: transactions
        .filter((t) => t.type === "loan")
        .reduce(
          (sum, t) => sum + Number(t.amount),
          0
        ),
    }, {
    name: "Savings",
    value: savingsGoals.reduce(
      (sum, goal) =>
        sum + Number(goal.currentAmount || 0),
      0
    ),
     },
  ];
      /* TRANSACTION */
  const totalTransactions = transactions.length;
  const averageTransaction =
    totalTransactions === 0
      ? 0
      : transactions.reduce(
          (sum, transaction) =>
            sum + Number(transaction.amount),
          0
        ) / totalTransactions;
  const highestTransaction =
    transactions.length > 0
      ? Math.max(
          ...transactions.map((transaction) =>
            Number(transaction.amount)
          )
        )
      : 0;
  const transactionTypes = {};
  transactions.forEach((transaction) => {
    transactionTypes[transaction.type] =
      (transactionTypes[transaction.type] || 0) + 1;
  });
  const mostUsedTransaction =
    Object.keys(transactionTypes).length
      ? Object.entries(transactionTypes).sort(
          (a, b) => b[1] - a[1]
        )[0][0]
      : "N/A";
  /* SAVINGS ANALYTICS*/
  const totalSavingsTarget = savingsGoals.reduce(
    (sum, goal) =>
      sum + Number(goal.targetAmount || 0),
    0
  );
  const totalSaved = savingsGoals.reduce(
    (sum, goal) =>
      sum + Number(goal.currentAmount || 0),
    0
  );
  const activeSavingsGoals = savingsGoals.filter(
    (goal) => goal.status !== "completed"
  ).length;
  const completedSavingsGoals = savingsGoals.filter(
    (goal) => goal.status === "completed"
  ).length;
  const overallSavingsProgress =
    totalSavingsTarget > 0
      ? Math.min(
          (totalSaved / totalSavingsTarget) * 100,
          100
        )
      : 0;
  const savingsGoalData = savingsGoals.map((goal) => ({
    name: goal.name,
    saved: Number(goal.currentAmount || 0),
    target: Number(goal.targetAmount || 0),
  }));
  const COLORS = [ "#d4af37", "#4f46e5", "#22c55e",];
    /* LOADING STATE*/
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardHeader />
        <div className="analytics-loading">
          <p>Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>
          Monitor your financial performance and
          spending insights.
        </p>
      </div>
      <section className="analytics-page">
        {/* OVERVIEW*/}
        <div className="analytics-overview">
          <div className="analytics-card income">
            <p>Total Income</p>
            <h2>
              ${totalIncome.toLocaleString()}
            </h2>
          </div>
          <div className="analytics-card expense">
            <p>Total Expense</p>
            <h2>
              ${totalExpense.toLocaleString()}
            </h2>
          </div>
          <div className="analytics-card balance">
            <p>Total Transactions</p>
            <h2>
              {transactions.length}
            </h2>
          </div>
        </div>
        {transactions.length === 0 ? (
          <div className="analytics-empty">
            <h3>No Analytics Available</h3>
            <p>
              Complete some transactions to unlock
              your financial insights.
            </p>
          </div>
        ) : (
          <div className="analytics-grid">
            <section className="analytics-card summary-card">
              <h3>Account Overview</h3>
              <div className="summary-list">
                <div>
                  <span>Total Income</span>
                  <strong>
                    ${totalIncome.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>Total Expenses</span>
                  <strong>
                    ${totalExpense.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span>Net Balance</span>
                  <strong>
                    $
                    {balance.toLocaleString()}
                  </strong>
                </div>
              </div>
            </section>
            <section className="analytics-card">
              <h3>Income vs Expense</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "Overview",
                      Income: totalIncome,
                      Expense: totalExpense,
                    },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Income" fill="#d4af37" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Expense" fill="#8b1e1e" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
            <section className="analytics-card">
              <h3>Monthly Spending</h3>
              <ResponsiveContainer width="100%" height={320} >
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="expense" stroke="#d4af37" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </section>
            <section className="analytics-card">
              <h3>Money Out by Category</h3>
              <ResponsiveContainer width="100%" height={320} >
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label >
                    {categoryData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </section>
            <section className="analytics-card">
              <h3>Transaction Insights</h3>
              <div className="insights-grid">
                <div className="insight-box">
                  <p>Highest Transaction</p>
                  <h2>
                    $
                    {highestTransaction.toLocaleString()}
                  </h2>
                </div>
                <div className="insight-box">
                  <p>Average Transaction</p>
                  <h2>
                    $
                    {averageTransaction.toFixed(2)}
                  </h2>
                </div>
                <div className="insight-box">
                  <p>Total Transactions</p>
                  <h2>
                    {totalTransactions}
                  </h2>
                </div>
                <div className="insight-box">
                  <p>Most Used Type</p>
                  <h2
                    style={{
                      textTransform: "capitalize",
                    }}
                  >
                    {mostUsedTransaction}
                  </h2>
                </div>
              </div>
            </section>
            <section className="analytics-card savings-analytics-card">
          <div className="savings-analytics-header">
          <div>
               <h3>Savings Goals</h3>
               <p>
               Track your progress toward your savings targets.
               </p>
          </div>
          <span className="savings-progress-label">
               {overallSavingsProgress.toFixed(0)}%
          </span>
          </div>
          {savingsGoals.length === 0 ? (
          <div className="savings-analytics-empty">
               <h4>No Savings Goals Yet</h4>
               <p>
               Create a savings goal to start tracking
               your progress here.
               </p>
          </div>
          ) : (
          <>
               <div className="savings-analytics-stats">
               <div className="savings-stat-box">
                    <span>Total Saved</span>
                    <strong>
                    ${totalSaved.toLocaleString()}
                    </strong>
               </div>
               <div className="savings-stat-box">
                    <span>Total Target</span>
                    <strong>
                    ${totalSavingsTarget.toLocaleString()}
                    </strong>
               </div>
               <div className="savings-stat-box">
                    <span>Active Goals</span>
                    <strong>
                    {activeSavingsGoals}
                    </strong>
               </div>
               <div className="savings-stat-box">
                    <span>Completed</span>
                    <strong>
                    {completedSavingsGoals}
                    </strong>
               </div>
               </div>
               <div className="savings-overall-progress">
               <div className="savings-progress-track">
                    <div
                    className="savings-progress-fill"
                    style={{
                    width: `${overallSavingsProgress}%`,
                    }}
                    />
               </div>
               <div className="savings-progress-values">
                    <span>
                    ${totalSaved.toLocaleString()}
                    </span>
                    <span>
                    ${totalSavingsTarget.toLocaleString()}
                    </span>
               </div>
               </div>
               <div className="savings-goals-chart">
               <h4>Goal Progress</h4>
               <ResponsiveContainer
                    width="100%"
                    height={190}
               >
                    <BarChart
                    data={savingsGoalData}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5, }} >
                    <CartesianGrid
                    strokeDasharray="3 3"
                    />
                    <XAxis
                    dataKey="name"
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="saved" name="Saved" fill="#d4af37" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="target" name="Target" fill="#555" radius={[6, 6, 0, 0]} />
                    </BarChart>
               </ResponsiveContainer>
               </div>
          </>
          )}
                    </section>
                    </div>
               )}
      </section>
    </DashboardLayout>
    );
}
export default Analytics;