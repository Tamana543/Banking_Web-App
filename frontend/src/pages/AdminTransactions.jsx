import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../components/common/TransactionSkeleton";
import { getAllTransactions } from "../api/adminApi";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import { generateTransactionId } from "../util/transactionId";
import "../styles/dashboard/dashboard.css";
import "../styles/recent-transacrions.css";
import "../styles/components/modal.css";

const TYPE_LABELS = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  loan: "Loan",
};

function AdminTransactions() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const data = await getAllTransactions({
          page,
          type: typeFilter,
          status: statusFilter,
        });
        setTransactions(data.transactions);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        showToast(handleApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [page, typeFilter, statusFilter]);
  return (
     <DashboardLayout>
     <DashboardHeader/>
     <section className="recent-transactions" aria-labelledby="admin-transactions-title">
          <h3 id="admin-transactions-title">All Transactions ({total})</h3>
        <div className="transaction-toolbar">
          <div className="transaction-filter">
            <select
              aria-label="Filter by type"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="transfer">Transfers</option>
              <option value="loan">Loans</option>
            </select>
          </div>

          
          </div>
     </section>

     </DashboardLayout>
  )
}
