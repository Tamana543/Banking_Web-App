import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "../styles/settings.css";

function Settings() {
    const navigate = useNavigate();
    const { logout } = useAuth();
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="settings-page">
    <h2>Settings</h2>
    <p className="settings-subtitle">
        Manage your application preferences.
    </p>
    <div className="settings-card">
        <div className="setting-item" onClick={() => navigate("/profile")}>
            <div>
                <h4> Account</h4>
                <p>Edit your profile information</p>
            </div>
            <span>›</span>
        </div>
        <div className="setting-item" onClick={() => navigate("/profile")}>
            <div>
                <h4> Security</h4>
                <p>Password & PIN settings</p>
            </div>
            <span>›</span>
        </div>
        <div className="setting-item disabled">
            <div>
                <h4> Notifications</h4>
                <p>Coming Soon</p>
            </div>
            <span>›</span>
        </div>
        <div className="setting-item disabled">
            <div>
                <h4>Banking Preferences</h4>
                <p>Coming Soon</p>
            </div>
            <span>›</span>
        </div>
        <div className="setting-item" onClick={() => navigate("/dashboard")}>
            <div>
                <h4> About</h4>
                <p>Application information</p>
            </div>
            <span>›</span>
        </div>
        <div className="setting-item logout"  onClick={() => { logout(); navigate("/") }}>
            <div>
                <h4> Logout</h4>
                <p>Sign out of your account</p>
            </div>
            <span>›</span>
        </div>
    </div>
</section>
    </DashboardLayout>
  );
}
export default Settings;