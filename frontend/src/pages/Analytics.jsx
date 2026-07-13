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
                    <div className="analytics-panel">
                         <h3>
                              Income vs Expense
                         </h3>
                         <div className="chart-placeholder">
                              Chart Coming Next →
                         </div>
                    </div>
                    <div className="analytics-panel">
                         <h3>
                              Monthly Spending
                         </h3>
                         <div className="chart-placeholder">
                              Chart Coming Next →
                         </div>
                    </div>
               </div>
               </section>
        </DashboardLayout>
    );
}
export default Analytics;