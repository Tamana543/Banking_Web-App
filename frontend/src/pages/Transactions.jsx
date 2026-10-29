import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { downloadCsv, formatCsvDate } from "../util/exportCsv";
import { generateTransactionId } from "../util/transactionId";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import TransactionList from "../components/dashboard/TransactionList";
import useTransactions from "../hooks/useTransactions";
import { getTransactions } from "../api/transactionApi";
import "../styles/dashboard/dashboard.css";
function Transactions() {
  // states 
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const { transactions, loading, } = useTransactions();
    const { showToast } = useToast();
  
     
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
    const handleExport = () => {
    const headers = ["Date", "Reference", "Type", "Description", "Amount", "Status"];
    const rows = sortedTransactions.map((t) => [
      formatCsvDate(t.createdAt),
      generateTransactionId(t._id),
      t.type,
      t.description || "",
      Number(t.amount).toFixed(2),
      t.type === "loan" && t.repaidAt ? "repaid" : t.status,
    ]);
    const today = formatCsvDate(new Date()).slice(0, 10);
    downloadCsv(`bankist-transactions-${today}.csv`, headers, rows);
    showToast(`Exported ${rows.length} transactions.`, "success");
  };
 return (
  <DashboardLayout>
    <DashboardHeader />
    <div className="transaction-toolbar">
      <div className="transaction-sort">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="" disabled>Sort</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>
      <div className="transaction-search">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="transaction-filter">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="transfer">Transfers</option>
          <option value="loan">Loans</option>
        </select>
      </div>
    </div>
    <TransactionList
      title="Transaction History"
      transactions={sortedTransactions}
    loading={loading}
    />
  </DashboardLayout>
);
}
export default Transactions;