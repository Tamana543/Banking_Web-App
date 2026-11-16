import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import HamburgerButton from "./HamburgerButton";
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const wasOpen = useRef(false);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  useEffect(() => {
    if (wasOpen.current && !sidebarOpen) {
      hamburgerRef.current?.focus();
    }
    wasOpen.current = sidebarOpen;
  }, [sidebarOpen]);
  return (
    <div className="dashboard-layout">
      <HamburgerButton
        ref={hamburgerRef}
        sidebarOpen={sidebarOpen}
        onClick={toggleSidebar}
        aria-expanded={sidebarOpen}
        aria-controls="dashboard-sidebar"
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main
        className="dashboard"
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
export default DashboardLayout;