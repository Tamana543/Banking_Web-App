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
  return(
     <main className="not-found">
      <div className="not-found-card">
        <span className="not-found-label">ERROR 404</span>
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1>This page doesn't exist.</h1>
        <p className="not-found-text">
          The link may be broken, or the page may have moved. Let's get you
          back on track.
        </p>
        {!authLoading && (
          <div className="not-found-actions">
            <Link
              to={loggedIn ? (isAdmin ? "/admin" : "/dashboard") : "/"}
              className="not-found-btn primary"
            >
              {loggedIn
                ? isAdmin
                  ? "Go to Admin Overview"
                  : "Go to Dashboard"
                : "Back to Home"}
            </Link>
            {!loggedIn && (
              <Link to="/login" className="not-found-btn">
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );

}
export default NotFound;