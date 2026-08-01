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
// hooks
import useTransactions from "../hooks/useTransactions";
import useApiAction from "../hooks/useApiAction";

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
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { showToast } = useToast();
  const { transactions, loading: pageLoading, loadTransactions, } = useTransactions();
  const { loading, execute } = useApiAction();

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
      await execute(
        () => depositMoney(Number(depositAmount)),
        {
          successMessage:
            "Deposit completed successfully.",

          onSuccess: async () => {
            await refreshDashboard();

            setDepositAmount("");

            setShowDepositModal(false);
          },
        }
      );
  };

  // Withdraw
  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      showToast("Enter a valid amount.", "error");
      return;
    }

    await execute(
      () => withdrawMoney(Number(withdrawAmount)),
      {
        successMessage:
          "Withdrawal completed successfully.",

        onSuccess: async () => {
          await refreshDashboard();

          setWithdrawAmount("");

          setShowWithdrawModal(false);
        },
      }
    );
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