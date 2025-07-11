import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaUserTie, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

const handleLogout = () => {
  setShowLogoutModal(true);
};

const confirmLogout = () => {
  localStorage.clear();
  sessionStorage.clear();
  navigate("/", { replace: true });
  window.location.reload();
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Welcome, {localStorage.getItem("name")}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold flex items-center gap-2 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>

        </div>

        {/* Logout Confirmation Overlay */}
        {showLogoutModal && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 text-center border border-red-500">
              <h3 className="text-lg font-semibold mb-4 text-red-700">Are you sure you want to logout?</h3>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={confirmLogout}
                  className="px-4 py-2 rounded border border-red-600 text-red-700 font-semibold hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded border border-blue-600 text-blue-700 font-semibold hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="px-6 md:px-10 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <DashboardCard
              title="Doctor Management"
              icon={<FaUserMd size={50} className="text-purple-200" />}
              color="bg-gradient-to-br from-purple-500 to-purple-700"
              hoverColor="hover:from-purple-600 hover:to-purple-800"
              onClick={() => navigate("/doctor-dashboard")}
              description="Manage doctor profiles, schedules, and access."
            />
            <DashboardCard
              title="Receptionist Management"
              icon={<FaUserTie size={50} className="text-emerald-200" />}
              color="bg-gradient-to-br from-emerald-500 to-emerald-700"
              hoverColor="hover:from-emerald-600 hover:to-emerald-800"
              onClick={() => navigate("/receptionist-management")}
              description="Handle receptionist accounts and permissions."
            />
            <DashboardCard
              title="Appointment Oversight"
              icon={<FaCalendarAlt size={50} className="text-amber-200" />}
              color="bg-gradient-to-br from-amber-500 to-amber-700"
              hoverColor="hover:from-amber-600 hover:to-amber-800"
              onClick={() => navigate("/appointment-oversight")}
              description="View and manage all patient appointments."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, icon, onClick, color, hoverColor, description }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-8 rounded-3xl shadow-lg transform transition-all duration-300 ease-in-out ${color} ${hoverColor} text-white overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
      <div className="mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
      <p className="text-sm text-center opacity-90 px-2">{description}</p>
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </button>
  );
}
