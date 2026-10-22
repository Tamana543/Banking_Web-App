import { useEffect, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from "recharts";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import { getPlatformAnalytics } from "../api/adminApi";
import { useToast } from "../context/ToastContext";
import handleApiError from "../util/handleApiError";
import "../styles/analytics.css";
import "../styles/recent-transacrions.css";

const TYPE_COLORS = ["#d4af37", "#8b1e1e", "#4f46e5", "#22c55e"];
const LOAN_COLORS = {
  Pending: "#d4af37",
  Approved: "#22c55e",
  Rejected: "#ef4444",
};

const money = (value) => `$${Number(value || 0).toLocaleString()}`;
const shortDate = (date) => date.slice(5);

function AdminAnalytics() {
  const { showToast } = useToast();
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
      const loadAnalytics = async () => {
      try {
        setLoading(true);
        const result = await getPlatformAnalytics(days);
        setData(result);
      } catch (error) {
        setData(null);
        showToast(handleApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [days]);

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardHeader />
        <div className="analytics-loading">
          <p>Loading analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <DashboardHeader />
        <div className="analytics-empty">
          <h3>Unable to load analytics</h3>
        </div>
      </DashboardLayout>
    );
  }

  
}
