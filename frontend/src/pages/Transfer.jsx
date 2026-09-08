import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionList from "../components/dashboard/TransactionList";
import ActionModal from "../components/common/ActionModel";
import ReceiptModal from "../components/common/ReceiptModal";
import { useToast } from "../context/ToastContext";
import { transferMoney } from "../api/transactionApi";
import useTransactions from "../hooks/useTransactions";
import useApiAction from "../hooks/useApiAction";
import { isPositiveNumber } from "../util/validation";
import "../styles/transfer.css";
function Transfer() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [pin, setPin] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const { showToast } = useToast();
  const {
    transactions,
    loadTransactions,
  } = useTransactions();
  const {
    execute,
    loading,
  } = useApiAction();
  const handleTransfer = async () => {
    if (!pin || !/^\d{4}$/.test(pin)) {
      showToast(
        "PIN must contain exactly 4 digits.",
        "error"
      );
      return;
    }
    const data = await execute(
      () =>
        transferMoney(
          recipientEmail,
          Number(transferAmount),
          pin
        ),
      "Transfer completed successfully."
    );
    if (!data) return;
    await loadTransactions();
    setReceipt(data.receipt);
    setRecipientEmail("");
    setTransferAmount("");
    setPin("");
    setShowConfirm(false);
    setTimeout(() => {
      setShowReceipt(true);
    }, 500);
  };
  const openConfirmation = () => {
    if (!recipientEmail || !transferAmount) {
      showToast(
        "Please fill all fields.",
        "error"
      );
      return;
    }
    if (!isPositiveNumber(transferAmount)) {
      showToast(
        "Enter a valid amount.",
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
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="transfer-page">
        <div className="transfer-card">
          <h2>Transfer Money</h2>
          <p>
            Send money instantly to another
            Bankist user.
          </p>
          <input type="email" placeholder="Recipient Email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value) } />
          <input type="number" min="0.01" step="0.01" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value) } />
          <button type="button" className="transfer-btn" onClick={openConfirmation} > Transfer Money </button>
        </div>
      </section>
      <section className="transfer-history">
        <TransactionList title="Recent Transfers" transactions={transactions .filter( (transaction) => transaction.type === "transfer" ) .slice(0, 5)} />
      </section>
      <ActionModal isOpen={showConfirm} title="Confirm Transfer" submitText="Confirm Transfer" loading={loading} onClose={closeConfirmation} onSubmit={handleTransfer} >
        <p>
          <strong>Recipient</strong>
          <br />
          {recipientEmail}
        </p>
        <br />
        <p>
          <strong>Amount</strong>
          <br />
          ${" "}
          {Number(
            transferAmount
          ).toLocaleString()}
        </p>
        <br />
        <label htmlFor="transfer-pin">
          <strong>Transaction PIN</strong>
        </label>
        <input id="transfer-pin" type="password" inputMode="numeric" autoComplete="off" maxLength={4} placeholder="Enter 4-digit PIN" value={pin} onChange={(e) => { const value = e.target.value.replace(/\D/g, "").slice(0, 4);setPin(value); }} />
      </ActionModal>
      <ReceiptModal isOpen={showReceipt} receipt={receipt} onClose={() => { setShowReceipt(false); setReceipt(null); }} />
    </DashboardLayout>
  );
}
export default Transfer;