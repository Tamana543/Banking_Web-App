import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/dashboard/hamburger.css";
import "../../styles/dashboard/sidebar.css";
import { LayoutDashboard, ArrowRightLeft, Landmark, ChartColumn, UserRound, Settings,PiggyBank,ShieldCheck,ClipboardCheck,ReceiptText,Gauge,TrendingUp,History } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Sidebar({ sidebarOpen, setSidebarOpen, }) {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        <nav className={`sidebar-nav ${user?.role === "admin" ? "sidebar-nav-compact" : ""}`} aria-label="Main navigation">
          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" end onClick={() => setSidebarOpen(false)}>
                <Gauge size={20} aria-hidden="true" />
                <span>Overview</span>
              </NavLink>
              <NavLink to="/admin/users" onClick={() => setSidebarOpen(false)}>
                <ShieldCheck size={20} aria-hidden="true" />
                <span>Users</span>
              </NavLink>
              <NavLink to="/admin/loans" onClick={() => setSidebarOpen(false)}>
                <ClipboardCheck size={20} aria-hidden="true" />
                <span>Loan Requests</span>
              </NavLink>
              <NavLink to="/admin/transactions" className="nav-tight" onClick={() => setSidebarOpen(false)}>
                <ReceiptText size={20} aria-hidden="true" />
                <span>All Transactions</span>
              </NavLink>
                <NavLink to="/admin/analytics" onClick={() => setSidebarOpen(false)}>
                  <TrendingUp size={20} aria-hidden="true" />
                  <span>Trends</span>
              </NavLink>
                <NavLink to="/admin/activity" onClick={() => setSidebarOpen(false)}>
                  <History size={20} aria-hidden="true" />
                  <span>Activity Log</span>
              </NavLink>
            </>
          )}
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
          <NavLink to="/savings-goals" onClick={() => setSidebarOpen(false)} >
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