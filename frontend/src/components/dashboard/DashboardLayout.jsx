import { useState } from "react";
import Sidebar from "./Sidebar";
import HamburgerButton from "./HamburgerButton";
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  return (
    <div className="dashboard-layout">
      <HamburgerButton
        sidebarOpen={sidebarOpen}
        onClick={toggleSidebar}
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main
        className="dashboard"
        id="main-content"
        tabIndex="-1"
      >
        {children}
      </main>
    </div>
  );
}
export default DashboardLayout;