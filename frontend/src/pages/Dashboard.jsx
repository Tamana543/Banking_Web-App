import DashboardHeader from "../components/dashboard/DashboardHeader";
import BalanceCard from "../components/dashboard/BalancedCard";
import StatsCards from "../components/dashboard/StatsCards";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransaction";

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
    <main className="dashboard">

      <DashboardHeader />

      <BalanceCard />

      <StatsCards />

      <QuickActions />

      <RecentTransactions />

      <button onClick={handleLogout}>
        Logout
      </button>

    </main>
  );
}

export default Dashboard;