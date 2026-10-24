import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../../components/common/TransactionSkeleton";
import { getAllTransactions } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import handleApiError from "../../util/handleApiError";
import { generateTransactionId } from "../../util/transactionId";
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
           <div className="transaction-filter">
            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
              {loading ? (
          <TransactionSkeleton />
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <h4>No transactions found</h4>
          </div>
        ) : (
          <div className="transaction-list">
            {transactions.map((t) => (
              <div key={t._id} className="transaction-item">
                <div className="transaction-main">
                  <div className="transaction-category">
                    <h4>{TYPE_LABELS[t.type] || t.type}</h4>
                  </div>
                  <span>
                    {t.user?.firstName} {t.user?.lastName} ({t.user?.email})
                  </span>
                  <span>{t.description}</span>
                  <small className="transaction-date">
                    {new Date(t.createdAt).toLocaleString()}
                  </small>
                  <small className="transaction-reference">
                    {generateTransactionId(t._id)}
                  </small>
                </div>
                <div className="transaction-right">
                  <strong>${Number(t.amount).toLocaleString()}</strong>
                  <span className={`transaction-status ${t.status}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {pages > 1 && (
          <div className="admin-pagination">
            <button
              type="button"
              className="cancel-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>Page {page} of {pages}</span>
            <button
              type="button"
              className="cancel-btn"
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
         
     </section>

     </DashboardLayout>
  )
}

export default AdminTransactions;