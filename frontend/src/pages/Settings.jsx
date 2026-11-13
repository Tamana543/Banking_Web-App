import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import { deleteAccount } from "../api/authApi";
import { updateDisplayCurrency } from "../api/currencyApi";
import ActionModal from "../components/common/ActionModel";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import useRates from "../hooks/useRates";
import handleApiError from "../util/handleApiError";

import "../styles/settings.css";
function Settings() {
    const navigate = useNavigate();
    const { logout, user, setUser } = useAuth();
    const rates = useRates();
    const { showToast } = useToast();
    const [savingCurrency, setSavingCurrency] = useState(false);
   const [showDelete, setShowDelete] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deletePin, setDeletePin] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);

    const openDelete = () => {
        setDeletePassword("");
        setDeletePin("");
        setDeleteConfirm("");
        setShowDelete(true);
    };

    const closeDelete = () => {
        if (!deleting) setShowDelete(false);
    };
    
    const handleCurrencyChange = async (event) => {
        try {
            setSavingCurrency(true);
            const data = await updateDisplayCurrency(event.target.value);
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            showToast("Display currency updated.", "success");
        } catch (error) {
            showToast(handleApiError(error), "error");
        } finally {
            setSavingCurrency(false);
        }
    };
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
                <div className="setting-item">
            <div>
                <h4>Display currency</h4>
                <p>Show an approximate balance in another currency</p>
            </div>
            <select className="setting-select" aria-label="Display currency" value={user?.displayCurrency || "USD"} onChange={handleCurrencyChange} disabled={savingCurrency} >
                {Object.entries(rates?.currencies || { USD: { name: "US Dollar" } }).map(
                    ([code, info]) => (
                        <option key={code} value={code}>
                            {code} - {info.name}
                        </option>
                    )
                )}
            </select>
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
        <div className="setting-item logout" onClick={() => { logout(); navigate("/login", { replace: true, }); }} >
            <div>
                <h4>Logout</h4>
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