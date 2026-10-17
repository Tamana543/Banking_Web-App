import { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../components/common/TransactionSkeleton";
import ActionModal from "../components/common/ActionModel";
import useApiAction from "../hooks/useApiAction";
import { getAllLoans, approveLoan, rejectLoan } from "../api/adminApi";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import "../styles/dashboard/dashboard.css";
import "../styles/recent-transacrions.css";

function AdminLoans() {
  const { showToast } = useToast();
  const { execute, loading: acting } = useApiAction();
  const [loans, setLoans] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selected, setSelected] = useState(null);

  const loadLoans = async () => {
    try {
      setListLoading(true);
      const data = await getAllLoans(statusFilter);
      setLoans(data.loans);
    } catch (error) {
      showToast(handleApiError(error), "error");
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [statusFilter]);

  const handleDecision = async () => {
    const { loan, action } = selected;
    await execute(
      () => (action === "approve" ? approveLoan(loan._id) : rejectLoan(loan._id)),
      action === "approve"
        ? "Loan approved and funds credited."
        : "Loan request rejected."
    );
    setSelected(null);
    await loadLoans();
  };

  return ();
}

export default AdminLoans;