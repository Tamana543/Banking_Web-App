import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import "../styles/settings.css";
function Settings() {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <section className="settings-page">
        <h2>Settings</h2>
        <p className="settings-subtitle">
          Manage your application preferences and account settings.
        </p>
      </section>
    </DashboardLayout>
  );
}
export default Settings;