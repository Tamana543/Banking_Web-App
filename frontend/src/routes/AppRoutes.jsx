import { Routes, Route } from "react-router-dom";
// if any error check the name of files as changed alot
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
        <Route path="*" element={<NotFound />} />
      </Routes>
      
    
  );
}
export default AppRoutes;