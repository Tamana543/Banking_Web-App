import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../../components/common/TransactionSkeleton";
import { getPlatformStats } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";
import handleApiError from "../../util/handleApiError";
import "../../styles/dashboard/dashboard.css";
import "../../styles/dashboard/stats-card.css";
import "../../styles/components/modal.css";
import "../../styles/admin.css";

const money = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function StatCard({ label, value, hint, children }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <p className="admin-stat-value">{value}</p>
      {hint && <small className="admin-stat-hint">{hint}</small>}
      {children}
    </div>
  );
}

function AdminDashboard() {
     const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPlatformStats();
        setStats(data);
      } catch (error) {
        showToast(handleApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

   return (
    <DashboardLayout>
      <DashboardHeader />
      {loading ? (
        <TransactionSkeleton />
      ) : !stats ? (
        <div className="empty-state">
          <h4>Unable to load platform statistics</h4>
        </div>
      ) : (
        <>
          <h3 className="admin-section-title">Users</h3>
          <div className="admin-stats-grid">
            <StatCard label="Total users" value={stats.users.total} />
            <StatCard label="New this month" value={stats.users.newThisMonth} />
            <StatCard label="Suspended" value={stats.users.suspended} />
            <StatCard label="Locked out" value={stats.users.locked} />
          </div>

          <h3 className="admin-section-title">Money</h3>
          <div className="admin-stats-grid">
            <StatCard
              label="Platform balance"
              value={money(stats.users.totalBalance)}
              hint="Held across all customer accounts"
            />
            <StatCard
              label="Deposits this month"
              value={money(stats.transactions.month.deposit.total)}
              hint={`${stats.transactions.month.deposit.count} transactions`}
            />
            <StatCard
              label="Withdrawals this month"
              value={money(stats.transactions.month.withdrawal.total)}
              hint={`${stats.transactions.month.withdrawal.count} transactions`}
            />
            <StatCard
              label="Transfers this month"
              value={money(stats.transactions.month.transfer.total)}
              hint={`${stats.transactions.month.transfer.count} transactions`}
            />
          </div>

          <h3 className="admin-section-title">Activity and loans</h3>
          <div className="admin-stats-grid">
            <StatCard label="Total transactions" value={stats.transactions.total} />
            <StatCard label="Transactions today" value={stats.transactions.today} />
            <StatCard
              label="Pending loans"
              value={stats.loans.pending.count}
              hint={`${money(stats.loans.pending.total)} awaiting review`}
            >
              {stats.loans.pending.count > 0 && (
                <button
                  type="button"
                  className="submit-btn admin-card-btn"
                  onClick={() => navigate("/admin/loans")}
                >
                  Review
                </button>
              )}
            </StatCard>
            <StatCard
              label="Approved loans"
              value={money(stats.loans.approved.total)}
              hint={`${stats.loans.approved.count} loans approved`}
            />
            <StatCard
              label="Outstanding loans"
              value={money(stats.loans.outstanding.total)}
              hint={`${stats.loans.outstanding.count} loans being repaid`}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
export default AdminDashboard;