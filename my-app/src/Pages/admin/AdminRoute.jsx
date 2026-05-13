import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosinstance from "../../api/apiinstances.js";

function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosinstance.get("/auth/me", {
      withCredentials: true
    })
    .then(res => setUser(res.data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Checking access...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;