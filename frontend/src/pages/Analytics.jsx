import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import FinancialSummary from "../components/dashboard/FinancialSummary";
import { getTransactions } from "../api/transactionApi";
import "../styles/analytics.css";
function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const loadTransactions = async () => {
        try {
            const data =
                await getTransactions();
            setTransactions(
                data.transactions
            );
        }
        catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        loadTransactions();
    }, []);
    const income = transactions
        .filter(
            (transaction) =>
                transaction.type === "deposit"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );
    const expense = transactions
        .filter(
            (transaction) =>
                transaction.type === "withdrawal" ||
                transaction.type === "transfer"
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );
    const balance =
        income - expense;
    const savings =
        income - expense;
    return (
        <DashboardLayout>
            <DashboardHeader />
            <FinancialSummary
                balance={balance}
                income={income}
                expense={expense}
                savings={savings}
            />
           <section className="analytics-page">
               <div className="analytics-summary">
                    <div className="analytics-card income">
                         <span>Total Income</span>
                         <h2>
                              $
                              {
                                   transactions
                                   .filter(
                                        t =>
                                             t.type === "deposit" ||
                                             t.type === "loan"
                                   )
                                   .reduce(
                                        (sum, t) => sum + t.amount,
                                        0
                                   )
                                   .toLocaleString()
                              }
                         </h2>
                    </div>
                    <div className="analytics-card expense">
                         <span>Total Expense</span>
                         <h2>
                              $
                              {
                                   transactions
                                   .filter(
                                        t =>
                                             t.type === "withdrawal" ||
                                             t.type === "transfer"
                                   )
                                   .reduce(
                                        (sum, t) => sum + t.amount,
                                        0
                                   )
                                   .toLocaleString()
                              }
                         </h2>
                    </div>
                    <div className="analytics-card balance">
                         <span>Total Transactions</span>
                         <h2>
                              {transactions.length}
                         </h2>
                    </div>
               </div>
               <div className="analytics-grid">
                    <section className="analytics-card summary-card">
                         <h3>Financial Summary</h3>
                         <div className="summary-list">
                              <div>
                                   <span>Total Income</span>
                                   <strong>${totalIncome.toLocaleString()}</strong>
                              </div>
                              <div>
                                   <span>Total Expenses</span>
                                   <strong>${totalExpense.toLocaleString()}</strong>
                              </div>
                              <div>
                                   <span>Current Balance</span>
                                   <strong>
                                        ${(totalIncome - totalExpense).toLocaleString()}
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
                                   <CartesianGrid strokeDasharray="3 3" />
                                   <XAxis dataKey="name" />
                                   <YAxis />
                                   <Tooltip />
                                   <Legend />
                                   <Bar
                                        dataKey="Income"
                                        fill="#d4af37"
                                        radius={[8,8,0,0]}
                                   />
                                   <Bar
                                        dataKey="Expense"
                                        fill="#8b1e1e"
                                        radius={[8,8,0,0]}
                                   />
                              </BarChart>
                         </ResponsiveContainer>
                    </section>
                    <section className="analytics-card">
                         <h3>Monthly Spending</h3>
                         <ResponsiveContainer width="100%" height={320}>
                              <LineChart data={monthlyData}>
                                   <CartesianGrid strokeDasharray="3 3" />
                                   <XAxis dataKey="month" />
                                   <YAxis />
                                   <Tooltip />
                                   <Line
                                        type="monotone"
                                        dataKey="expense"
                                        stroke="#d4af37"
                                        strokeWidth={3}
                                   />
                              </LineChart>
                         </ResponsiveContainer>
                    </section>
                    </div>
               </section>
        </DashboardLayout>
    );
}
export default Analytics;