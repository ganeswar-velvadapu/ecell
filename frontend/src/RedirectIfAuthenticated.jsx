import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

const RedirectIfAuthenticated = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; 

  return user ? <Navigate to="/" /> : children;
};

export default RedirectIfAuthenticated;
