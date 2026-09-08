import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionList from "../components/dashboard/TransactionList";
import ActionModal from "../components/common/ActionModel";
import useApiAction from "../hooks/useApiAction";
import useTransactions from "../hooks/useTransactions";
import { useToast } from "../context/ToastContext";
import { applyLoan } from "../api/transactionApi";
import {
  isPositiveNumber,
  isEmpty,
} from "../util/validation";
import "../styles/loan.css";
function Loan() {
  const { showToast } = useToast();
  const [loanAmount, setLoanAmount] =
    useState("");
  const [purpose, setPurpose] =
    useState("");
  const [pin, setPin] =
    useState("");
  const [showConfirm, setShowConfirm] =
    useState(false);
  const {
    transactions,
    loadTransactions,
  } = useTransactions();
  const {
    execute,
    loading,
  } = useApiAction();
  const openConfirmation = () => {
    if (!isPositiveNumber(loanAmount)) {
      showToast(
        "Enter a valid loan amount.",
        "error"
      );
      return;
    }
    if (isEmpty(purpose)) {
      showToast(
        "Loan purpose is required.",
        "error"
      );
      return;
    }
    setPin("");
    setShowConfirm(true);
  };
  const closeConfirmation = () => {
    if (loading) return;
    setShowConfirm(false);
    setPin("");
  };
  const handleLoan = async () => {
    if (!/^\d{4}$/.test(pin)) {
      showToast(
        "PIN must contain exactly 4 digits.",
        "error"
      );
      return;
    }
    const data = await execute(
      () =>
        applyLoan(
          Number(loanAmount),
          purpose,
          pin
        ),
      "Loan approved successfully."
    );
    if (!data) return;
    setLoanAmount("");
    setPurpose("");
    setPin("");
    setShowConfirm(false);
    await loadTransactions();
  };
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="loan-page">
        <div className="loan-card">
          <h2>Apply for a Loan</h2>
          <p>
            Request a personal loan instantly.
          </p>
          <input type="number" min="0.01" step="0.01" placeholder="Loan Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value) } />
          <textarea placeholder="Purpose of Loan" value={purpose} onChange={(e) => setPurpose(e.target.value) } />
          <button type="button" className="loan-btn" onClick={openConfirmation} disabled={loading} > Apply for Loan
          </button>
        </div>
        <TransactionList
          title="Loan History"
          transactions={transactions.filter(
            (transaction) =>
              transaction.type === "loan"
          )}
        />
      </section>
      <ActionModal isOpen={showConfirm} title="Confirm Loan Application" submitText="Confirm Loan" loading={loading} onClose={closeConfirmation} onSubmit={handleLoan} >
        <p>
          <strong>Loan Amount</strong>
          <br />
          ${" "}
          {Number(
            loanAmount
          ).toLocaleString()}
        </p>
        <br />
        <p>
          <strong>Purpose</strong>
          <br />
          {purpose}
        </p>
        <br />
        <label htmlFor="loan-pin">
          <strong>Transaction PIN</strong>
        </label>
        <input id="loan-pin" type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="Enter 4-digit PIN" value={pin} onChange={(e) => { const value = e.target.value.replace(/\D/g, "").slice(0, 4);setPin(value); }} />
      </ActionModal>
    </DashboardLayout>
  );
}
export default Loan;