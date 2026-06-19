import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ArrowRightLeft,
  Landmark,
  ChartColumn,
  UserRound,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>BANKIST</h2>
        <span>PRO</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/transactions">
          <ArrowRightLeft size={20} />
          <span>Transactions</span>
        </NavLink>

        <NavLink to="/transfer">
          <ArrowRightLeft size={20} />
          <span>Transfer</span>
        </NavLink>

        <NavLink to="/loans">
          <Landmark size={20} />
          <span>Loans</span>
        </NavLink>

        <NavLink to="/analytics">
          <ChartColumn size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/profile">
          <UserRound size={20} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;