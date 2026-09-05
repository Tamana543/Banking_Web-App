import { createContext, useContext, useEffect, useState, useRef, } from "react";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const logoutTimer = useRef(null);
  const logout = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };
  const startLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }
    /*
      Temporary client-side session timer. replace this with JWT-based
      expiration handling 
    */
    logoutTimer.current = setTimeout(() => {
      logout();
    }, 6 * 24 * 60 * 60 * 1000);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!storedUser || !storedToken) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthLoading(false);
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      startLogoutTimer();
    } catch (error) {
      console.error("Failed to restore authentication session.");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
    setAuthLoading(false);
  }, []);
  const login = (userData, jwtToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    setUser(userData);
    setToken(jwtToken);
    setAuthLoading(false);
    startLogoutTimer();
  };
  useEffect(() => {
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, authLoading, }} > {children} </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);