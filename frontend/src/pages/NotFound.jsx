import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/not-found.css";

function NotFound(){
 const { user, token, authLoading } = useAuth();
  const loggedIn = Boolean(user && token);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found | Bankist Pro";
    return () => {
      document.title = previousTitle;
    };
  }, []);

}
export default NotFound;