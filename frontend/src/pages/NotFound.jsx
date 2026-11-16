import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/not-found.css"

// Animations
const particles = [
  [4, 5, 13, -2], [11, 8, 17, -9], [18, 6, 15, -5], [26, 10, 19, -13],
  [33, 5, 12, -1], [41, 7, 16, -7], [49, 9, 18, -11], [57, 6, 14, -4],
  [64, 8, 20, -16], [72, 5, 13, -8], [79, 10, 17, -3], [86, 7, 15, -12],
  [92, 6, 19, -6], [97, 9, 12, -10],
];
const twinkles = [
  [14, 18], [26, 78], [58, 9], [72, 88], [84, 34], [10, 58],
];


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
            <div className="not-found-stars" aria-hidden="true">
        {particles.map(([left, size, duration, delay], index) => (
          <span key={`particle-${index}`} className="not-found-particle" style={{ left: `${left}%`, width: `${size}px`, height: `${size}px`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, }} /> ))}
        {twinkles.map(([top, left], index) => (
          <span
            key={`twinkle-${index}`}
            className="not-found-twinkle"
            style={{ top: `${top}%`, left: `${left}%`, animationDelay: `${index * 0.7}s`, }} /> ))} </div>
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