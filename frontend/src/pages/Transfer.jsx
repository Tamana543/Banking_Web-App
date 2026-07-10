import { useState } from "react";

import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import HamburgerButton from "../components/dashboard/HamburgerButton";

import ActionModal from "../components/common/ActionModel";
import AlertMessage from "../components/common/AlertMessage";
import ReceiptModal from "../components/common/ReceiptModal";

import { transferMoney } from "../api/transactionApi";

import "../styles/dashboard/dashboard.css";
import "../styles/transfer.css"

function Transfer() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [recipientEmail, setRecipientEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const [receipt, setReceipt] = useState(null);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleTransfer = async () => {
    try {
      const data = await transferMoney(
        recipientEmail,
        Number(transferAmount)
      );

      setAlert({
        type: "success",
        message: "Transfer completed successfully.",
      });

      setReceipt(data.receipt);

      setRecipientEmail("");
      setTransferAmount("");

      setTimeout(() => {
        setShowReceipt(true);
      }, 500);

    } catch (error) {
      setAlert({
        type: "error",
        message: error.message,
      });
    }
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
              Send money instantly to another Bankist user.
            </p>

            <input
              type="email"
              placeholder="Recipient Email"
              value={recipientEmail}
              onChange={(e) =>
                setRecipientEmail(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) =>
                setTransferAmount(e.target.value)
              }
            />

            <button
              className="transfer-btn"
              onClick={() => {

                if (
                  !recipientEmail ||
                  !transferAmount
                ) {
                  setAlert({
                    type: "error",
                    message:
                      "Please fill all fields.",
                  });

                  return;
                }

                if (
                  Number(transferAmount) <= 0
                ) {
                  setAlert({
                    type: "error",
                    message:
                      "Enter a valid amount.",
                  });

                  return;
                }

                setShowConfirm(true);
              }}
            >
              Transfer Money
            </button>

            <AlertMessage
              type={alert.type}
              message={alert.message}
            />

          </div>

        </section>

      </main>

      <ActionModal
        isOpen={showConfirm}
        title="Confirm Transfer"
        submitText="Confirm Transfer"
        onClose={() =>
          setShowConfirm(false)
        }
        onSubmit={async () => {
          setShowConfirm(false);
          await handleTransfer();
        }}
      >

        <p>

          <strong>Recipient</strong>

          <br />

          {recipientEmail}

        </p>

        <br />

        <p>

          <strong>Amount</strong>

          <br />

          $
          {Number(
            transferAmount
          ).toLocaleString()}

        </p>

      </ActionModal>

      <ReceiptModal
        isOpen={showReceipt}
        receipt={receipt}
        onClose={() => {
          setShowReceipt(false);
          setReceipt(null);
        }}
      />

    </div>
  );
}

export default Transfer;