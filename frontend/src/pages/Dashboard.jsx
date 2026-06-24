import "../styles/dashboard/dashboard.css";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BalanceCard from "../components/dashboard/BalancedCard";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransaction";
import Sidebar from "../components/dashboard/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { depositMoney, getTransactions } from "../api/transactionApi";


function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [transactions,setTransactions] = useState([]);

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
    const amount = prompt(
      "Enter deposit amount"
    );

    if (!amount) return;

    try {
      await depositMoney(Number(amount));

      await loadTransactions();

      window.location.reload();
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
    <QuickActions />
  </div>

  <div className="transactions-section">
    <RecentTransactions transactions={transactions}/>
  </div>

</div>

    </main>

  </div>
);
}

export default Dashboard;