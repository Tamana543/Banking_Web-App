import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../../components/common/TransactionSkeleton";
import { getAuditLogs } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import handleApiError from "../../util/handleApiError";
import "../../styles/dashboard/dashboard.css";
import "../../styles/recent-transacrions.css";
import "../../styles/components/modal.css";

const ACTIONS = {
  loan_approved: { label: "Loan approved", badge: "Approved", style: "approved" },
  loan_rejected: { label: "Loan rejected", badge: "Rejected", style: "rejected" },
  user_suspended: { label: "Account suspended", badge: "Suspended", style: "rejected" },
  user_reactivated: { label: "Account reactivated", badge: "Reactivated", style: "completed" },
  user_unlocked: { label: "Account unlocked", badge: "Unlocked", style: "pending" },
};

function AdminAuditLog(){
 const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("");
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const data = await getAuditLogs({ page, action: actionFilter });
        setLogs(data.logs);
        setTotal(data.total);
        setPages(data.pages);
      } catch (error) {
        showToast(handleApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [page, actionFilter]);

  return(
     <DashboardLayout>
          <DashboardHeader/>
          <section className="recent-transactions" aria-labelledby="admin-audit-title">
               <h3 id="admin-audit-title">Activity Log ({total})</h3>
          <div className="transaction-toolbar">
               <div className="transaction-filter">
                    <select aria-label="Filter by action" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }} >
                    <option value="">All actions</option>
                    <option value="loan_approved">Loan approved</option>
                    <option value="loan_rejected">Loan rejected</option>
                    <option value="user_suspended">Account suspended</option>
                    <option value="user_reactivated">Account reactivated</option>
                    <option value="user_unlocked">Account unlocked</option>
                    </select>
               </div>
          </div>
           {loading ? (
          <TransactionSkeleton />
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <h4>No admin activity yet</h4>
          </div>
        ) : (
          <div className="transaction-list">
            {logs.map((log) => {
              const info = ACTIONS[log.action] || {
                label: log.action,
                badge: log.action,
                style: "pending",
              };
              return (
                <div key={log._id} className="transaction-item">
                  <div className="transaction-main">
                    <div className="transaction-category">
                      <h4>{info.label}</h4>
                    </div>
                    <span>{log.details}</span>
                    <small className="transaction-date">
                      {new Date(log.createdAt).toLocaleString()}
                    </small>
                    <small className="transaction-reference">
                      By {log.admin?.firstName} {log.admin?.lastName}
                    </small>
                  </div>
                  <div className="transaction-right">
                    <span className={`transaction-status ${info.style}`}>
                      {info.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
          </section>
     </DashboardLayout>
  )
}
export default AdminAuditLog;