import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import TransactionSkeleton from "../components/common/TransactionSkeleton";
import { getPlatformStats } from "../api/adminApi";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import "../styles/dashboard/dashboard.css";
import "../styles/dashboard/stats-card.css";
import "../styles/components/modal.css";
import "../styles/admin.css";

const money = (value) =>
  `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

function StatCard({ label, value, hint, children }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <p className="admin-stat-value">{value}</p>
      {hint && <small className="admin-stat-hint">{hint}</small>}
      {children}
    </div>
  );
}

function AdminDashboard() {
     const navigate = useNavigate();
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPlatformStats();
        setStats(data);
      } catch (error) {
        showToast(handleApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);
}