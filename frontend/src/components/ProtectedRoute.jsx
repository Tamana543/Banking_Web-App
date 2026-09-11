import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function ProtectedRoute({ children }) {
  const { user, token, authLoading } = useAuth();
  if (authLoading) {
    return null;
  }
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
export default ProtectedRoute;