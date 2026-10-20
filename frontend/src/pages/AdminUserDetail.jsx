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
          
     </DashboardLayout>
  )
}