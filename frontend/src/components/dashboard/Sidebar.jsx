import { NavLink } from "react-router-dom";
import "../../styles/dashboard/hamburger.css"
import "../../styles/dashboard/sidebar.css"
import {
  LayoutDashboard,
  ArrowRightLeft,
  Landmark,
  ChartColumn,
  UserRound,
  Settings,
} from "lucide-react";

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}) {
 return (
  <>
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <h2>BANKIST</h2>
        <span>PRO</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          onClick={() => setSidebarOpen(false)}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/transactions"
          onClick={() => setSidebarOpen(false)}
        >
          <ArrowRightLeft size={20} />
          <span>Transactions</span>
        </NavLink>

        <NavLink
          to="/transfer"
          onClick={() => setSidebarOpen(false)}
        >
          <ArrowRightLeft size={20} />
          <span>Transfer</span>
        </NavLink>

        <NavLink
          to="/loans"
          onClick={() => setSidebarOpen(false)}
        >
          <Landmark size={20} />
          <span>Loans</span>
        </NavLink>

        <NavLink
          to="/analytics"
          onClick={() => setSidebarOpen(false)}
        >
          <ChartColumn size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/profile"
          onClick={() => setSidebarOpen(false)}
        >
          <UserRound size={20} />
          <span>Profile</span>
        </NavLink>

        <NavLink
          to="/settings"
          onClick={() => setSidebarOpen(false)}
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>

    {sidebarOpen && (
      <div
        className="sidebar-overlay"
        onClick={() => setSidebarOpen(false)}
      />
    )}
  </>
);
}

export default Sidebar;