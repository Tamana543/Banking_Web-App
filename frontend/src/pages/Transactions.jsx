import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import TransactionList from "../components/dashboard/TransactionList";
import { getTransactions } from "../api/transactionApi";

import "../styles/dashboard/dashboard.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
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
     
  const filteredTransactions = transactions.filter(
          (transaction) => {
          const search = searchTerm.toLowerCase();
          const matchesSearch =
                transaction.type
                  .toLowerCase()
                  .includes(search) ||

                transaction.description
                  ?.toLowerCase()
                  .includes(search) ||

                transaction.status
                  .toLowerCase()
                  .includes(search);

              const matchesFilter =
                filter === "all"
                  ? true
                  : transaction.type === filter;

              return matchesSearch && matchesFilter;
          }
  );
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard">
        <DashboardHeader />
               <div className="transaction-search">
               <input
               type="text"
               placeholder="Search transactions..."
               value={searchTerm}
               onChange={(e) =>
                    setSearchTerm(e.target.value)
               }
               />
     </div>
        <TransactionList
          title="Transaction History"
          transactions={filteredTransactions}
        />
      </main>
    </div>
  );
}

export default Transactions;