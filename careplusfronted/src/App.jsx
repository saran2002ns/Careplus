import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import ReceptionistLogin from "./pages/ReceptionistLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import ReceptionistManagement from "./pages/ReceptionistManagement";
import AppoinmentManagement from "./pages/AppoinmentManagement";
import DoctorManagement from "./pages/DoctorManagement";
import ProtectedRoute from "./services/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/receptionist-login" element={<ReceptionistLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist-management"
          element={
            <ProtectedRoute role="admin">
              <ReceptionistManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment-oversight"
          element={
            <ProtectedRoute role="admin">
              <AppoinmentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="admin">
              <DoctorManagement />
            </ProtectedRoute>
          }
        />

        {/* Receptionist Protected Routes */}
        <Route
          path="/receptionist-dashboard"
          element={
            <ProtectedRoute role="receptionist">
              <ReceptionistDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
