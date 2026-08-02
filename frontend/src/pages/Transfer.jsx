import { useState, useEffect } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import HamburgerButton from "../components/dashboard/HamburgerButton";
import TransactionList from "../components/dashboard/TransactionList";
import ActionModal from "../components/common/ActionModel";
import ReceiptModal from "../components/common/ReceiptModal";
import {useToast} from "../context/ToastContext"
import {transferMoney,getTransactions, } from "../api/transactionApi";
import "../styles/dashboard/dashboard.css";
// hooks
import useTransactions from "../hooks/useTransactions";
import useApiAction from "../hooks/useApiAction";
import "../styles/transfer.css";
function Transfer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const {showToast} = useToast();
  const { transactions, loadTransactions, } = useTransactions();
  const {execute,loading} = useApiAction();
  const handleTransfer = async () => {
      const data = await execute(
        () =>
          transferMoney(
            recipientEmail,
            Number(transferAmount)
          ),
        "Transfer completed successfully."
      );
      if (!data) return;
      await loadTransactions();
      setReceipt(data.receipt);
      setRecipientEmail("");
      setTransferAmount("");
      setTimeout(() => {
        setShowReceipt(true);
      }, 500);
    };
  
  return (
    <div className="dashboard-layout">
      <HamburgerButton
        sidebarOpen={sidebarOpen}
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="dashboard">
        <DashboardHeader />
        <section className="transfer-page">
          <div className="transfer-card">
            <h2>Transfer Money</h2>
            <p>
              Send money instantly to another
              Bankist user.
            </p>
            <input
              type="email"
              placeholder="Recipient Email"
              value={recipientEmail}
              onChange={(e) =>
                setRecipientEmail(
                  e.target.value
                )
              }
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) =>
                setTransferAmount(
                  e.target.value
                )
              }
            />
            <button
              className="transfer-btn"
              onClick={() => {
                if (
                  !recipientEmail ||
                  !transferAmount
                ) {
                  showToast("Please fill all fields.","error");
                  return;
                }
                if (
                  Number(transferAmount) <= 0
                ) {
                  showToast("Enter a valid amount.","error");
                  return;
                }
                setShowConfirm(true);
              }}
            >
              Transfer Money
            </button>
          </div>
        </section>
        <section className="transfer-history">
          <TransactionList
            title="Recent Transfers"
            transactions={transactions
              .filter(
                (transaction) =>
                  transaction.type ===
                  "transfer"
              )
              .slice(0, 5)}
          />
        </section>
      </main>
      {/* Confirmation Modal */}
      <ActionModal isOpen={showConfirm} title="Confirm Transfer" submitText="Confirm Transfer" loading={loading} onClose={() => setShowConfirm(false) } onSubmit={async () => { setShowConfirm(false); await handleTransfer() }}>
        <p> <strong>Recipient</strong> <br /> {recipientEmail} </p>
        <br />
        <p> <strong>Amount</strong> <br /> $ {Number( transferAmount ).toLocaleString()}</p>
      </ActionModal>
      {/* Receipt */}
      <ReceiptModal isOpen={showReceipt} receipt={receipt} onClose={() => { setShowReceipt(false); setReceipt(null);}}
      />
    </div>
  );
}
export default Transfer;