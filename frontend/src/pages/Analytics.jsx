import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
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
    const totalIncome = transactions.filter(
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

     const balance = totalIncome - totalExpense; // remember this is not the user real balance we will fix that in future 
     const savings = balance;
     const monthlyMap = {};

     transactions.forEach((transaction) => {
     const month = new Date(
     transaction.createdAt
     ).toLocaleString("default", {
     month: "short",
     });

     if (!monthlyMap[month]) {
     monthlyMap[month] = {
          month,
          income: 0,
          expense: 0,
     };
     }

     if (
     transaction.type === "deposit" ||
     transaction.type === "loan"
     ) {
     monthlyMap[month].income += Number(
          transaction.amount
     );
     }

     if (
     transaction.type === "withdrawal" ||
     transaction.type === "transfer"
     ) {
     monthlyMap[month].expense += Number(
          transaction.amount
     );
     }
     });

     const monthlyData = Object.values(monthlyMap);
    return (
        <DashboardLayout>
            <DashboardHeader />
               <div className="analytics-header">
                    <h1>Analytics Dashboard</h1>

                    <p>
                         Monitor your financial performance and spending insights.
                    </p>
               </div>
     
           <section className="analytics-page">
               <div className="analytics-summary">
                    <div className="analytics-card income">
                         <p>Total Income</p>
                         <h2>
                              $ {totalIncome.toLocaleString()}
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
                         Complete some transactions to unlock your financial insights.
                    </p>

               </div>

               ) : (

               <div className="analytics-grid">
                    <section className="analytics-card summary-card">
                         <h3>Account Overview</h3>
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
                                   <span>Net Balance</span>
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
               )}
               </section>
        </DashboardLayout>
    );
}
export default Analytics;