import "../styles/dashboard/dashboard.css";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BalanceCard from "../components/dashboard/BalancedCard";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransaction";
import Sidebar from "../components/dashboard/Sidebar";
import ActionModal from "../components/common/ActionModel";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { depositMoney, getTransactions } from "../api/transactionApi";
import { getCurrentUser } from "../api/authApi";
const [showWithdrawModal, setShowWithdrawModal] = useState(false);
const [showTransferModal, setShowTransferModal] = useState(false);

const [withdrawAmount, setWithdrawAmount] = useState("");

const [recipientEmail, setRecipientEmail] = useState("");
const [transferAmount, setTransferAmount] = useState("");

function Dashboard() {
  const navigate = useNavigate();
  const { logout,setUser } = useAuth();
  const [transactions,setTransactions] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  // Transaction handler
  const loadTransactions = async () => {
    try {
      const data = await getTransactions();

      setTransactions(data.transactions);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(()=>{
    loadTransactions();
  },[])
  //Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  //deposit handler
  const handleDeposit = async () => {
  if (!depositAmount || Number(depositAmount) <= 0) {
    alert("Enter a valid amount.");
    return;
  }

  try {
    await depositMoney(Number(depositAmount));

    const userData = await getCurrentUser();

    setUser(userData.user);

    await loadTransactions();

    setDepositAmount("");
    setShowDepositModal(false);
  } catch (error) {
    alert(error.message);
  }
};

  return (
  <div className="dashboard-layout">

    <Sidebar />

    <main className="dashboard">

      <DashboardHeader />

  <div className="dashboard-grid">

    <div className="balance-section">
      <BalanceCard />
    </div>

    <div className="stats-section">
      <StatsCards />
    </div>

    <div className="actions-section">
      <QuickActions onDeposit={() => setShowDepositModal(true)} />
    </div>

    <div className="transactions-section">
        onDeposit={() => setShowDepositModal(true)}
        onWithdraw={() => setShowWithdrawModal(true)}
        onTransfer={() => setShowTransferModal(true)}
    </div>

  </div>

    </main>
    <ActionModal
      isOpen={showDepositModal}
      title="Deposit Amounts"
      submitText="Deposit"
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
  </div>
);
}

export default Dashboard;