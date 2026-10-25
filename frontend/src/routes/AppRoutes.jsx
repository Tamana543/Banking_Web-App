import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Transfer from "../pages/Transfer";
import Loan from "../pages/Loan";
import Analytics from "../pages/Analytics"
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import SavingsGoals from "../pages/SavingGoals";

// Admin routes 
import AdminRoute from "./AdminRoute";
import AdminUsers from "../pages/admin/AdminUser";
import AdminLoans from "../pages/admin/AdminLoans";
import AdminTransactions from "../pages/admin/AdminTransactions";
import AdminUserDetail from "../pages/admin/AdminUserDetail";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminAuditLog from "../pages/admin/AdminAuditLog";

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/transactions" element={ <ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/transfer" element={<ProtectedRoute><Transfer/></ProtectedRoute>}/>
        <Route path="/loans" element={<ProtectedRoute><Loan/></ProtectedRoute>}/>
        <Route path="/analytics" element={<ProtectedRoute><Analytics/></ProtectedRoute>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>}/>
        <Route path="/savings-goals" element={ <ProtectedRoute> <SavingsGoals /> </ProtectedRoute> } />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/loans" element={<AdminRoute><AdminLoans /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
        <Route path="/admin/transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
        <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
        <Route path="/admin/activity" element={<AdminRoute><AdminAuditLog /></AdminRoute>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    
  );
}
export default AppRoutes;