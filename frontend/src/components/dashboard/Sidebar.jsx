import { NavLink } from "react-router-dom";
import "../../styles/dashboard/hamburger.css";
import "../../styles/dashboard/sidebar.css";
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
  setSidebarOpen,
}) {
  return (
    <>
      <aside
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        aria-label="Dashboard sidebar"
      >
        <NavLink
          to="/"
          className="sidebar-logo"
          onClick={() => setSidebarOpen(false)}
          aria-label="Bankist Pro home"
        >
          <h2>BANKIST</h2>
          <span>PRO</span>
        </NavLink>
        <nav
          className="sidebar-nav"
          aria-label="Dashboard navigation"
        >
          <NavLink
            to="/dashboard"
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard
              size={20}
              aria-hidden="true"
            />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/transactions"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowRightLeft
              size={20}
              aria-hidden="true"
            />
            <span>Transactions</span>
          </NavLink>
          <NavLink
            to="/transfer"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowRightLeft
              size={20}
              aria-hidden="true"
            />
            <span>Transfer</span>
          </NavLink>
          <NavLink
            to="/loans"
            onClick={() => setSidebarOpen(false)}
          >
            <Landmark
              size={20}
              aria-hidden="true"
            />
            <span>Loans</span>
          </NavLink>
          <NavLink
            to="/analytics"
            onClick={() => setSidebarOpen(false)}
          >
            <ChartColumn
              size={20}
              aria-hidden="true"
            />
            <span>Analytics</span>
          </NavLink>
          <NavLink
            to="/profile"
            onClick={() => setSidebarOpen(false)}
          >
            <UserRound
              size={20}
              aria-hidden="true"
            />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            onClick={() => setSidebarOpen(false)}
          >
            <Settings
              size={20}
              aria-hidden="true"
            />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
export default Sidebar;