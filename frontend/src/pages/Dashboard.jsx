import "../styles/dashboard/dashboard.css";
import "../styles/dashboard/responsive.css";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import BalanceCard from "../components/dashboard/BalancedCard";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import TransactionList from "../components/dashboard/TransactionList";
import ActionModal from "../components/common/ActionModel";
import AlertMessage from "../components/common/AlertMessage";
import FinancialOverview from "../components/dashboard/financial_overview";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  depositMoney,
  withdrawMoney,
  getTransactions,
} from "../api/transactionApi";

import { getCurrentUser } from "../api/authApi";

function Dashboard() {
  const { setUser } = useAuth();

  const [transactions, setTransactions] = useState([]);

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const refreshDashboard = async () => {
    const userData = await getCurrentUser();

    setUser(userData.user);

    await loadTransactions();
  };

  //  Deposit 

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setAlert({
        type: "error",
        message: "Enter a valid amount.",
      });
      return;
    }

    try {
      await depositMoney(Number(depositAmount));

      await refreshDashboard();

      setAlert({
        type: "success",
        message: "Deposit completed successfully.",
      });

      setTimeout(() => {
        setAlert({
          type: "",
          message: "",
        });

        setDepositAmount("");
        setShowDepositModal(false);
      }, 1200);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message,
      });
    }
  };

  //  Withdraw 

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setAlert({
        type: "error",
        message: "Enter a valid amount.",
      });

      return;
    }

    try {
      await withdrawMoney(Number(withdrawAmount));

      await refreshDashboard();

      setAlert({
        type: "success",
        message: "Withdrawal completed successfully.",
      });

      setTimeout(() => {
        setAlert({
          type: "",
          message: "",
        });

        setWithdrawAmount("");
        setShowWithdrawModal(false);
      }, 1200);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message,
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="dashboard-grid">

        <div className="balance-section">
          <BalanceCard />
        </div>

        <div className="stats-section">
          <StatsCards
            transactions={transactions}
          />
        </div>

        <div className="overview-section">
          <FinancialOverview
            transactions={transactions}
          />
        </div>

        <div className="actions-section">
          <QuickActions
            onDeposit={() => setShowDepositModal(true)}
            onWithdraw={() => setShowWithdrawModal(true)}
          />
        </div>

        <div className="transactions-section">
          <TransactionList
            title="Recent Activity"
            transactions={transactions.slice(0, 5)}
          />
        </div>

      </div>

      {/* Deposit */}

      <ActionModal
        isOpen={showDepositModal}
        title="Deposit Amount"
        submitText="Deposit"
        onClose={() => {
          setShowDepositModal(false);
          setDepositAmount("");
          setAlert({
            type: "",
            message: "",
          });
        }}
        onSubmit={handleDeposit}
      >
        <input
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter amount"
          value={depositAmount}
          onChange={(e) =>
            setDepositAmount(e.target.value)
          }
        />

        <AlertMessage
          type={alert.type}
          message={alert.message}
        />
      </ActionModal>

      {/* Withdraw */}

      <ActionModal
        isOpen={showWithdrawModal}
        title="Withdraw Money"
        submitText="Withdraw"
        onClose={() => {
          setShowWithdrawModal(false);
          setWithdrawAmount("");
          setAlert({
            type: "",
            message: "",
          });
        }}
        onSubmit={handleWithdraw}
      >
        <input
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter amount"
          value={withdrawAmount}
          onChange={(e) =>
            setWithdrawAmount(e.target.value)
          }
        />

        <AlertMessage
          type={alert.type}
          message={alert.message}
        />
      </ActionModal>
    </DashboardLayout>
  );
}

export default Dashboard;