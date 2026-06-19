import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>BANKIST</h2>
        <span>PRO</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
           Dashboard
        </NavLink>

        <NavLink to="/transactions">
          Transactions
        </NavLink>

        <NavLink to="/transfer">
      Transfer
        </NavLink>

        <NavLink to="/loans">
      Loans
        </NavLink>

        <NavLink to="/analytics">
      Analytics
        </NavLink>

        <NavLink to="/profile">
           Profile
        </NavLink>

        <NavLink to="/settings">
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;