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
     </DashboardLayout>
  )
}
export default AdminAuditLog;