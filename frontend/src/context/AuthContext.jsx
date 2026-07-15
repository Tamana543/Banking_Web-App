import { createContext, useContext, useEffect, useState, useRef } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const logoutTimer = useRef(null); // Timer for the automatic logout 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      startLogoutTimer()
    }
  }, []);
  const startLogoutTimer = ()=>{
    if(logoutTimer.current){
      clearTimeout(logoutTimer.current)
    }
    // Logout after x days (for me I got 6)
    logoutTimer.current = setTimeout(()=>{
      logout();
    },6 * 24 * 60 * 60 * 1000)
  }
  const login = (userData, jwtToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);

    setUser(userData);
    setToken(jwtToken);
    startLogoutTimer();
  };

  const logout = () => {
     if (logoutTimer.current) {
    clearTimeout(logoutTimer.current);
  }
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        setUser,
  }}

    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);