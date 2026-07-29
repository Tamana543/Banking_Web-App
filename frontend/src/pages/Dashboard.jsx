import "../styles/dashboard/dashboard.css";
import "../styles/responsive.css";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BalanceCard from "../components/dashboard/BalancedCard";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import TransactionList from "../components/dashboard/TransactionList";
import ActionModal from "../components/common/ActionModel";
import FinancialOverview from "../components/dashboard/financial_overview";
import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";

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
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { showToast } = useToast();

  const loadTransactions = async () => {
    try {
        setPageLoading(true);

        const data = await getTransactions();

        setTransactions(data.transactions);
    } catch (error) {
        showToast.error(handleApiError(error));
    } finally {
        setPageLoading(false);
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

  // Deposit
  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      showToast("Enter a valid amount.", "error");
      return;
    }

    try {
      setLoading(true);

      await depositMoney(Number(depositAmount));

      await refreshDashboard();

      showToast(
        "Deposit completed successfully.",
        "success"
      );

      setTimeout(() => {
        setDepositAmount("");
        setShowDepositModal(false);
      }, 1200);
    } catch (error) {
      showToast(handleApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  // Withdraw
  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      showToast("Enter a valid amount.", "error");
      return;
    }

    try {
      setLoading(true);

      await withdrawMoney(Number(withdrawAmount));

      await refreshDashboard();

      showToast(
        "Withdrawal completed successfully.",
        "success"
      );

      setTimeout(() => {
        setWithdrawAmount("");
        setShowWithdrawModal(false);
      }, 1200);
    } catch (error) {
      showToast(handleApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="dashboard-grid">
        <div className="balance-section">
          <BalanceCard loading={pageLoading}  />
        </div>

        <div className="stats-section">
          <StatsCards transactions={transactions} loading={loading} />
        </div>

        <div className="overview-section">
          <FinancialOverview transactions={transactions} />
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
            loading={pageLoading}
          />
        </div>
      </div>

      {/* Deposit */}
      <ActionModal
        isOpen={showDepositModal}
        title="Deposit Amount"
        submitText="Deposit"
        loading={loading}
        onClose={() => {
          setShowDepositModal(false);
          setDepositAmount("");
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
      </ActionModal>

      {/* Withdraw */}
      <ActionModal
        isOpen={showWithdrawModal}
        title="Withdraw Money"
        submitText="Withdraw"
        loading={loading}
        onClose={() => {
          setShowWithdrawModal(false);
          setWithdrawAmount("");
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
      </ActionModal>
    </DashboardLayout>
  );
}

export default Dashboard;