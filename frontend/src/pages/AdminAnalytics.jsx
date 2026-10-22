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

  return (
    <DashboardLayout>
      <DashboardHeader />
      <div className="analytics-header">
        <h1>Platform Trends</h1>
        <p>How users, money and loans are moving across the platform.</p>
        <div className="transaction-filter">
          <select
            aria-label="Time range"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>
      <section className="analytics-page">
        <div className="analytics-overview">
          <div className="analytics-card income">
            <p>New Users</p>
            <h2>{totalNewUsers.toLocaleString()}</h2>
          </div>
          <div className="analytics-card balance">
            <p>Transactions</p>
            <h2>{totalTransactions.toLocaleString()}</h2>
          </div>
          <div className="analytics-card expense">
            <p>Money Moved</p>
            <h2>{money(totalMoved)}</h2>
          </div>
        </div>

        <div className="analytics-grid">
          <section className="analytics-card">
            <h3>New Users per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={shortDate} minTickGap={20} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="newUsers" name="New users" fill="#d4af37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <section className="analytics-card">
            <h3>Money Moved per Day</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={shortDate} minTickGap={20} />
                <YAxis />
                <Tooltip formatter={(value) => money(value)} />
                <Legend />
                <Line type="monotone" dataKey="deposits" name="Deposits" stroke="#d4af37" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#8b1e1e" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="transfers" name="Transfers" stroke="#4f46e5" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="analytics-card">
            <h3>Transactions by Type</h3>
            {typeData.length === 0 ? (
              <p>No transactions in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {typeData.map((entry, index) => (
                      <Cell key={entry.name} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </section>

          <section className="analytics-card">
            <h3>Loan Requests by Status</h3>
            {loanData.length === 0 ? (
              <p>No loan requests in this period.</p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={loanData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {loanData.map((entry) => (
                      <Cell key={entry.name} fill={LOAN_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>
      </section>
    </DashboardLayout>
  );
  
}
