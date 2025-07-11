import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const isAdmin = localStorage.getItem("adminToken");
  const isReceptionist = localStorage.getItem("receptionistToken");

  if (role === "admin" && !isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  if (role === "receptionist" && !isReceptionist) {
    return <Navigate to="/receptionist-login" replace />;
  }

  return children;
}
