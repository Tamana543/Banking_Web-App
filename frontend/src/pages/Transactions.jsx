import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import TransactionList from "../components/dashboard/TransactionList";
import { getTransactions } from "../api/transactionApi";

import "../styles/dashboard/dashboard.css";

function Transactions() {
  // states 
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

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
     
  const filteredTransactions = transactions.filter((transaction) => {

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

});

  const sortedTransactions = [...filteredTransactions].sort(// never forgot that sort change the main array so get a copy
      (a, b) => {

          switch (sortBy) {

              case "oldest":
                  return new Date(a.createdAt) - new Date(b.createdAt);

              case "highest":
                  return b.amount - a.amount;

              case "lowest":
                  return a.amount - b.amount;

              case "newest":
              default:
                  return new Date(b.createdAt) - new Date(a.createdAt);

          }

      }
  );
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard">
        <DashboardHeader />
               <div className="transaction-toolbar">

          <div className="transaction-search">

              <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e)=>
                      setSearchTerm(e.target.value)
                  }
              />

          </div>

          <div className="transaction-filter">

              <select
                  value={filter}
                  onChange={(e)=>
                      setFilter(e.target.value)
                  }
              >

                  <option value="all">
                      All
                  </option>

                  <option value="deposit">
                      Deposits
                  </option>

                  <option value="withdrawal">
                      Withdrawals
                  </option>

                  <option value="transfer">
                      Transfers
                  </option>

                  <option value="loan">
                      Loans
                  </option>

              </select>

          </div>
          <div className="transaction-sort">

            <select
                value={sortBy}
                onChange={(e)=>
                    setSortBy(e.target.value)
                }
            >

                <option value="newest">
                    Newest
                </option>

                <option value="oldest">
                    Oldest
                </option>

                <option value="highest">
                    Highest Amount
                </option>

                <option value="lowest">
                    Lowest Amount
                </option>

            </select>

        </div>

      </div>
        <TransactionList
          title="Transaction History"
          transactions={sortedTransactions}
        />
      </main>
    </div>
  );
}

export default Transactions;