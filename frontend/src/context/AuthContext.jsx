import { createContext, useContext, useEffect, useRef, useState, } from "react";
const AuthContext = createContext();
const getTokenExpiration = (jwtToken) => {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    if (!payload.exp) {
      return null;
    }
    return payload.exp * 1000;
  } catch {
    return null;
  }
};
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const logoutTimer = useRef(null);
  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };
  const clearAuth = () => {
    clearLogoutTimer();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };
  const startLogoutTimer = (jwtToken) => {
    clearLogoutTimer();
    const expiration = getTokenExpiration(jwtToken);
    if (!expiration) {
      clearAuth();
      return;
    }
    const remainingTime = expiration - Date.now();
    if (remainingTime <= 0) {
      clearAuth();
      return;
    }
    logoutTimer.current = setTimeout(() => {
      clearAuth();
    }, remainingTime);
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!storedUser || !storedToken) {
      clearAuth();
      setAuthLoading(false);
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      const expiration = getTokenExpiration(storedToken);
      if (!expiration || expiration <= Date.now()) {
        clearAuth();
        setAuthLoading(false);
        return;
      }
      setUser(parsedUser);
      setToken(storedToken);
      startLogoutTimer(storedToken);
    } catch {
      clearAuth();
    }
    setAuthLoading(false);
    return () => {
      clearLogoutTimer();
    };
  }, []);
  const login = (userData, jwtToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    setUser(userData);
    setToken(jwtToken);
    startLogoutTimer(jwtToken);
  };
  const logout = () => {
    clearAuth();
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, authLoading, }} > {children} </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);