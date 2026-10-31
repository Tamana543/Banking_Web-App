import { useEffect, useState } from "react";
import { Download,FileText } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { downloadCsv, formatCsvDate } from "../util/exportCsv";
import { generateTransactionId } from "../util/transactionId";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import TransactionList from "../components/dashboard/TransactionList";
import useTransactions from "../hooks/useTransactions";
import { getTransactions } from "../api/transactionApi";
import ActionModal from "../components/common/ActionModel";
import { getCurrentUser } from "../api/authApi";
import handleApiError from "../util/handleApiError";
import { generateStatementPdf } from "../util/statementPdf";
import "../styles/dashboard/dashboard.css";
function Transactions() {
  // states 
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const { transactions, loading, } = useTransactions();
    const { showToast } = useToast();
    const [showStatement, setShowStatement] = useState(false);
    const [statementFrom, setStatementFrom] = useState("");
    const [statementTo, setStatementTo] = useState("");
    const [generating, setGenerating] = useState(false);
    const [printMode, setPrintMode] = useState(false);

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
    const openStatement = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setStatementFrom(formatCsvDate(start).slice(0, 10));
    setStatementTo(formatCsvDate(end).slice(0, 10));
    setPrintMode(false);
    setShowStatement(true);
  };

    const handleStatement = async () => {
    if (!statementFrom || !statementTo) {
      showToast("Choose both dates.", "error");
      return;
    }
    if (statementFrom > statementTo) {
      showToast("The start date must be before the end date.", "error");
      return;
    }
    const printWindow = printMode ? window.open("", "_blank") : null;
    try {
      setGenerating(true);
      const data = await getCurrentUser();
      const count = generateStatementPdf({
        user: data.user,
        transactions,
        from: statementFrom,
        to: statementTo,
        mode: printMode ? "print" : "download",
        printWindow,
      });
      showToast(
        printMode
          ? "Statement opened for printing."
          : `Statement ready (${count} transactions).`,
        "success"
      );
      setShowStatement(false);
    } catch (error) {
      if (printWindow) printWindow.close();
      showToast(handleApiError(error), "error");
    } finally {
      setGenerating(false);
    }
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
        <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
           <div className="export-actions">
        <button type="button" className="export-btn" onClick={handleExport} disabled={sortedTransactions.length === 0} >
          <Download size={18} aria-hidden="true" />
          Export CSV
        </button>
        <button type="button" className="export-btn" onClick={openStatement} disabled={loading} >
          <FileText size={18} aria-hidden="true" />
          PDF Statement
        </button>
      </div>
    </div>
    <TransactionList title="Transaction History" transactions={sortedTransactions} loading={loading} />
      <ActionModal isOpen={showStatement} title="Account Statement" submitText={printMode ? "Print" : "Download PDF"} loading={generating} onClose={() => { if (!generating) setShowStatement(false); }} onSubmit={handleStatement} >
      <label htmlFor="statement-from">
        <strong>From</strong>
      </label>
      <input id="statement-from" type="date" max={statementTo || undefined} value={statementFrom} onChange={(e) => setStatementFrom(e.target.value)} style={{ colorScheme: "dark" }} />
      <br />
      <br />
      <label htmlFor="statement-to">
        <strong>To</strong>
      </label>
      <input id="statement-to" type="date" min={statementFrom || undefined} max={formatCsvDate(new Date()).slice(0, 10)} value={statementTo} onChange={(e) => setStatementTo(e.target.value)} style={{ colorScheme: "dark" }} />
    </ActionModal>
  </DashboardLayout>
);
}
export default Transactions;