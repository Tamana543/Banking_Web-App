import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../components/common/TransactionSkeleton";
import ActionModal from "../components/common/ActionModel";
import useApiAction from "../hooks/useApiAction";
import { getUserDetails } from "../api/adminApi";
import { ACTIONS, getStatus } from "../util/adminUserActions";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import "../styles/dashboard/dashboard.css";
import "../styles/profile.css";
import "../styles/recent-transacrions.css";

const TYPE_LABELS = {
  deposit: "Deposit",
  withdrawal: "Withdrawal",
  transfer: "Transfer",
  loan: "Loan",
};
const money = (value) => `$${Number(value || 0).toLocaleString()}`;
const formatDate = (value) => value ? new Date(value).toLocaleString() : "Never";

function AdminUserDetail(){
const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { execute, loading: acting } = useApiAction();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState(null);

  const loadDetails = async () => {
    try {
      const data = await getUserDetails(id);
      setDetails(data);
    } catch (error) {
      setDetails(null);
      showToast(handleApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadDetails();
  }, [id]);
  const handleAction = async () => {
    await execute(
      () => ACTIONS[selectedAction].run(id),
      ACTIONS[selectedAction].success
    );
    setSelectedAction(null);
    await loadDetails();
  };
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardHeader />
        <TransactionSkeleton />
      </DashboardLayout>
    );
  }

  if (!details) {
    return (
      <DashboardLayout>
        <DashboardHeader />
        <div className="empty-state">
          <h4>Account not found</h4>
          <button
            type="button"
            className="profile-btn"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const { user: u, stats, recentTransactions, loans, savingsGoals } = details;
  const status = getStatus(u);
  return(
     <DashboardLayout>
       <DashboardHeader />
      <section className="profile-page">
        <div className="profile-card">
          <h2>{u.firstName} {u.lastName}</h2>
          <p>{u.email}</p>
          <span className={`transaction-status ${status.className}`}>
            {status.label}
          </span>
          <button
            type="button"
            className="profile-btn"
            onClick={() => navigate("/admin/users")}
          >
            Back to Users
          </button>
          {u.role === "user" &&
            (u.isSuspended ? (
              <button
                type="button"
                className="profile-btn"
                onClick={() => setSelectedAction("reactivate")}
              >
                Reactivate
              </button>
            ) : (
              <>
                {status.label === "Locked" && (
                  <button
                    type="button"
                    className="profile-btn"
                    onClick={() => setSelectedAction("unlock")}
                  >
                    Unlock
                  </button>
                )}
                <button
                  type="button"
                  className="profile-btn"
                  onClick={() => setSelectedAction("suspend")}
                >
                  Suspend
                </button>
              </>
            ))}
        </div>

        <div className="profile-details">
          <div className="profile-info">
            <h3>Account Details</h3>
            <div className="info-row">
              <span>Role</span>
              <strong>{u.role}</strong>
            </div>
            <div className="info-row">
              <span>Balance</span>
              <strong>{money(u.balance)}</strong>
            </div>
            <div className="info-row">
              <span>Member since</span>
              <strong>{new Date(u.createdAt).toLocaleDateString()}</strong>
            </div>
            <div className="info-row">
              <span>Last login</span>
              <strong>{formatDate(u.lastLogin)}</strong>
            </div>
            <div className="info-row">
              <span>Email verified</span>
              <strong>{u.isVerified ? "Yes" : "No"}</strong>
            </div>
            {u.isSuspended && (
              <div className="info-row">
                <span>Suspended since</span>
                <strong>{formatDate(u.suspendedAt)}</strong>
              </div>
            )}
          </div>

          <div className="profile-info">
            <h3>Activity Summary</h3>
            <div className="info-row">
              <span>Deposits ({stats.deposit.count})</span>
              <strong>{money(stats.deposit.total)}</strong>
            </div>
            <div className="info-row">
              <span>Withdrawals, incl. savings ({stats.withdrawal.count})</span>
              <strong>{money(stats.withdrawal.total)}</strong>
            </div>
            <div className="info-row">
              <span>Transfers sent ({stats.transfer.count})</span>
              <strong>{money(stats.transfer.total)}</strong>
            </div>
            <div className="info-row">
              <span>Approved loans ({stats.loan.count})</span>
              <strong>{money(stats.loan.total)}</strong>
            </div>
          </div>

          <div className="profile-info">
            <h3>Loans</h3>
            {loans.length === 0 ? (
              <div className="info-row">
                <span>No loan requests</span>
              </div>
            ) : (
              loans.map((loan) => (
                <div key={loan._id} className="info-row">
                  <span>{loan.description} ({loan.status})</span>
                  <strong>{money(loan.amount)}</strong>
                </div>
              ))
            )}
          </div>

          <div className="profile-info">
            <h3>Savings Goals</h3>
            {savingsGoals.length === 0 ? (
              <div className="info-row">
                <span>No savings goals</span>
              </div>
            ) : (
              savingsGoals.map((goal) => (
                <div key={goal._id} className="info-row">
                  <span>{goal.name} ({goal.status})</span>
                  <strong>
                    {money(goal.currentAmount)} / {money(goal.targetAmount)}
                  </strong>
                </div>
              ))
            )}
          </div>

          <div className="profile-info">
            <h3>Recent Transactions</h3>
            {recentTransactions.length === 0 ? (
              <div className="info-row">
                <span>No transactions yet</span>
              </div>
            ) : (
              recentTransactions.map((t) => (
                <div key={t._id} className="info-row">
                  <span>
                    {TYPE_LABELS[t.type] || t.type} · {t.status} ·{" "}
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>
                  <strong>{money(t.amount)}</strong>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {selectedAction && (
        <ActionModal
          isOpen
          title={ACTIONS[selectedAction].title}
          submitText={ACTIONS[selectedAction].submitText}
          loading={acting}
          onClose={() => setSelectedAction(null)}
          onSubmit={handleAction}
        >
          <p>
            <strong>Account</strong>
            <br />
            {u.firstName} {u.lastName} ({u.email})
          </p>
          <br />
          <p>{ACTIONS[selectedAction].warning}</p>
        </ActionModal>
      )}   
     </DashboardLayout>
  )
}