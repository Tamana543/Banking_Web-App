import { Routes, Route } from "react-router-dom";
// if any error check the name of files as changed alot
import Landing from "../pages/Landing";
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

function AppRoutes() {
  return (
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transfer" element={<Transfer/>}/>
        <Route path="/loans" element={<Loan/>}/>
        <Route path="/analytics" element={<Analytics/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    
  );
}
export default AppRoutes;