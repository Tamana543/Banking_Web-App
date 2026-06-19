import "../styles/dashboard/dashboard.css";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BalanceCard from "../components/dashboard/BalancedCard";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransaction";
import Sidebar from "../components/dashboard/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
    <RecentTransactions />
  </div>

</div>

    </main>

  </div>
);
}

export default Dashboard;