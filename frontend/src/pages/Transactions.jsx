import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import TransactionList from "../components/dashboard/TransactionList";
import { getTransactions } from "../api/transactionApi";

import "../styles/dashboard/dashboard.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard">
        <DashboardHeader />

        <TransactionList
          title="Transaction History"
          transactions={transactions}
        />
      </main>
    </div>
  );
}

export default Transactions;