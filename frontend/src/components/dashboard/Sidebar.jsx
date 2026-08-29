import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/dashboard/hamburger.css";
import "../../styles/dashboard/sidebar.css";
import { LayoutDashboard, ArrowRightLeft, Landmark, ChartColumn, UserRound, Settings,PiggyBank } from "lucide-react";
function Sidebar({ sidebarOpen, setSidebarOpen, }) {
  const navigate = useNavigate();
  const firstNavLinkRef = useRef(null);
  useEffect(() => {
    if (sidebarOpen) {
      firstNavLinkRef.current?.focus();
    }
  }, [sidebarOpen]);
  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen, setSidebarOpen]);
  return (
    <>
      <aside id="dashboard-sidebar" className={`sidebar ${sidebarOpen ? "open" : ""}`} aria-label="Dashboard navigation"
      >
        <div className="sidebar-logo" onClick={() => navigate("/")}
        >
          <h2>BANKIST</h2>
          <span>PRO</span>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink ref={firstNavLinkRef} to="/dashboard" onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard size={20} aria-hidden="true"
            />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" onClick={() => setSidebarOpen(false)}
          >
            <ArrowRightLeft size={20} aria-hidden="true"
            />
            <span>Transactions</span>
          </NavLink>
          <NavLink to="/transfer" onClick={() => setSidebarOpen(false)}
          >
            <ArrowRightLeft size={20} aria-hidden="true"
            />
            <span>Transfer</span>
          </NavLink>
          <NavLink to="/loans" onClick={() => setSidebarOpen(false)}
          >
            <Landmark size={20} aria-hidden="true"
            />
            <span>Loans</span>
          </NavLink>
          <NavLink to="/analytics" onClick={() => setSidebarOpen(false)}
          >
            <ChartColumn
              size={20}
              aria-hidden="true"
            />
            <span>Analytics</span>
          </NavLink>
          <NavLink to="/saving" onClick={() => setSidebarOpen(false)} >
              <PiggyBank size={20} aria-hidden="true" />
              <span>Savings</span>
            </NavLink>
          <NavLink to="/profile" onClick={() => setSidebarOpen(false)}
          >
            <UserRound size={20} aria-hidden="true"
            />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/settings" onClick={() => setSidebarOpen(false)}
          >
            <Settings size={20} aria-hidden="true"
            />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true"
        />
      )}
    </>
  );
}
export default Sidebar;