import "../styles/loan.css"
import { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import HamburgerButton from "../components/dashboard/HamburgerButton";
import "../styles/dashboard/dashboard.css";
function loan(){
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [purpose, setPurpose] = useState("");
    const [duration, setDuration] = useState("");
    return (
          <div className="dashboard-layout">
          <HamburgerButton
               sidebarOpen={sidebarOpen}
               onClick={() =>
                    setSidebarOpen(!sidebarOpen)
               }
          />
          <Sidebar
               sidebarOpen={sidebarOpen}
               setSidebarOpen={setSidebarOpen}
          />
          <main className="dashboard">
               <DashboardHeader />
               <section className="loan-page">
                    <div className="loan-card">
                    </div>
               </section>
          </main>
          </div>
)
}
