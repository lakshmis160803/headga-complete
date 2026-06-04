import { createContext, useContext, useEffect, useState } from "react";
import axiosinstance from "../api/apiinstances.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ id: null, name: null, role: null });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    axiosinstance.get("/auth/me")
      .then(res => setUser({ id: res.data.id, name: res.data.name, role: res.data.role }))
      .catch(() => setUser({ id: null, name: null, role: null }))
      .finally(() => setAuthLoading(false));
  }, []);

  const logout = async (navigate) => {
    await axiosinstance.post("/auth/logout");
    setUser({ id: null, name: null, role: null });
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);