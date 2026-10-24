import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../../components/common/TransactionSkeleton";
import ActionModal from "../../components/common/ActionModel";
import useApiAction from "../../hooks/useApiAction";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../api/adminApi";
import { ACTIONS, getStatus } from "../../util/adminUserActions";
import { useToast } from "../../context/ToastContext";
import handleApiError from "../../util/handleApiError";
import "../styles/dashboard/dashboard.css";
import "../styles/recent-transacrions.css";



function AdminUsers() {
    const navigate = useNavigate();
  const { showToast } = useToast();
  const { execute, loading: acting } = useApiAction();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      showToast(handleApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

 

  const handleAction = async () => {
    const { user, action } = selected;
    const config = ACTIONS[action];
    await execute(() => config.run(user._id), config.success);
    setSelected(null);
    await loadUsers();
  };
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="recent-transactions" aria-labelledby="admin-users-title">
        <h3 id="admin-users-title">All Users ({total})</h3>
        {loading ? (
          <TransactionSkeleton />
        ) : users.length === 0 ? (
          <div className="empty-state">
            <h4>No users found</h4>
          </div>
        ) : (
          <div className="transaction-list">
            {users.map((u) => (
              <div key={u._id} className="transaction-item">
                <div className="transaction-main">
                  <div className="transaction-category">
                    <h4>{u.firstName} {u.lastName}</h4>
                  </div>
                  <span>{u.email}</span>
                  <small className="transaction-date">
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </small>
                  <small className="transaction-reference">Role: {u.role}</small>
                </div>
                <div className="transaction-right">
                  <strong>${Number(u.balance).toLocaleString()}</strong>
                  <span className={`transaction-status ${getStatus(u).className}`}>
                    {getStatus(u).label}
                  </span>
                  <div className="admin-loan-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => navigate(`/admin/users/${u._id}`)}
                    >
                      View
                    </button>
                    {u.role === "user" &&
                      (u.isSuspended ? (
                        <button
                          type="button"
                          className="submit-btn"
                          onClick={() => setSelected({ user: u, action: "reactivate" })}
                        >
                          Reactivate
                        </button>
                      ) : (
                        <>
                          {getStatus(u).label === "Locked" && (
                            <button
                              type="button"
                              className="submit-btn"
                              onClick={() => setSelected({ user: u, action: "unlock" })}
                            >
                              Unlock
                            </button>
                          )}
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setSelected({ user: u, action: "suspend" })}
                          >
                            Suspend
                          </button>
                        </>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
            {selected && (
        <ActionModal isOpen title={ACTIONS[selected.action].title} submitText={ACTIONS[selected.action].submitText} loading={acting} onClose={() => setSelected(null)} onSubmit={handleAction} >
          <p>
            <strong>Account</strong>
            <br />
            {selected.user.firstName} {selected.user.lastName} ({selected.user.email})
          </p>
          <br />
          <p>{ACTIONS[selected.action].warning}</p>
        </ActionModal>
      )}
    </DashboardLayout>
  );
}
export default AdminUsers;