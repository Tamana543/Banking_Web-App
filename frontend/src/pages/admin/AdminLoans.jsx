import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../../../components/common/TransactionSkeleton";
import ActionModal from "../../../components/common/ActionModel";
import useApiAction from "../../../hooks/useApiAction";
import { getAllLoans, approveLoan, rejectLoan } from "../../../api/adminApi";
import { useToast } from "../../../context/ToastContext";
import handleApiError from "../../../util/handleApiError";
import "../../styles/dashboard/dashboard.css";
import "../../styles/recent-transacrions.css";

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

  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="recent-transactions" aria-labelledby="admin-loans-title">
        <h3 id="admin-loans-title">Loan Requests ({loans.length})</h3>
        <div className="transaction-filter">
          <select
            aria-label="Filter loan requests by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="outstanding">Outstanding</option>
            <option value="repaid">Repaid</option>
            <option value="rejected">Rejected</option>
            <option value="">All</option>
          </select>
        </div>
        {listLoading ? (
          <TransactionSkeleton />
        ) : loans.length === 0 ? (
          <div className="empty-state">
            <h4>No loan requests</h4>
          </div>
        ) : (
          <div className="transaction-list">
            {loans.map((loan) => (
              <div key={loan._id} className="transaction-item">
                <div className="transaction-main">
                  <div className="transaction-category">
                    <h4>{loan.user?.firstName} {loan.user?.lastName}</h4>
                  </div>
                  <span>{loan.user?.email}</span>
                  <span>{loan.description}</span>
                  <small className="transaction-date">
                    {new Date(loan.createdAt).toLocaleString()}
                  </small>
                  {loan.reviewedBy && (
                    <small className="transaction-reference">
                      Reviewed by {loan.reviewedBy.firstName} {loan.reviewedBy.lastName}
                    </small>
                  )}
                  {loan.status === "approved" && (
                    <small className="transaction-reference">
                      Repaid ${Number(loan.repaidAmount || 0).toLocaleString()} of ${Number(loan.amount).toLocaleString()}
                      {loan.repaidAt ? " · fully repaid" : ""}
                    </small>
                  )}
                </div>
                <div className="transaction-right">
                  <strong>${Number(loan.amount).toLocaleString()}</strong>
                  <span className={`transaction-status ${loan.status}`}>
                    {loan.status}
                  </span>
                  {loan.status === "pending" && (
                    <div className="admin-loan-actions">
                      <button
                        type="button"
                        className="submit-btn"
                        onClick={() => setSelected({ loan, action: "approve" })}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => setSelected({ loan, action: "reject" })}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {selected && (
        <ActionModal
          isOpen
          title={selected.action === "approve" ? "Approve Loan Request" : "Reject Loan Request"}
          submitText={selected.action === "approve" ? "Approve Loan" : "Reject Loan"}
          loading={acting}
          onClose={() => setSelected(null)}
          onSubmit={handleDecision}
        >
          <p>
            <strong>Applicant</strong>
            <br />
            {selected.loan.user?.firstName} {selected.loan.user?.lastName} ({selected.loan.user?.email})
          </p>
          <br />
          <p>
            <strong>Amount</strong>
            <br />
            ${Number(selected.loan.amount).toLocaleString()}
          </p>
          <br />
          <p>
            <strong>Purpose</strong>
            <br />
            {selected.loan.description}
          </p>
          <br />
          <p>
            {selected.action === "approve"
              ? "This will credit the amount to the borrower's balance immediately."
              : "No money will move. The borrower will be able to apply again."}
          </p>
        </ActionModal>
      )}
    </DashboardLayout>
  );
}

export default AdminLoans;