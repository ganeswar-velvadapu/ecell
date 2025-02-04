import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password }, { withCredentials: true });
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true });
      console.log(res)
      setUser(res.data.user);

      navigate("/"); 
    } catch (error) {
      console.log("Login failed:", error.response?.data?.message || "Unknown error");
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, { withCredentials: true });
      setUser(null);
      navigate("/login"); 
    } catch (error) {
      console.log("Logout failed:", error.response?.data?.message || "Unknown error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
