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
            <section className="analytics-card">
                <h2>
                    Income vs Expense
                </h2>
            </section>
            <section className="analytics-card">
                <h2>
                    Monthly Cash Flow
                </h2>
            </section>
            <section className="analytics-card">
                <h2>
                    Spending by Category
                </h2>
            </section>
            <section className="analytics-card">
                <h2>
                    Transaction Insights
                </h2>
            </section>
            <section className="analytics-card">
                <h2>
                    Monthly Report
                </h2>
            </section>
        </DashboardLayout>
    );
}
export default Analytics;