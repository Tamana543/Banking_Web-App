import { useState } from "react";
import Sidebar from "./Sidebar";
import HamburgerButton from "./HamburgerButton";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">

      <HamburgerButton
        sidebarOpen={sidebarOpen}
        onClick={() => setSidebarOpen(prev => !prev)}
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="dashboard">
        {children}
      </main>

    </div>
  );
}

export default DashboardLayout;